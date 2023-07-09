import React from "react";
import Navbar from "../Navigation-Bar/Navbar";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div>
        
      </div>
      <div className={styles.pageTitle}>Want to sharpen your mind</div>
      <div className={styles.pageTitle}>Take A Daily Dose Of Quiz</div>
      <div>
        <div className={styles.quizContainer}>
          <div className={styles.quizContent}>
            <div className={styles.quizTitle}>Topic For Todays Quiz</div>
            <input
              type="text"
              placeholder="Quiz Topic..."
              className={styles.quizInput}
            />
            <button className={styles.button}>
              <Link to={"/questions"} className={styles.createQuiz}> Create Quiz</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
