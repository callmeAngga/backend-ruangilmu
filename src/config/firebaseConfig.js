var admin = require("firebase-admin");
// var serviceAccount = require("./serviceAccountKey.json");


if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_KEY),
    });
  }

module.exports = admin;