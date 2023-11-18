import React from "react";
import styles from "../../../src/Components/Authenticate/Authenticate.module.css"
import InputControl from "../InputControl/InputControl";

// This component is used to authenticate whether the user needs to signup or login and then redirect to that particular part of the form
function Authenticate(props) {

    // Taking the decision from the signup state, if it is true then signup otherwise simply login
    const checkSignUp = props.signup ? true : false;
    return (
        <div className={styles.container}>
            <p className={styles.backToHome}>{"< Back to Home"}</p>
            <form className={styles.form}>
                <p className={styles.heading}>{checkSignUp ? "Signup" : "Login"}</p>

                <InputControl label={"Username"} />
                <InputControl label={"Password"} isPassword />
            </form>
        </div>
    );
}

export default Authenticate;