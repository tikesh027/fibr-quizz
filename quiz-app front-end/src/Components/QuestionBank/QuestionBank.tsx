import React, { useEffect, useState } from "react";
import { TStore } from "../../Redux/Store/Store";
import { useDispatch, useSelector } from "react-redux";
import { requestQuestionList } from "../../Redux/Action/Question/QuestionAction";
import { Button, CircularProgress, Grid, Toolbar } from "@mui/material";
import styles from "./QuestionBank.module.css";
import NoRecordImg from "../../Images/LooksEmpty.gif";
import CreateNewQuestionModal from "./Components/CreateNewQuestionModal/CreateNewQuestionModal";
import QuestionList from "./Components/QuestionList/QuestionList";

export type TQuestionActionMode = "Add" | "Edit" | "View" | "AddToQuiz";

const QuestionBank = () => {
  const dispatch = useDispatch<any>();
  const questionList = useSelector((state: TStore) => state.question);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [mode, setMode] = useState<TQuestionActionMode>("Add");
  const [selectedQuestion, setSelectedQuestion] = useState("");

  useEffect(() => {
    fetchQuestionList();
  }, []);

  const fetchQuestionList = () => {
    dispatch(requestQuestionList());
  };

  const onViewQuestionDetails = (id: string) => {
    setSelectedQuestion(id);
    setShowNewQuestionModal(true);
    setMode("View");
  };

  const onEditQuestionDetails = (id: string) => {
    setSelectedQuestion(id);
    setShowNewQuestionModal(true);
    setMode("Edit");
  }

  const onCloseModal = () => {
    setShowNewQuestionModal(false);
    setSelectedQuestion("");
    setMode("Add");
  };

  const onOpenModal = () => {
    setShowNewQuestionModal(true);
  };
  if (questionList.isLoading) {
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
  if (!questionList.data.length) {
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
        <p>Looks like you don't have any question</p>
        <Button variant="contained" onClick={onOpenModal}>
          Create New Question
        </Button>
        <CreateNewQuestionModal
          mode={mode}
          fetchQuestionList={fetchQuestionList}
          onCloseModal={onCloseModal}
          showNewQuestionModal={showNewQuestionModal}
          selectedQuestion={selectedQuestion}
        />
      </Grid>
    );
  }
  return (
    <div>
      <Toolbar sx={{justifyContent:"end"}}>
        <Button variant="contained" onClick={onOpenModal}>Create New Question</Button>
      </Toolbar>
      <QuestionList
        onViewQuestionDetails={onViewQuestionDetails}
        onEditQuestionDetails={onEditQuestionDetails}
        fetchQuestionList={fetchQuestionList}
        mode={mode}
      />
      <CreateNewQuestionModal
        mode={mode}
        fetchQuestionList={fetchQuestionList}
        onCloseModal={onCloseModal}
        showNewQuestionModal={showNewQuestionModal}
        selectedQuestion={selectedQuestion}
      />
    </div>
  );
};

export default QuestionBank;
