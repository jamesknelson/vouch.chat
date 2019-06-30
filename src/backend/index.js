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
let nextStoreId = 1

export default class Backend {
  constructor({ deviceStorageOptions = undefined } = {}) {
    this.firebaseApp = firebase.initializeApp(
      config.firebase,
      String('app' + nextStoreId++),
    )
    this.deviceStorage = new DeviceStorage(deviceStorageOptions)
    this.auth = this.firebaseApp.auth()
    this.db = this.firebaseApp.firestore()
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
  }

  dispose() {
    this.currentUser.dispose()
    this.firebaseApp.delete()
  }
}
