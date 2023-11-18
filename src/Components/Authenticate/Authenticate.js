import React from "react";
import styles from "../../../src/Components/Authenticate/Authenticate.module.css"
import InputControl from "../InputControl/InputControl";
import { Link } from "react-router-dom";

// This component is used to authenticate whether the user needs to signup or login and then redirect to that particular part of the form
function Authenticate(props) {

    // Taking the decision from the signup state, if it is true then signup otherwise simply login
    const checkSignUp = props.signup ? true : false;
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <Link to='/'><p className={styles.backToHome}>{"< Back to Home"}</p></Link>

                <p className={styles.heading}>{checkSignUp ? "Sign Up" : "Login"}</p>

                {/* Checking for the error or empty name field */}

                {
                    checkSignUp &&
                    <InputControl label={"Name"} placeholder="Enter your name" />

                }
                <InputControl label={"Email"} placeholder="test@email.com" />
                <InputControl label={"Password"} placeholder="8-16 characters long" isPassword />
                <p className={styles.error}>Something is missing!</p>

                <button>{checkSignUp ? "Sign Up" : "Login"}</button>

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