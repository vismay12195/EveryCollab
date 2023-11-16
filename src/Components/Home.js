import React from 'react';
import styles from "./Home.module.css";
import HomeIcon from "../../src/Assets/HomeIcon.svg";
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    // When Clicked on Get Started it will navigate to next page with the help of useNavigate hook
    const navigateTo = useNavigate();

    const redirectOnClick = () => {
        navigateTo("/login");
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <p className={styles.heading}>EveryCollab</p>
                    <p className={styles.subheading}>A place that gives you complete control over your projects.</p>
                    <button onClick={redirectOnClick()}>Get Started <ArrowRight /></button>
                </div>
                <div className={styles.right}>
                    <img src={HomeIcon} alt='Homepage img' />

                </div>
            </div>
        </div>
    );
}

export default Home;