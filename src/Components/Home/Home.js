import React, { useEffect, useState } from 'react';
import styles from "./Home.module.css";
import HomeIcon from "../../Assets/HomeIcon.svg";
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../firebase';

import Spinner from '../Spinner/Spinner';
import ProjectModal from './ProjectModal/ProjectModal';

const Home = (props) => {
    // When Clicked on Get Started it will navigate to next page with the help of useNavigate hook
    const navigateTo = useNavigate();
    const loginAuthenticated = props.auth ? true : false;

    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [projects, setProjects] = useState([]);

    // ProjectModal states to show the modal and its data
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [projectModalDetails, setProjectModalDetails] = useState({});

    const redirectOnClick = () => {
        //Blocking the routing to the signup or login page once the user is being authenticated
        if (loginAuthenticated) navigateTo("/account");

        else navigateTo("/login");
    }

    const fetchAllProjects = async () => {
        const result = await getAllProjects();
        setProjectsLoaded(true);
        if (!result) {
            return;
        }

        const tempProjects = [];
        result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));
        setProjects(tempProjects);
    }

    useEffect(() => {
        fetchAllProjects();
    }, []);

    // Home Page Project Card Click Functionality to fetch the details of project 
    const handleProjectCardClick = (project) => {
        setShowProjectModal(true);
        setProjectModalDetails(project);
    }

    return (
        <div className={styles.container}>
            {
                showProjectModal &&
                <ProjectModal
                    onClose={() => setShowProjectModal(false)}
                    details={projectModalDetails}
                />
            }
            <div className={styles.header}>
                <div className={styles.left}>
                    <p className={styles.heading}>EveryCollab</p>
                    <p className={styles.subheading}>A place that gives you complete control over your projects.</p>
                    <button onClick={redirectOnClick}>{loginAuthenticated ? "Manage Projects" : "Get Started"}{" "}<ArrowRight />{" "}</button>
                </div>
                <div className={styles.right}>
                    <img src={HomeIcon} alt='Homepage img' />

                </div>
            </div>

            <div className={styles.body}>
                <p className={styles.title}>Accomplished Projects</p>
                <div className={styles.projects}>

                    {
                        projectsLoaded ? (
                            projects.length > 0 ? (
                                projects.map((item) => (
                                    <div className={styles.project}
                                        key={item.pid}
                                        onClick={() => { handleProjectCardClick(item) }}>
                                        <div className={styles.image}>
                                            <img src={item.thumbnail || "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"} alt="Project Thumbnail" />
                                        </div>
                                        <p className={styles.title}>{item.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No projects found</p>
                            )
                        ) : (<Spinner />)
                    }

                </div>
            </div>
        </div>
    );
}

export default Home;