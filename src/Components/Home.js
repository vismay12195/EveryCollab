import React from 'react';
import styles from "./Home.module.css";
import HomeIcon from "../../src/Assets/HomeIcon.svg";
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
    // When Clicked on Get Started it will navigate to next page with the help of useNavigate hook
    const navigateTo = useNavigate();
    const loginAuthenticated = props.auth ? true : false;

    const redirectOnClick = () => {
        if (loginAuthenticated) navigateTo('/account');

        else navigateTo('/login');
    }
    return (
        <div className={styles.container}>
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
        </div>
    );
}

export default Home;