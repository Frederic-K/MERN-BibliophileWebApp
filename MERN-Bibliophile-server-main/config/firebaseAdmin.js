import admin from "firebase-admin"
import config from "../config/config.js"

// Access Firebase Admin SDK credentials from configuration
const serviceAccount = config.firebaseServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.firebaseStorageBucket,
})

const bucket = admin.storage().bucket()

export default bucket
