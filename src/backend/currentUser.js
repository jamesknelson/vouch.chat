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
    this._db = db
    this._unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      this._receiveAuthUser(user)
    })
  }

  /**
   * This needs to be called after making any changes to the user object other
   * than login/logout, as firebase doesn't publish updates.
   *
   * E.g. it should be called when changing the profile, verifying an email,
   * etc.
   */
  async reload() {
    await this._auth.currentUser.reload()
    this._receiveAuthUser(this._auth.currentUser)
    return this.getCurrentValue()
  }

  dispose() {
    this._callbacks.length = 0

    if (this._unsubscribeSnapshot) {
      this._unsubscribeSnapshot()
    }

    if (this._unsubscribeAuthStateChanged) {
      this._unsubscribeAuthStateChanged()
    }

    this._unsubscribeSnapshot = undefined
    this._unsubscribeAuthStateChanged = undefined
  }

  getCurrentValue() {
    return Promise.resolve(this._currentUser)
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

  _receiveAuthUser(authUser) {
    if (this._unsubscribeSnapshot) {
      this._unsubscribeSnapshot()
      this._unsubscribeSnapshot = null
    }

    if (authUser) {
      let uid = authUser.uid
      let docReference = this._db.collection('users').doc(uid)
      let deferred = new Deferred()
      let settled = false
      this._setCurrentUser(deferred.promise)

      this._unsubscribeSnapshot = docReference.onSnapshot({
        error: error => {
          deferred.reject(error)
        },
        next: async userSnapshot => {
          // If there's no user object yet, then the user has just been
          // registered and a new object should be created shortly.
          // before logging in.
          if (!userSnapshot.exists) {
            return
          }

          let data = userSnapshot.data()

          if (!data) {
            deferred.reject()
          }
          if (data) {
            let photoURL = data.photoURL || defaultProfilePicture

            data.hasActiveSubscription =
              data.stripeSubscription &&
              data.stripeSubscription.status === 'active'
            data.availableVouches = data.availableVouches || 0

            data.canSetUsername =
              authUser.providerData[0].providerId !== 'password' ||
              authUser.emailVerified ||
              data.hasActiveSubscription

            // Wait until the profile photo has loaded
            data.photoImage = await new Promise((resolve, reject) => {
              let img = new Image()
              img.onload = resolve
              img.onerror = reject
              img.src = photoURL
            })

            let user = {
              ...authUser,
              ...data,
              uid,
              photoURL,
            }

            if (!settled) {
              settled = true
              deferred.resolve(user)
            } else {
              this._setCurrentUser(user)
            }
          }
        },
      })
    } else {
      this._setCurrentUser(null)
    }
  }

  _setCurrentUser(stateOrPromise) {
    if (stateOrPromise && stateOrPromise.then) {
      this._currentUser = stateOrPromise
      stateOrPromise.then(
        value => this._notifyCallbacks(value),
        () => this._notifyCallbacks(undefined),
      )
    } else {
      this._notifyCallbacks(stateOrPromise)
    }
  }

  _notifyCallbacks(value) {
    this._currentUser = value
    this._callbacks.forEach(callback => callback(value))
  }
}
