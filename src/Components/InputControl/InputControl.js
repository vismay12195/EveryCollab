import React, { useState } from "react";
import styles from "../../../src/Components/InputControl/InputControl.module.css";
import { Eye, EyeOff } from "react-feather";



// This component is used to control the input for each field of form, basically updates the input every single time
function InputControl({ label, isPassword, ...props }) {

    // Creating the Password field state when to show and when not to show
    const [isVisible, setIsVisible] = useState(true);

    return (
        <div className={styles.container}>
            {/* To update the labels dynamically */}
            {label && <label>{label}</label>}

            <div className={styles.inputContainer}>

                {/* If the field is a Password field in the form then show it as a "isPassword", otherwise show it as "text" */}
                <input type={isPassword ? (isVisible ? "text" : "password") : "text"}{...props} />

                {/* Adding the EYE icon functionalities and toggling the state for the Password field only */}
                {
                    isPassword &&
                    <div className={styles.icon}>
                        {isVisible ?
                            (<EyeOff onClick={() => setIsVisible((prev) => !prev)} />) :
                            (<Eye onClick={() => setIsVisible((prev) => !prev)} />)
                        }
                    </div>
                }

            </div>

        </div>
    );
}

export default InputControl;