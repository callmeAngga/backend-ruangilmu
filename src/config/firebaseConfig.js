var admin = require("firebase-admin");
// var serviceAccount = require("./serviceAccountKey.json");

const credentials = JSON.parse(process.env.FIREBASE_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
  }

module.exports = admin;