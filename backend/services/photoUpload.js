let bucket = null;
let firebaseInitialized = false;

const initializeFirebase = async () => {
  if (firebaseInitialized || !process.env.FIREBASE_PROJECT_ID) {
    return false;
  }

  try {
    const admin = await import('firebase-admin');

    // Handle private key formatting - convert escaped newlines to actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : null;

    if (!privateKey) {
      console.log('Firebase private key not found, using mock uploads');
      return false;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      }),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });

    bucket = admin.storage().bucket();
    firebaseInitialized = true;
    console.log('Firebase initialized successfully');
    return true;
  } catch (err) {
    console.log('Firebase initialization failed:', err.message);
    return false;
  }
};

export const uploadPhoto = async (base64Photo, userId, date) => {
  // Try to initialize Firebase if not already done
  const hasFirebase = await initializeFirebase();

  // Mock upload for local testing if Firebase not configured
  if (!hasFirebase || !bucket) {
    console.log('Photo upload mocked (Firebase not configured)');
    return `https://via.placeholder.com/400x600?text=Photo+${date}`;
  }

  try {
    const buffer = Buffer.from(base64Photo.split(',')[1], 'base64');
    const filename = `${userId}/${date}.jpg`;
    const file = bucket.file(filename);

    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return url;
  } catch (err) {
    console.error('Photo upload error:', err);
    return `https://via.placeholder.com/400x600?text=Error`;
  }
};
