// Config file
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import config from '../config'
import CurrentUser from './currentUser'
import DeviceStorage from './deviceStorage'

// Given that multiple pages can be rendered simultaneously, we'll need to
// give each Firebase app instance a unique id so that Firebase doesn't try
// to share resources between them.
global.nextStoreId = 1

export default class Backend {
  constructor({ deviceStorageOptions = undefined, ssr = false } = {}) {
    this.firebaseApp = firebase.initializeApp(
      config.firebase,
      String('app' + global.nextStoreId++),
    )
    this.deviceStorage = new DeviceStorage(deviceStorageOptions)
    this.auth = this.firebaseApp.auth()
    this.db = this.firebaseApp.firestore()

    // Firestore emulator is not currently supported in the browser.
    // See: https://github.com/firebase/firebase-tools/issues/1001
    // if (process.env.NODE_ENV !== 'production') {
    //   this.db.settings({
    //     host: process.env.REACT_APP_FIRESTORE_HOST || 'localhost:8080',
    //     ssl: false,
    //   })
    // }

    this.currentUser = new CurrentUser(this.auth, this.db)

    this.deviceConfig = {
      previousLoginProvider: this.deviceStorage.doc('previousLoginProvider'),
    }

    this.functions = this.firebaseApp.functions()
    if (process.env.NODE_ENV !== 'production') {
      this.functions.useFunctionsEmulator(
        process.env.REACT_APP_FUNCTIONS_URL || 'http://localhost:5000',
      )
    }

    // This handles the parameters that are passed back to the app after doing
    // a social login, and creates a new user record if required.
    if (!ssr) {
      this.auth.getRedirectResult().then(async userCredential => {
        if (
          userCredential.credential &&
          userCredential.credential.providerId &&
          userCredential.additionalUserInfo.isNewUser
        ) {
          let firebaseUser = userCredential.user
          let dbUser = {
            displayName:
              firebaseUser.displayName === null
                ? undefined
                : firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }

          if (userCredential.additionalUserInfo.isNewUser) {
            await this.db
              .collection('members')
              .doc(firebaseUser.uid)
              .set(dbUser, { merge: true })
          }

          await this.deviceConfig.previousLoginProvider.set(
            userCredential.credential.providerId,
          )
        }
      })
    }
  }

  dispose() {
    this.currentUser.dispose()
    this.firebaseApp.delete()
  }
}
