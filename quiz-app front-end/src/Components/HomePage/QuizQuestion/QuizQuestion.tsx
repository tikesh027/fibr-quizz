import React from 'react';
import Navbar from "../../Navigation-Bar//Navbar";
import styles from "./QuizQuestions.module.css";
import QuestionStructure from '../QuestionStructure/QuestionStructure';

const QuizQuestion = () => {
  return (
    <div>
        
        <div>
      <div>
      </div>
      <div className={styles.pageTitle}>Brew Your Question here</div>
      <div>
        <QuestionStructure/>
      </div>
    </div>
    </div>
  )
}

export default QuizQuestion;