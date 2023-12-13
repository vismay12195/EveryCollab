// Import the functions of Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, setDoc, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

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

// Creating an object to store the user profile pic to the Firebase's storage
const storage = getStorage(app);

// ====================== Users Database ===========================

//Function to add the users data to the database collection, uid is coming from the promise values user -> uid
const updateUserDatabase = async (user, uid) => {
    // If the user data is not in the form of object then just return
    if (typeof user !== "object") return;

    // setDoc is predefined in Firestore and it provides the document reference to the(db -> collection_name -> document_name) and fetches the data of user
    // setDoc is an async function
    const docRef = doc(db, "users", uid);
    // Adding the uid as well inside the setDoc() in order to save User Details to database using uid
    await setDoc(docRef, { ...user, uid });
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

// Adding the User Profile images to the Firebase Storage

const uploadImage = (file, progressCallback, urlCallback, errorCallback) => {
    if (!file) {
        errorCallback("File not found");
        return;
    }

    //Performing another 2 checks based on the image file's type and size

    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;

    if (!fileType.includes("image")) {
        errorCallback("File must be an image");
        return;
    }

    if (fileSize > 2) {
        errorCallback("File must be smaller than 2MB");
        return;
    }

    // Each Image has its reference in firebase's storage

    const storageRef = ref(storage, `images/${file.name}`);

    // Achieving the task of uploading an image

    const task = uploadBytesResumable(storageRef, file);

    // Applying the "on" listener on task which checks image "state_changed" with 3 different callbacks
    // which are "snapshot","error",()
    // snapshot is for checking the progress of uploading an image
    // error is to show any errors while an image is being uploaded
    // () is called when the whole image file is uploaded and we want to download the image from the storage

    task.on('state_changed', (snapshot) => {
        console.log(snapshot);

        // finding the progress of Image Uploading in percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCallback(progress);
    }, error => {
        errorCallback(error.message);
    }, () => {
        getDownloadURL(storageRef).then(url => {
            urlCallback(url);
        });
    });
};

// ====================== Projects Database ===========================

const addProjectInDatabase = async (project) => {
    if (typeof project !== "object") return;

    // projects it will be added to the collection by generating its reference
    const collectionRef = collection(db, "projects");
    await addDoc(collectionRef, { ...project });
};

const updateProjectInDatabase = async (project, pid) => {
    if (typeof project !== "object") return;

    const docRef = doc(db, "projects", pid);
    await setDoc(docRef, { ...project });
}

// To return all the project data
const getAllProjects = async () => {
    return await getDocs(collection(db, "projects"));
}

const getAllProjectsForUser = async (uid) => {
    if (!uid) return;
    const collectionRef = collection(db, "projects");
    const condition = where("refUser", "==", uid);
    const dbQuery = query(collectionRef, condition);

    return await getDocs(dbQuery);
}

// Functionality to delete user Projects
const deleteProject = async (pid) => {
    const docRef = doc(db, "projects", pid);
    await deleteDoc(docRef);
}


export {
    app as default,
    auth,
    db,
    updateUserDatabase,
    getUserFromDatabase,
    uploadImage,
    addProjectInDatabase,
    updateProjectInDatabase,
    getAllProjects,
    getAllProjectsForUser,
    deleteProject
};