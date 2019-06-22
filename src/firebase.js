// Config file
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import config from './config'

export default firebase.initializeApp(config.firebase)

export const db = firebase.firestore()
export const auth = firebase.auth()
export const functions = firebase.functions()

if (process.env.NODE_ENV !== 'production') {
  functions.useFunctionsEmulator('http://localhost:5000')
}
