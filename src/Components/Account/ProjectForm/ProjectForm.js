import styles from './ProjectForm.module.css';
import Modal from '../../Modal/Modal';
import InputControl from '../../InputControl/InputControl';
import { useRef, useState } from 'react';
import { X } from 'react-feather';
import { uploadImage } from '../../../firebase';

const ProjectForm = (props) => {
    //Adding reference to the image file
    const fileInputRef = useRef();

    // All the ProjectForm values would be updated
    const [values, setValues] = useState({
        thumbnail: "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png",
        github: "",
        link: "",
        title: "",
        overview: "",
        points: ["", ""]
    });

    // States needed for the handleFileInputChange
    const [errorMessage, setErrorMessage] = useState("");
    const [imageUploadStarted, setImageUploadStarted] = useState(false);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);

    //Adding the functionality to change the file of Thumbnail
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImageUploadStarted(true);
        uploadImage(
            file,
            (progress) => {
                setImageUploadProgress(progress);
            },
            (url) => {
                setImageUploadStarted(false);
                // once the downloaded url is there then setting the image progress to zero again
                setImageUploadProgress(0);
                setValues(prev => ({ ...prev, thumbnail: url }));
            },
            (error) => {
                setImageUploadStarted(false);
                setErrorMessage(error)
            }
        );
    }

    //Adding functionality to the Add Points Value Update
    const handlePointUpdate = (value, index) => {
        const tempPoints = [...values.points];
        tempPoints[index] = value;
        setValues(prev => ({ ...prev, points: tempPoints }))
    }

    //To Add Points to Project form adding the input fields
    const handleAddPoint = () => {
        if (values.points.length > 3) return;
        setValues(prev => ({ ...prev, points: [...values.points, ""] }))
    }

    // Functionality to work upon removing the added points
    const handlePointDelete = (index) => {
        const tempPoints = [...values.points];
        tempPoints.splice(index, 2);
        setValues(prev => ({ ...prev, points: tempPoints }));
    }

    // Adding the validation conditions before the submission of project form
    const validateForm = () => {
        const actualPoints = values.points.filter(item => item.trim());

        //Originally form is set to be validated
        let isValid = true;
        if (!values.thumbnail) {
            isValid = false;
            setErrorMessage("Project thumbnail/image is required");
        } else if (!values.github) {
            isValid = false;
            setErrorMessage("Project repository required");
        } else if (!values.title) {
            isValid = false;
            setErrorMessage("Project title required");
        } else if (!values.overview) {
            isValid = false;
            setErrorMessage("Project brief overview required");
        } else if (!actualPoints.length) {
            isValid = false;
            setErrorMessage("Project description required");
        } else if (actualPoints.length < 2) {
            isValid = false;
            setErrorMessage("Project description of at least 2 lines required");
        }

        return isValid;
    }


    const handleSubmission = () => {
        if (!validateForm()) return;
    }

    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <div className={styles.container}>

                {/* Adding the image as file type */}
                <input
                    type='file'
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileInputChange} />
                <div className={styles.inner}>
                    <div className={styles.left}>
                        <div className={styles.image}>
                            <img
                                src={values.thumbnail}
                                alt='Thumbnail'
                                onClick={() => fileInputRef.current.click()}></img>
                            <p><span>{imageUploadProgress.toFixed(2)}%</span> loaded</p>
                        </div>
                        <InputControl
                            label="Github"
                            placeholder="Project repository link"
                            value={values.github}
                            onChange={(event) => setValues((prev) => ({ ...prev, github: event.target.value }))}
                        />
                        <InputControl
                            label="Deployed Link"
                            placeholder="Project deployment link"
                            value={values.link}
                            onChange={(event) => setValues((prev) => ({ ...prev, link: event.target.value }))}
                        />
                    </div>

                    <div className={styles.right}>
                        <InputControl
                            label="Project Title"
                            placeholder="Enter project title"
                            value={values.title}
                            onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
                        />
                        <InputControl
                            label="Project Overview"
                            placeholder="Project's brief overview"
                            value={values.overview}
                            onChange={(event) => setValues((prev) => ({ ...prev, overview: event.target.value }))}
                        />
                        <div className={styles.description}>
                            <div className={styles.top}>
                                <p className={styles.title}>Project Description</p>
                                <p className={styles.link} onClick={handleAddPoint}>+ Add Points</p>
                            </div>
                            <div className={styles.inputs}>
                                {/* Add Points values are rendered based on its index in the array using the map */}
                                {
                                    values.points.map((item, index) =>
                                        <div className={styles.input}>
                                            <InputControl
                                                key={index}
                                                placeholder="Project description..."
                                                value={item}
                                                onChange={(event) => handlePointUpdate(event.target.value, index)}
                                            />
                                            {index > 1 && <X onClick={() => handlePointDelete(index)} />}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Adding the errorMessage */}
                <p className={styles.error}>{errorMessage}</p>

                <div className={styles.footer}>
                    {/* Adding the Cancel functionality using the onClose */}
                    <p className={styles.cancel} onClick={() => (props.onClose ? props.onClose() : "")}>Cancel</p>
                    <button className={styles.submitButton} onClick={handleSubmission}>Submit</button>
                </div>
            </div>
        </Modal>

    )
}

export default ProjectForm;