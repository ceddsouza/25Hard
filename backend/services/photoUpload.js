import admin from 'firebase-admin';

const bucket = admin.storage().bucket();

export const uploadPhoto = async (base64Photo, userId, date) => {
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
    throw err;
  }
};
