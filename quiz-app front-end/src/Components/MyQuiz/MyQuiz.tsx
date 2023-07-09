import React, { useEffect, useState } from "react";
import Navbar from "../Navigation-Bar/Navbar";
import NoRecordImg from "../../Images/LooksEmpty.gif";
import { useDispatch, useSelector } from "react-redux";
import { requestQuizList } from "../../Redux/Action/Quiz/QuizAction";
import { TStore } from "../../Redux/Store/Store";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./MyQuiz.module.css";
import CreateNewQuizModal from "./Components/CreateNewQuizModal/CreateNewQuizModal";
import QuizList from "./Components/QuizList/QuizList";
import { Toolbar } from "@mui/material";
import ViewAndEditQuiz from "./Components/ViewAndEditQuiz/ViewAndEditQuiz";

export type TQuizActionMode = "Add" | "Edit" | "View";

const MyQuiz = () => {
  const dispatch = useDispatch<any>();
  const quizList = useSelector((state: TStore) => state.quiz);
  const [showNewQuizModal, setShowNewQuizModal] = useState(false);
  const [showViewEditQuizModal, setShowViewEditQuizModal] = useState(false);
  const [mode, setMode] = useState<TQuizActionMode>("Add");
  const [selectedQuiz, setSelectedQuiz] = useState("");

  useEffect(() => {
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    dispatch(requestQuizList());
  };

  const onCloseModal = () => {
    setShowNewQuizModal(false);
  };

  const onOpenModal = () => {
    setShowNewQuizModal(true);
  };

  const onEditQuiz = (id: string) => {
    setSelectedQuiz(id);
    setMode("Edit");
    setShowViewEditQuizModal(true);
  };

  const onViewQuizDetails = (id: string) => {
    setSelectedQuiz(id);
    setMode("View");
    setShowViewEditQuizModal(true);
  };

  const onCloseViewEditModal = () => {
    setSelectedQuiz("");
    setMode("Add");
    setShowViewEditQuizModal(false);
  }

  if (quizList.isLoading) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={styles.root}
      >
        <CircularProgress />
      </Grid>
    );
  }
  if (!quizList.data.length) {
    return (
      <Grid
        container
        className={styles.root}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <img
          className={styles.noRecordAvatar}
          src={NoRecordImg}
          alt="no record found"
        />
        <p>Looks like you don't have any quiz</p>
        <Button variant="contained" onClick={onOpenModal}>
          Create New Quiz
        </Button>
        <CreateNewQuizModal
          fetchQuizList={fetchQuizList}
          onCloseModal={onCloseModal}
          showNewQuizModal={showNewQuizModal}
        />
      </Grid>
    );
  }
  return (
    <div>
      <Toolbar sx={{justifyContent:"end"}}>
        <Button variant="contained" onClick={onOpenModal}>Create New Quiz</Button>
      </Toolbar>
      <QuizList
        onEditQuiz={onEditQuiz}
        onViewQuizDetails={onViewQuizDetails}
        fetchQuizList={fetchQuizList}
      />
      <ViewAndEditQuiz
        handleViewEditModalClose={onCloseViewEditModal}
        mode={mode}
        selectedQuiz={selectedQuiz}
        showViewEditQuizModal={showViewEditQuizModal}
        fetchQuizList={fetchQuizList}
      />
      <CreateNewQuizModal
        fetchQuizList={fetchQuizList}
        onCloseModal={onCloseModal}
        showNewQuizModal={showNewQuizModal}
      />
    </div>
  );
};

export default MyQuiz;
