// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBPgYEXGAI-CQ97JmXAxkESytvV-GK0fE8",
    authDomain: "frontend-labs-nextjs.firebaseapp.com",
    projectId: "frontend-labs-nextjs",
    storageBucket: "frontend-labs-nextjs.firebasestorage.app",
    messagingSenderId: "23925096192",
    appId: "1:23925096192:web:d093303e2615303b403de5",
    measurementId: "G-PW1WY79BE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {
    auth,
};