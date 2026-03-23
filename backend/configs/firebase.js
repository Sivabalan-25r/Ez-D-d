const admin = require('firebase-admin');

try {
    const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-service-account.json');
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('🔥 Firebase Admin Initialized');
} catch (err) {
    console.warn('⚠️ Firebase Admin failed to initialize. Auth may be disabled.');
}

module.exports = admin;
