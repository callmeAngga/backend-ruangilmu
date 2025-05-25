const dotenv = require("dotenv");
dotenv.config();
var admin = require("firebase-admin");;

const credentials = JSON.parse(process.env.FIREBASE_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
  }

module.exports = admin;