import React, { useState } from "react";
import styles from "../../../src/Components/Authenticate/Authenticate.module.css"
import InputControl from "../InputControl/InputControl";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, updateUserDatabase } from "../../firebase";

// This component is used to authenticate whether the user needs to signup or login and then redirect to that particular part of the form
function Authenticate(props) {

    // Taking the decision from the signup state, if it is true then signup otherwise simply login
    const checkSignUp = props.signup ? true : false;
    const navigateTo = useNavigate();

    // In order to store the data of signup fields creating the state
    const [signupValues, setSignupValues] = useState({
        name: "",
        email: "",
        password: ""
    });

    //If there is any error then setting a state for those errors
    const [errorMsg, setErrorMsg] = useState("");

    //A state to disable button which prevents creation of same user data multiple times upon submission
    const [submitDisabledButton, setSubmitDisabledButton] = useState(false);

    // Creating a function to handle the login data upon formSubmission
    const formLogin = () => {

    }

    // Creating a function to handle the signup data upon formSubmission
    const formSignup = () => {
        if (!signupValues.name || !signupValues.email || !signupValues.password) {
            setErrorMsg("All fields required");
            return;
        }

        //In the initial state keeping the signup/login button in disabled state
        setSubmitDisabledButton(true);

        //Importing the auth class function of creating the user with its email and password which itself is a promise,
        // This promise won't work until the Authenticate from Firebase for Email and Password is enabled
        createUserWithEmailAndPassword(auth, signupValues.email, signupValues.password)
            .then(async (response) => {
                // To get the details from the user.uid of Firebase database
                const userId = response.user.uid;
                await updateUserDatabase({ name: signupValues.name, email: signupValues.email }, userId);
                // Once the database is stored to Firestore then preventing the button to be pressed multiple times
                setSubmitDisabledButton(false);
                // After signing up returning to the homepage
                navigateTo('/');
            })
            .catch((err) => {
                setSubmitDisabledButton(false);
                setErrorMsg(err.message);
            })
    };


    // Creating a function to handle the formSubmission event
    const formSubmission = (event) => {
        //preventDefault() makes sure that upon refresh of the page the data is not lost
        event.preventDefault();

        if (checkSignUp) return formSignup();
        else return formLogin();
    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={formSubmission}>
                <Link to='/'><p className={styles.backToHome}>{"< Back to Home"}</p></Link>

                <p className={styles.heading}>{checkSignUp ? "Sign Up" : "Login"}</p>

                {/* Checking for the error or empty name field */}

                {
                    checkSignUp && (
                        <InputControl label={"Name"} placeholder="Enter your name" onChange={(event) => setSignupValues((prev) => ({ ...prev, name: event.target.value }))} />

                    )}
                <InputControl label={"Email"} placeholder="test@email.com" onChange={(event) => setSignupValues((prev) => ({ ...prev, email: event.target.value }))} />
                <InputControl label={"Password"} placeholder="8-16 characters long" onChange={(event) => setSignupValues((prev) => ({ ...prev, password: event.target.value }))} isPassword />
                <p className={styles.error}>{errorMsg}</p>

                <button type="submit" disabled={submitDisabledButton}>{checkSignUp ? "Sign Up" : "Login"}</button>

                {/* Adding the bottom section to create an account and redirect or if account is already there then login */}
                <div className={styles.bottom}>
                    {
                        checkSignUp ?
                            (<p>Have an account? <Link to='/login'>Login</Link></p>) :
                            (<p>New here? <Link to='/signup'>Create an account</Link></p>)
                    }
                </div>
            </form>
        </div>
    );
}

export default Authenticate;