import React, { useEffect, useState } from "react";
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
  Drawer,
  IconButton,
} from "@mui/material";
import styles from "./CreateNewQuestionModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../../Api/ApiConstant";
import { getAuthToken } from "../../../../Utils/cookieHelper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import Option from "./Option";
import { cloneDeep, remove } from "lodash";
import { TQuestionActionMode } from "../../QuestionBank";
import { TStore } from "../../../../Redux/Store/Store";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
type CreateNewQuestionModalProps = {
  showNewQuestionModal: boolean;
  onCloseModal: () => void;
  fetchQuestionList: () => void;
  mode: TQuestionActionMode;
  selectedQuestion: string;
};
type formInput = {
  value: string;
  error: string;
  isValid: boolean;
};

type TOption = {
  id: number;
  text: string;
  isCorrect: boolean;
  isValid: boolean;
};

const questionTextInitialState: formInput = {
  error: "",
  isValid: true,
  value: "",
};

const optionsListInitialState: TOption[] = [
  {
    id: Math.random(),
    isCorrect: true,
    text: "",
    isValid: true,
  },
];

const CreateNewQuestionModal: React.FC<CreateNewQuestionModalProps> = ({
  onCloseModal,
  showNewQuestionModal,
  fetchQuestionList,
  selectedQuestion,
  mode,
}) => {
  const [questionText, setQuestionText] = useState<formInput>(
    questionTextInitialState
  );
  const questionList = useSelector((state: TStore) => state.question);
  const [creatQuestionError, setCreatQuestionError] = useState("");
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [options, setOptions] = useState<TOption[]>(optionsListInitialState);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (mode !== "Add") {
      populateQuestionData();
    }
  }, [mode]);

  const resetStates = () => {
    setOptions(optionsListInitialState);
    setQuestionText(questionTextInitialState);
    setIsCreatingQuestion(false);
    setCreatQuestionError("");
  };

  const handleCloseModel = () => {
    resetStates();
    onCloseModal();
  };

  const populateQuestionData = () => {
    if (!selectedQuestion || mode === "Add") return;
    const question = questionList.data.find(
      (question) => question._id === selectedQuestion
    );
    if (!question) return;
    const mappedOptions: TOption[] = question?.options.map((option) => ({
      id: Math.random(),
      isCorrect: option.isCorrect,
      isValid: true,
      text: option.text,
    }));
    setOptions(mappedOptions);
    setQuestionText({ error: "", isValid: true, value: question.question });
  };

  const handleQuestionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText({ error: "", isValid: true, value: event.target.value });
  };

  const createNewQuestion = async () => {
    try {
      setIsCreatingQuestion(true);
      const transformedOptions = options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
      }));
      const payload = {
        question: questionText.value,
        options: transformedOptions,
      };
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      await axios.post(`${API_BASE_URL}/question`, payload, { headers });
      fetchQuestionList();
      handleCloseModel();
    } catch (error: any) {
      setCreatQuestionError(error?.response?.data?.msg);
    } finally {
      setIsCreatingQuestion(false);
    }
  };

  const editQuestion = async () => {
    try {
      setIsCreatingQuestion(true);
      const transformedOptions = options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
      }));
      const payload = {
        question: questionText.value,
        options: transformedOptions,
      };
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      await axios.put(`${API_BASE_URL}/question/${selectedQuestion}`, payload, {
        headers,
      });
      fetchQuestionList();
      handleCloseModel();
    } catch (error: any) {
      setCreatQuestionError(error?.response?.data?.msg);
    } finally {
      setIsCreatingQuestion(false);
    }
  };

  const resetError = () => {
    setCreatQuestionError("");
  };

  const handleCorrectOption = (correctOptionIndex: number) => {
    const updatedOptions: TOption[] = options.map((item, index) => {
      if (index === correctOptionIndex) {
        return {
          ...item,
          isCorrect: true,
        };
      }
      return {
        ...item,
        isCorrect: false,
      };
    });
    setOptions(updatedOptions);
  };

  const handleOptionText = (text: string, index: number) => {
    const updatedOptions = cloneDeep(options);
    updatedOptions[index].text = text;
    updatedOptions[index].isValid = true;
    setOptions(updatedOptions);
  };

  const addMoreOption = () => {
    const updatedOptions = cloneDeep(options);
    updatedOptions.push({
      id: Math.random(),
      isCorrect: false,
      text: "",
      isValid: true,
    });
    setOptions(updatedOptions);
  };

  const deleteOption = (id: number) => {
    const updatedOptions = options.filter((option) => option.id !== id);
    if (updatedOptions.length === 1) {
      updatedOptions[0].isCorrect = true;
    }
    setOptions(updatedOptions);
  };

  const validateOptionText = () => {
    let isValid = true;
    const updatedOptions = options.map((option) => {
      if (option.text === "") {
        isValid = false;
        return {
          ...option,
          isValid: false,
        };
      }
      return option;
    });
    setOptions(updatedOptions);
    return isValid;
  };

  const validateQuestionForm = () => {
    const hasAtLeast1CorrectOption = options.some((option) => option.isCorrect);
    const hasAtleast2Options = options.length >= 2;
    if (!hasAtLeast1CorrectOption) {
      setCreatQuestionError("Please mark correct option !");
      setShowError(true);
    } else if (!hasAtleast2Options) {
      setCreatQuestionError("Please add atleast 2 options !");
      setShowError(true);
    }

    const allOptionsAreValid = validateOptionText();
    const isQuestionValid = questionText.value !== "";
    if (!isQuestionValid) {
      setQuestionText((prev) => ({
        ...prev,
        error: "Please enter question",
        isValid: false,
      }));
    }
    return hasAtLeast1CorrectOption && allOptionsAreValid && isQuestionValid && hasAtleast2Options;
  };

  const onSaveQuestion = () => {
    const formIsNotValid = validateQuestionForm();
    if (!formIsNotValid) return;
    if (mode === "Edit") {
      editQuestion();
      return;
    }
    createNewQuestion();
  };

  return (
    <Drawer
      open={showNewQuestionModal}
      onClose={handleCloseModel}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "50%" },
      }}
    >
      <DialogTitle
        className={styles.dialogTitle}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {mode === "View" ? "View Question" : null}
        {mode === "Add" ? "Create New Question" : null}
        {mode === "Edit" ? "Edit Question" : null}
        <IconButton onClick={handleCloseModel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {mode === "View" ? (
          <Typography variant="subtitle1" marginTop="20px">
            {questionText.value}
          </Typography>
        ) : (
          <TextField
            autoFocus
            multiline
            margin="dense"
            label="Question"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleQuestionName}
            helperText={questionText.error}
            error={!questionText.isValid}
            value={questionText.value}
          />
        )}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          marginTop="30px"
          gap="20px"
          width="70%"
        >
          {options.map((option, index) => (
            <Option
              handleCorrectOption={() => handleCorrectOption(index)}
              handleOptionText={(text) => handleOptionText(text, index)}
              isCorrectOption={option.isCorrect}
              optionNumber={index + 1}
              optionText={option.text}
              key={option.id}
              isValid={option.isValid}
              id={option.id}
              deleteOption={deleteOption}
              totalNoOfOptions={options.length}
              mode={mode}
            />
          ))}
          {mode === "View" ? null : (
            <Button onClick={addMoreOption} color="info" variant="outlined">
              Add More Option
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions className={styles.dialogAction}>
        <Button
          variant="outlined"
          disabled={isCreatingQuestion}
          onClick={handleCloseModel}
        >
          {mode === "View" ? "Close" : "Cancel"}
        </Button>
        {mode === "View" ? null : (
          <Button
            variant="contained"
            disabled={isCreatingQuestion}
            onClick={onSaveQuestion}
          >
            Save
          </Button>
        )}
      </DialogActions>
      <Snackbar
        open={Boolean(creatQuestionError)}
        autoHideDuration={6000}
        onClose={resetError}
      >
        <Alert onClose={resetError} severity="error" sx={{ width: "100%" }}>
          {creatQuestionError}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default CreateNewQuestionModal;
