import Deferred from 'utils/Deferred'

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
    this._unsubscribeAuthStateChanged = auth.onAuthStateChanged(user => {
      if (this._unsubscribeSnapshot) {
        this._unsubscribeSnapshot()
        this._unsubscribeSnapshot = null
      }

      if (user) {
        let docReference = db.collection('users').doc(user.uid)
        let deferred = new Deferred()
        this._setCurrentUser(deferred.promise)

        this._unsubscribeSnapshot = docReference.onSnapshot({
          error: error => {
            deferred.reject(error)
          },
          next: async doc => {
            // If there's no user object yet, then the user has just been
            // registered and a new object should be created shortly.
            // before logging in.
            if (!doc.exists) {
              return
            }

            let data = doc.data()
            if (!data) {
              deferred.reject()
            }
            if (data) {
              // Wait until the profile photo has loaded
              let photoURL = data.photoURL
              if (photoURL) {
                await new Promise((resolve, reject) => {
                  let img = new Image()
                  img.onload = resolve
                  img.onerror = reject
                  img.src = photoURL
                })
              }

              deferred.resolve({
                ...data,
                ...auth.currentUser,
              })
            }
          },
        })
      } else {
        this._setCurrentUser(null)
      }
    })
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
