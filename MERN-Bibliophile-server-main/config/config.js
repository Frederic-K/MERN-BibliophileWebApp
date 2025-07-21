import dotenv from "dotenv"

// Map environments to their respective .env files
const envFiles = {
  production: ".env.production",
  development: ".env.development",
  test: ".env.test",
}

// Determine the environment and load the corresponding .env file
const env = process.env.NODE_ENV || "development"
const envFile = envFiles[env] || ".env.development"
dotenv.config({ path: envFile })

const config = {
  db: process.env.DB_URI,
  port: process.env.PORT || 3000,
  jwtPrivateKey: process.env.JWT_SECRET_KEY,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  emailFrom: process.env.EMAIL_FROM,
  baseUrl: process.env.BASE_URL || "http://localhost:3000/api",
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || "http://localhost:5173",
  adminPwd: process.env.ADMIN_PWD,
  firebaseServiceAccount: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  },
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  logLevel: process.env.LOG_LEVEL || "info",
  clearSensitiveFieldsOnSignIn: process.env.CLEAR_SENSITIVE_FIELDS_ON_SIGNIN === "true",
  clearSensitiveFieldsOptions: {
    clearResetPassword: process.env.CLEAR_RESET_PASSWORD !== "false",
    clearPendingEmail: process.env.CLEAR_PENDING_EMAIL !== "false",
    clearEmailChange: process.env.CLEAR_EMAIL_CHANGE !== "false",
  },
  tokenCleanup: {
    enabled: process.env.TOKEN_CLEANUP_ENABLED === "true",
    cronSchedule: process.env.TOKEN_CLEANUP_SCHEDULE || "0 0 * * *", // default to daily at midnight
  },
}

export default config
