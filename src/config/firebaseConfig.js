import 'dotenv/config';
import admin from 'firebase-admin';

const credentials = JSON.parse(process.env.FIREBASE_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
  }

export default admin;