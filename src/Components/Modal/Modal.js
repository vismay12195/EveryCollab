import React from 'react';

import styles from './Modal.module.css';

const Modal = (props) => {
    return (
        <div className={styles.container} onClick={() => (props.onClose ? props.onClose() : "")}>

            {/* Also keeping in mind the bubbling feature of JS while clicking on the inner box and stopping its closing */}
            <div className={styles.inner} onClick={(event) => event.stopPropagation()}>
                {props.children}
            </div>
        </div>
    )
}

export default Modal;