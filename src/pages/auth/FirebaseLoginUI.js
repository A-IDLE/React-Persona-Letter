

import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css'; // Import FirebaseUI styles

// Correct import for firebaseui
import { auth as firebaseui } from 'firebaseui';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const FirebaseLoginUI = () => {
    useEffect(() => {
        // Check if there's an instance already
        const ui = firebaseui.AuthUI.getInstance() || new firebaseui.AuthUI(auth);

        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                {
                    provider: GoogleAuthProvider.PROVIDER_ID,
                    signInMethod: GoogleAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
                },
            ],
        });

        // Clean up UI when component unmounts
        return () => ui.delete();
    }, []);

    return <div id="firebaseui-auth-container"></div>;
};

export default FirebaseLoginUI;
