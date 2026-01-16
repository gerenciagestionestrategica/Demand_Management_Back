// src/db.js
const admin = require('firebase-admin');
require('dotenv').config();


const rawCredentials = {
  "type": process.env.TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.AUTH_X509_CERT_URL,
  "universe_domain": process.env.UNIVERSE_DOMAIN
}




admin.initializeApp({
  credential: admin.credential.cert(rawCredentials),
  storageBucket: process.env.FIREBASE_BUCKET
});

const bucket = admin.storage().bucket();



const db = admin.firestore();

db.settings({
  databaseId: "gestion-estrategica-ti", // o "gestion-estrategica-db"
});


module.exports = { db, bucket };
