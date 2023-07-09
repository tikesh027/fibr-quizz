import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { API_BASE_URL } from "../../../Api/ApiConstant";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../AttemptQuizLandingPage.module.css";

const cookie = new Cookies();

type QuizProps = {
  setIsRegistered: (value: boolean) => void;
};

const Quiz: React.FC<QuizProps> = ({ setIsRegistered }) => {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizDetails, setQuizDetails] = useState<any>();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (params.quiz_id) {
      fetchQuiz(params.quiz_id);
    }
  }, []);

  const fetchQuiz = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/participant/quiz/${id}`
      );
      setQuizDetails(response.data?.quiz);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectOption = (index: number) => {
    setActiveOptionIndex(index);
  };

  const onSubmitAnswer = () => {
    const isCorrectAnswer =
      quizDetails?.questions[activeQuestionIndex]?.options[activeOptionIndex]
        ?.isCorrect;
    if (isCorrectAnswer) {
      setScore((prev) => prev + 1);
    }
    if (activeQuestionIndex + 1 === quizDetails?.questions.length) {
      finishQuiz();
      return;
    }
    setActiveQuestionIndex((prev) => prev + 1);
    setActiveOptionIndex(-1);
  };

  const finishQuiz = async () => {
    try {
      setIsLoading(true);
      const email = cookie.get("participantEmail");
      const payload = {
        email: email,
        quizPayload: {
          quiz: params.quiz_id,
          score: score,
        },
      };
      await axios.post(`${API_BASE_URL}/participant/score`, payload);
      setShowFinishModal(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishQuiz = () => {
    setIsRegistered(false);
  };

  if (isLoading) {
    return (
      <Modal open={isLoading}>
        <CircularProgress
          className={styles.spinner}
          sx={{ color: "#28fffb" }}
        />
      </Modal>
    );
  }

  return (
    <Grid
      container
      height="100vh"
      justifyContent="center"
      alignItems="center"
      direction="row"
      className={styles.main}
    >
      <Grid
        item
        md={6}
        xs={8}
        height="50%"
        className={styles.quizContent}
        overflow="auto"
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h5">
            {quizDetails?.questions[activeQuestionIndex]?.question}
          </Typography>
          <Typography variant="subtitle2" color="#a7aab2" marginTop="20px">
            Select option
          </Typography>
          <Box display="flex" gap="28px" flexWrap="wrap">
            {quizDetails?.questions[activeQuestionIndex]?.options.map(
              (item: any, index: number) => (
                <Button
                  onClick={() => onSelectOption(index)}
                  variant={
                    activeOptionIndex === index ? "contained" : "outlined"
                  }
                  color={activeOptionIndex === index ? "warning" : "primary"}
                >
                  {item.text}
                </Button>
              )
            )}
          </Box>
          <Button
            onClick={onSubmitAnswer}
            className={styles.nextQuestion}
            variant="contained"
          >
            Next
          </Button>
        </Box>
      </Grid>
      <Dialog open={showFinishModal} onClose={handleFinishQuiz}>
        <DialogContent>
          <Typography>Thank you attempting the quiz 😊</Typography>
          <Typography>
            Your score is{" "}
            <strong>
              {score} out of {quizDetails?.questions.length}
            </strong>
          </Typography>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Quiz;
