import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./CreateNewQuizModal.module.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../Api/ApiConstant";
import { getAuthToken } from "../../../../Utils/cookieHelper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
type CreateNewQuizModalProps = {
  showNewQuizModal: boolean;
  onCloseModal: () => void;
  fetchQuizList: () => void;
};
type formInput = {
  value: string;
  error: string;
  isValid: boolean;
};

const CreateNewQuizModal: React.FC<CreateNewQuizModalProps> = ({
  onCloseModal,
  showNewQuizModal,
  fetchQuizList
}) => {
  const dispatch = useDispatch();
  const [quizName, setQuizName] = useState<formInput>({
    error: "",
    isValid: true,
    value: "",
  });
  const [signUpError, setSignUpError] = useState("");

  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const handleQuizName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName({ error: "", isValid: true, value: event.target.value });
  };
  const onSave = () => {
    if (!quizName.value) {
      setQuizName((prevState) => ({
        ...prevState,
        isValid: false,
        error: "Please enter quiz name",
      }));
      return;
    }
    createNewQuiz();
  };

  const createNewQuiz = async () => {
    try {
      setIsCreatingQuiz(true);
      const payload = {
        title: quizName.value,
      };
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      await axios.post(`${API_BASE_URL}/quiz`, payload, { headers });
      fetchQuizList();
      onCloseModal();
    } catch (error: any) {
      setSignUpError(error?.response?.data?.msg);
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const resetError = () => {
    setSignUpError("");
  };
  return (
    <Dialog
      open={showNewQuizModal}
      onClose={onCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      fullWidth
    >
      <DialogTitle>Create New Quiz</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter Quiz Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={handleQuizName}
          helperText={quizName.error}
          error={!quizName.isValid}
          value={quizName.value}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isCreatingQuiz} onClick={onCloseModal}>Cancel</Button>
        <Button disabled={isCreatingQuiz} onClick={onSave}>Save</Button>
      </DialogActions>
      <Snackbar
        open={Boolean(signUpError)}
        autoHideDuration={6000}
        onClose={resetError}
      >
        <Alert onClose={resetError} severity="error" sx={{ width: "100%" }}>
          {signUpError}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CreateNewQuizModal;
