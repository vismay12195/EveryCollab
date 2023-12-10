import React, { useEffect, useRef, useState } from "react";
import styles from './Account.module.css';
import { Camera, Edit2, GitHub, LogOut, Paperclip, Trash } from "react-feather";
import InputControl from "../InputControl/InputControl";
import { Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, getAllProjectsForUser, updateUserDatabase, uploadImage } from "../../firebase";
import ProjectForm from "./ProjectForm/ProjectForm";


const Account = (props) => {
    const userDetails = props.userDetails;
    const loginAuthenticated = props.auth;

    // Using the Reference hook for picking the image when clicked camera icon
    const imagePicker = useRef();
    // Image upload percentage progress state
    const [progress, setProgress] = useState(0);
    // Showing the profile image upload started or not for smaller profile image size
    const [profileImageUploadStarted, setProfileImageUploadStarted] = useState(false);
    // Upon complete profile image upload url state
    const [profileImageURL, setProfileImageURL] = useState("https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png");

    // ------ Storing the User Profile Details upon the state change while fetching userDetails from firebase ------
    const [userProfileDetails, setUserProfileDetails] = useState({
        name: userDetails.name,
        designation: userDetails.designation || "",
        github: userDetails.github || "",
        linkedin: userDetails.linkedin || ""
    });
    // Making sure that if there is no new details to save then no save button
    const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
    // Upon saving the Detail of user making the save button disabled
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
    // Showing an error message if any information is wrong for the userProfile
    const [errorMessage, setErrorMessage] = useState("");

    // ------ ProjectForm modal states and its functions upon clicking on the Add Projects button ------
    const [showProjectForm, setShowProjectForm] = useState(false);

    // Adding the Projects on the Accounts Page from the Firebase
    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [projects, setProjects] = useState([]);

    // Logout function definition using the signOut functionality of Firestore
    const accountLogout = async () => {
        await signOut(auth);
    };

    // Camera Click function to add the profile image for the user account
    const cameraClick = () => {
        imagePicker.current.click();
    }

    // Upon Selecting the image, it should change the image
    const imageChange = (event) => {
        // selecting the image file
        const file = event.target.files[0];

        if (!file) return;

        setProfileImageUploadStarted(true);
        // Calling the uploadImage function with its parameters from the firebase
        uploadImage(file,
            (progress) => setProgress(progress),
            (url) => {
                setProfileImageURL(url);
                saveUserImageToDatabase(url);
                setProfileImageUploadStarted(false);
                setProgress(0);
            },
            (err) => {
                console.log('Error ->', err);
                setProfileImageUploadStarted(true);
            }
        );

    };

    //Upon changes to the userProfile Details triggering the Save Details Button
    const inputControlChange = (event, property) => {
        setShowSaveDetailsButton(true);

        setUserProfileDetails((prev) => (
            {
                ...prev,
                [property]: event.target.value,
            }));
    };

    // Storing the User Profile Details to Database
    const saveUserDetailsToDatabase = async () => {
        // If there is no user name on the profile then showing error
        if (!userProfileDetails.name) {
            setErrorMessage("Name is required");
            return;
        }

        setSaveButtonDisabled(true);
        await updateUserDatabase({ ...userProfileDetails }, userDetails.uid);
        setSaveButtonDisabled(false);
        setShowSaveDetailsButton(false)
    }

    // Sending the User profile images to database too
    const saveUserImageToDatabase = (url) => {
        updateUserDatabase({ ...userProfileDetails, profileImage: url }, userDetails.uid);
    };

    // Fetching all projects from the firebase
    const fetchAllProjects = async () => {
        const result = await getAllProjectsForUser(userDetails.uid);
        if (!result) {
            setProjectsLoaded(true);
            return;
        }
        setProjectsLoaded(true);

        let tempProjects = [];
        result.forEach((doc) => tempProjects.push(doc.data()));
        setProjects(tempProjects);
    }

    useEffect(() => {
        fetchAllProjects()
    }, []);

    // Account verification would be implemented first
    return loginAuthenticated ? (
        <>
            <div className={styles.container}>

                {/* Conditional rendering of the ProjectForm modal */}
                {
                    showProjectForm &&
                    <ProjectForm onClose={() => setShowProjectForm(false)} uid={userDetails.uid} />

                }
                {/* -------------- # Header Part -------------- */}
                <div className={styles.header}>

                    {/* user name would be displayed */}
                    <p className={styles.heading}>Welcome <span>{userProfileDetails.name}</span></p>

                    <div className={styles.logout} onClick={accountLogout}>
                        <LogOut />Logout
                    </div>
                </div>

                {/* Adding the input field to the camera icon to add images from local computer with onClick event */}
                <input ref={imagePicker} type="file" style={{ display: "none" }} onChange={imageChange} />
                {/* -------------- # Section Part --------------   */}
                <div className={styles.section}>
                    <div className={styles.title}>Your Profile</div>
                    <div className={styles.profile}>
                        <div className={styles.left}>
                            <div className={styles.image}>
                                {/* Dynamically rendering the profile Image */}
                                <img src={profileImageURL} alt="Profile Image"></img>
                                <div className={styles.camera} onClick={cameraClick} >
                                    <Camera />
                                </div>
                            </div>
                            {
                                profileImageUploadStarted ? (
                                    <p className={styles.progress}>
                                        {/* Adding a constraint if the image takes too long to upload */}
                                        {
                                            (progress === 100) ? "Getting image" : `${progress.toFixed(2)}% uploaded`}</p>
                                )
                                    : ("")
                            }
                        </div>
                        <div className={styles.right}>
                            <div className={styles.row}>

                                {/* Updated user profile details are also stored in Firebase */}
                                <InputControl label="Name" placeholder="Enter your name"
                                    value={userProfileDetails.name}
                                    onChange={(event) => inputControlChange(event, "name")} />
                                <InputControl label="Title" placeholder="e.g. Front-end Developer"
                                    value={userProfileDetails.designation}
                                    onChange={(event) => inputControlChange(event, "designation")} />
                            </div>

                            <div className={styles.row}>
                                <InputControl label="Github" placeholder="Enter your Github URL"
                                    value={userProfileDetails.github}
                                    onChange={(event) => inputControlChange(event, "github")} />
                                <InputControl label="LinkedIn" placeholder="Enter your LinkedIn Link"
                                    value={userProfileDetails.linkedin}
                                    onChange={(event) => inputControlChange(event, "linkedin")} />
                            </div>

                            {/* Logic to show the errorMessage and "Save Details" Button as per the situation */}
                            <div className={styles.footer}>
                                <p className={styles.error}>{errorMessage}</p>
                                {
                                    showSaveDetailsButton &&
                                    <button className={styles.saveButton}
                                        disabled={saveButtonDisabled}
                                        onClick={saveUserDetailsToDatabase}>Save Details</button>
                                }
                            </div>

                        </div>
                    </div>
                </div>

                {/* Adding the Projects section */}
                <div className={styles.section}>
                    <div className={styles.projectsHeader}>
                        <div className={styles.title}>Your Projects</div>
                        <button className={styles.addProjectsButton} onClick={() => setShowProjectForm(true)}>Add Projects</button>
                    </div>

                    <div className={styles.projects}>
                        <div className={styles.project}>
                            <p className={styles.title}>E-commerce Store</p>
                            <div className={styles.links}>
                                <Edit2 />
                                <Trash />
                                <GitHub />
                                <Paperclip />
                            </div>
                        </div>

                        <div className={styles.project}>
                            <p className={styles.title}>Chat App</p>
                            <div className={styles.links}>
                                <Edit2 />
                                <Trash />
                                <GitHub />
                                <Paperclip />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (<Navigate to="/" />);
}

export default Account;