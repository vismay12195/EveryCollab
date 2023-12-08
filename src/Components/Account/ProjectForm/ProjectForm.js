import styles from './ProjectForm.module.css';
import Modal from '../../Modal/Modal';

const ProjectForm = (props) => {
    return (
        <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
            <h1>Hello</h1>
        </Modal>

    )
}

export default ProjectForm;