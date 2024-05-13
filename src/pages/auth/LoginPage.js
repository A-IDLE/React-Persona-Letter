import React from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleLogin } from '../../apis/auth';
import {request} from "../../apis/api"


const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const FIREBASE_PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = process.env.REACT_APP_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;


const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const auth = getAuth();

const signInWithGooglePopup = async () => {


    await signInWithPopup(auth, provider)
        .then((result) => {
            // user's access token for firebase
            const accessToken = result.user.accessToken;
            // store the access token in local storage
            localStorage.setItem("accessToken", accessToken); 

        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

    const accessToken = await localStorage.getItem("accessToken");

    // after firebase login, call googleLogin api
    const response = await googleLogin( accessToken );
    const userId = response.userId;

    // store the userId in local storage
    localStorage.setItem("userId", userId);

}

const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("characterId");
    console.log("Logout");


    const accessToken =localStorage.getItem("accessToken");
    console.log(accessToken);
}


const LoginPage = () => {

    const testHandler = async () => {
        const response = await request.get("/test");
        console.log(response.data);
    }
    
   


    const handleGoogleLogin = () => {
        console.log("Google Login is clicked");
        signInWithGooglePopup();
    }

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <button onClick={testHandler}>Test</button>
            <button onClick={logoutHandler}>Logout</button>
        </div>
    );
}

export default LoginPage;