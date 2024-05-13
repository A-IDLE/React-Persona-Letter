import React from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import { request } from "../../apis/api"
import './LoginPage.css';
import { GoogleLogin } from './GoogleLogin';
import { Logout } from './Logout';
import { FacebookLogin } from './FacebookLogin';

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
const analytics = getAnalytics(app);


const LoginPage = () => {

    const logoutHandler = () => {
        // 로그아웃시 local storage에 저장된 accessToken, userId 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        
        alert("로그아웃 되었습니다.");
    }

    const testHandler = async () => {
        const response = await request.get("/test");
        console.log(response.data);
    }

    return (
        <div className='LoginPage'>
            <div className='personaLetter'>
                <h1>Persona Letter</h1>
            </div>
            <div className='LoginContainer'>
                <GoogleLogin />
                <FacebookLogin />
                <button onClick={testHandler}>Test</button>
                <Logout />
            </div>
        </div>
    );
}

export default LoginPage;