import React from "react";
import styles from "../../../src/Components/InputControl/InputControl.module.css"


// This component is used to control the input for each field of form, basically updates the input every single time
function InputControl() {
    return (
        <div className={styles.container}>
            <label>Name:</label>
            <input type="text" />
        </div>
    );
}

export default InputControl;