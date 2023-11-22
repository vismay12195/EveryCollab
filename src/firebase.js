// Import the functions of Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDehwb1NUpsKE_I9o1t2YHZK2fxz1Kbn_w",
    authDomain: "everycollab-1256d.firebaseapp.com",
    projectId: "everycollab-1256d",
    storageBucket: "everycollab-1256d.appspot.com",
    messagingSenderId: "833583639869",
    appId: "1:833583639869:web:74f544337f079600a72954",
    measurementId: "G-SJX305FB05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Creating an object for Authentication

const authenticate = getAuth();

export { app as default, authenticate };