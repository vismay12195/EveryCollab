// Import the functions of Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'

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

const auth = getAuth(app);

// Creating an object for Cloud Firestore database
const db = getFirestore(app);
//Function to add the users data to the database collection, uid is coming from the promise values user -> uid
const updateUserDatabase = async (user, uid) => {
    // If the user data is not in the form of object then just return
    if (typeof user !== "object") return;

    // setDoc is predefined in Firestore and it provides the document reference to the(db -> collection_name -> document_name) and fetches the data of user
    // setDoc is an async function
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { ...user });
}

// Function to get the user data from the database collection
const getUserFromDatabase = async (uid) => {
    const docRef = doc(db, "users", uid);
    const result = await getDoc(docRef);
    // First checking whether the data for particular uid "exists()" in the database &
    // Secondly if the data exists the getting that data from the database using "data()"
    if (!result.exists()) return null;
    return result.data();
}


export { app as default, auth, db, updateUserDatabase, getUserFromDatabase };