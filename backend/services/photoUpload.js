let bucket = null;
let firebaseInitialized = false;

const initializeFirebase = async () => {
  if (firebaseInitialized || !process.env.FIREBASE_PROJECT_ID) {
    return false;
  }

  try {
    const admin = await import('firebase-admin');
    admin.initializeApp();
    bucket = admin.storage().bucket();
    firebaseInitialized = true;
    return true;
  } catch (err) {
    console.log('Firebase not configured, using mock uploads');
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
