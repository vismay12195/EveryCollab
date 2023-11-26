import React from "react";
import styles from './Account.module.css';
import { Camera, LogOut } from "react-feather";
import InputControl from "../InputControl/InputControl";
import { Navigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";


const Account = (props) => {
    const userDetails = props.userDetails;
    const loginAuthenticated = props.auth;

    // Logout function definition using the signOut functionality of Firestore
    const accountLogout = async () => {
        await signOut(auth);
    }
    // Account verification would be implemented first
    return loginAuthenticated ? (
        <>
            <div className={styles.container}>

                {/* -------------- # Header Part -------------- */}
                <div className={styles.header}>

                    {/* user name would be displayed */}
                    <p className={styles.heading}>Welcome <span>{userDetails.name}</span></p>

                    <div className={styles.logout} onClick={accountLogout}>
                        <LogOut />Logout
                    </div>
                </div>

                {/* -------------- # Section Part --------------   */}
                <div className={styles.section}>
                    <div className={styles.title}>Your Profile</div>
                    <div className={styles.profile}>
                        <div className={styles.left}>
                            <div className={styles.image}>
                                <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" alt="Profile Image"></img>
                                <button className={styles.camera}>
                                    <Camera />
                                </button>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.row}>
                                <InputControl label="Name" placeholder="Enter your name" />
                                <InputControl label="Title" placeholder="e.g. Front-end Developer" />
                            </div>

                            <div className={styles.row}>
                                <InputControl label="Github" placeholder="Enter your Github URL" />
                                <InputControl label="LinkedIn" placeholder="Enter your LinkedIn Link" />
                            </div>
                            <button className={styles.saveButton}>Save Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (<Navigate to="/" />);
}

export default Account;