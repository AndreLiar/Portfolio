import admin from 'firebase-admin';

// Check if Firebase Admin credentials are configured
const hasValidCredentials = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL !== 'your-firebase-admin-client-email' &&
  process.env.FIREBASE_PRIVATE_KEY !== 'your-firebase-admin-private-key';

let adminApp: admin.app.App | null = null;

if (hasValidCredentials) {
  // Initialize Firebase Admin with environment variables
  const adminApps = admin.apps;
  adminApp = adminApps.length === 0 
    ? admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.FIREBASE_PROJECT_ID!,
      })
    : adminApps[0];
} else {
  console.warn('⚠️  Firebase Admin credentials not configured. Admin features will be disabled.');
  console.warn('   To enable admin features, update your .env file with proper Firebase service account credentials');
}

// Export Firebase Admin services (will be null if credentials not configured)
export const adminAuth = adminApp ? admin.auth(adminApp) : null;
export const adminDb = adminApp ? admin.firestore(adminApp) : null;

export default adminApp;