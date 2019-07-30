import Deferred from 'utils/Deferred'
import defaultProfilePicture from 'media/defaultProfilePicture.svg'

/**
 * Firebase limits what can be stored in the user object itself; extra data
 * needs to be stored in a separate User record in the database.
 *
 * Given that the data in the User record may be rendered immediately upon
 * login, we want to wait for that data to be read in before updating the
 * authentication state. This wrapper around Firebase's auth module
 * facilitates this.
 */
export default class CurrentUser {
  _currentUser = undefined
  _callbacks = []

  constructor(auth, db) {
    this._auth = auth
    this._currentUserDeferred = new Deferred()
    this._db = db
    this._unsubscribeAuthStateChanged = auth.onAuthStateChanged(authUser => {
      this._receiveAuthUser(authUser)
    })
  }

  /**
   * This needs to be called after making any changes to the user object other
   * than login/logout, as firebase doesn't publish updates.
   *
   * E.g. it should be called when changing the user profile, verifying an
   * email, etc.
   */
  async reload() {
    await this._auth.currentUser.reload()
    this._receiveAuthUser(this._auth.currentUser)
    return this.getCurrentValue()
  }

  dispose() {
    this._clearAuthUser()
    this._callbacks.length = 0
    this._currentUserDeferred = undefined
    if (this._unsubscribeAuthStateChanged) {
      this._unsubscribeAuthStateChanged()
      this._unsubscribeAuthStateChanged = undefined
    }
  }

  getCurrentValue() {
    return (
      this._currentUser ||
      (this._currentUserDeferred && this._currentUserDeferred.promise)
    )
  }

  subscribe(callback) {
    this._callbacks.push(callback)
    return () => {
      let index = this._callbacks.indexOf(callback)
      if (index !== -1) {
        this._callbacks.splice(index, 1)
      }
    }
  }

  _clearAuthUser() {
    if (this._unsubscribeMemberSnapshot) {
      this._unsubscribeMemberSnapshot()
      this._unsubscribeMemberSnapshot = undefined
    }
    if (this._unsubscribeAccountSnapshot) {
      this._unsubscribeAccountSnapshot()
      this._unsubscribeAccountSnapshot = undefined
    }

    this._currentUser = undefined
    this._latestAuthUser = undefined
    this._latestMemberSnapshot = undefined
    this._latestAccountSnapshot = undefined

    if (!this._currentUserDeferred) {
      this._currentUserDeferred = new Deferred()
    }
  }

  _receiveError = error => {
    this._clearAuthUser()
    this._currentUserDeferred.reject(error)
  }

  _receiveAuthUser(authUser) {
    this._clearAuthUser()
    this._latestAuthUser = authUser

    if (!authUser) {
      this._setCurrentUser(null)
    } else {
      let uid = authUser.uid
      let memberRef = this._db.collection('members').doc(uid)
      let accountRef = memberRef.collection('private').doc('account')

      this._unsubscribeMemberSnapshot = memberRef.onSnapshot({
        error: this._receiveError,
        next: memberSnapshot => {
          // If there's no member object yet, then the user has just been
          // registered and a new object should be created shortly by the
          // register operation.
          if (!memberSnapshot.exists) {
            return
          }
          this._latestMemberSnapshot = memberSnapshot
          this._receivedSnapshot()
        },
      })

      this._unsubscribeAccountSnapshot = accountRef.onSnapshot({
        error: this._receiveError,
        next: accountSnapshot => {
          this._latestAccountSnapshot = accountSnapshot
          this._receivedSnapshot()
        },
      })
    }
  }

  async _computeCurrentUser() {
    let authUser = this._latestAuthUser
    let member = this._latestMemberSnapshot.data()
    let account = this._latestAccountSnapshot.exists
      ? this._latestAccountSnapshot.data()
      : {}

    let hasActiveSubscription =
      account.subscription && account.subscription.status === 'active'
    let photoURL = member.photoURL || defaultProfilePicture

    let currentUser = {
      ...authUser,
      ...member,
      ...account,
      hasActiveSubscription,
      photoURL,
      canSetUsername:
        authUser.providerData[0].providerId !== 'password' ||
        authUser.emailVerified ||
        hasActiveSubscription,
      availableCasts: account.availableCasts || 0,
      availableVouches: account.availableVouches || 0,
      hasOwnPhotoURL: !!member.photoURL,
      photoImage: await new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = resolve
        img.onerror = () => resolve(null)
        img.src = photoURL
      }),
    }

    return currentUser
  }

  async _receivedSnapshot() {
    if (!this._latestMemberSnapshot || !this._latestAccountSnapshot) {
      return
    }

    this._setCurrentUser(await this._computeCurrentUser())
  }

  _setCurrentUser(value) {
    this._currentUser = value
    if (this._currentUserDeferred) {
      this._currentUserDeferred.resolve(value)
      this._currentUserDeferred = undefined
    }
    this._callbacks.forEach(callback => callback(value))
  }
}
