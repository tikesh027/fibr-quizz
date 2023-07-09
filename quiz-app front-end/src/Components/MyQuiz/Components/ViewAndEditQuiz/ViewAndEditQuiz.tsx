import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { TQuizActionMode } from "../../MyQuiz";
import CloseIcon from "@mui/icons-material/Close";
import { getAuthToken } from "../../../../Utils/cookieHelper";
import axios from "axios";
import { API_BASE_URL } from "../../../../Api/ApiConstant";
import { useDispatch, useSelector } from "react-redux";
import { requestQuestionList } from "../../../../Redux/Action/Question/QuestionAction";
import { TStore } from "../../../../Redux/Store/Store";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import styles from "./ViewAndEditQuiz.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type ViewAndEditQuizProps = {
  showViewEditQuizModal: boolean;
  selectedQuiz: string;
  handleViewEditModalClose: () => void;
  mode: TQuizActionMode;
  fetchQuizList: () => void;
};

const ViewAndEditQuiz: React.FC<ViewAndEditQuizProps> = ({
  showViewEditQuizModal,
  selectedQuiz,
  handleViewEditModalClose,
  fetchQuizList,
  mode,
}) => {
  const dispatch = useDispatch<any>();
  const questionsList = useSelector((state: TStore) => state.question);
  const [quizQuestionsList, setQuizQuestionsList] = useState<string[]>([]);
  const [quizDetails, setQuizDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [quizError, setQuizError] = useState("");
  const [showAllQuestionModal, setAllQuestionModal] = useState(false);
  const questionDisplayList = useMemo(() => {
    return questionsList.data.filter((question) => {
      const hasQuestion = quizQuestionsList.find(
        (item) => item === question._id
      );
      return hasQuestion;
    });
  }, [quizQuestionsList, questionsList]);

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizDetails();
      dispatch(requestQuestionList());
    }
  }, [selectedQuiz]);

  const fetchQuizDetails = async () => {
    setIsLoading(true);
    try {
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      const response = await axios.get(`${API_BASE_URL}/quiz/${selectedQuiz}`, {
        headers,
      });
      const data = response.data?.getPerticularQuiz;
      setQuizDetails(data);
      const quizQuestionIdList = data?.questions?.map((item: any) => item._id);
      setQuizQuestionsList(quizQuestionIdList);
    } catch (error: any) {
      setQuizError(error?.response?.data?.msg);
    } finally {
      setIsLoading(false);
    }
  };

  const openAllQuestionModal = () => {
    setAllQuestionModal(true);
  };

  const closeAllQuestionModal = () => {
    setAllQuestionModal(false);
  };

  const addQuestionToQuiz = (id: string) => {
    const updatedList = [...quizQuestionsList];
    updatedList.push(id);
    setQuizQuestionsList(updatedList);
  };

  const removeQuestionFromQuiz = (id: string) => {
    const updatedList = quizQuestionsList.filter((question) => question !== id);
    setQuizQuestionsList(updatedList);
  };

  const editQuiz = async () => {
    try {
      setIsLoading(true);
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      const payload = {
        questions: quizQuestionsList,
      };
      const response = await axios.put(
        `${API_BASE_URL}/quiz/${selectedQuiz}`,
        payload,
        {
          headers,
        }
      );
      fetchQuizList();
      setQuizQuestionsList([]);
      handleViewEditModalClose();
    } catch (error: any) {
      setQuizError(error?.response?.data?.msg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyQuizLink = () => {
      navigator.clipboard.writeText(`${window.location.host}/attempt-quiz/${selectedQuiz}`);
  }

  return (
    <Drawer
      open={showViewEditQuizModal}
      onClose={handleViewEditModalClose}
      keepMounted={false}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: "50%" },
      }}
    >
      {isLoading ? (
        <Modal open={isLoading}>
          <CircularProgress
            className={styles.spinner}
            sx={{ color: "#28fffb" }}
          />
        </Modal>
      ) : null}
      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={styles.dialogTitle}
      >
        {mode === "View" ? "View Quiz Details" : null}
        {mode === "Edit" ? "Edit Quiz" : null}
        <IconButton onClick={handleViewEditModalClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box>
          <Typography
            variant="h6"
            sx={{ textDecoration: "underline" }}
            textAlign="center"
            margin="20px 0"
          >
            {quizDetails?.title}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography>
              Quiz Link :-{" "}
              <Typography
                color="#0066ff"
                component="span"
              >{`${window.location.host}/attempt-quiz/${selectedQuiz}`}</Typography>
            </Typography>
            <Tooltip title="Copy">
              <IconButton size="small" onClick={copyQuizLink}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            marginTop="18px"
            marginBottom="18px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="18px"
          >
            {questionDisplayList.length === 0 ? (
              <Typography>You have 0 questions in this quiz</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>S.no</TableCell>
                      <TableCell>Question</TableCell>
                      {mode === "Edit" ? <TableCell>Remove</TableCell> : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questionDisplayList?.map((question, index) => (
                      <TableRow key={question._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{question.question}</TableCell>
                        {mode === "Edit" ? (
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                removeQuestionFromQuiz(question._id)
                              }
                              color={"error"}
                            >
                              <ClearIcon />
                            </IconButton>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {mode === "Edit" ? (
              <Button variant="contained" onClick={openAllQuestionModal}>
                Add Questions
              </Button>
            ) : null}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className={styles.dialogAction}>
        <Button onClick={handleViewEditModalClose}>Close</Button>
        {mode === "View" ? null : <Button onClick={editQuiz}>Save</Button>}
      </DialogActions>

      <Dialog
        fullWidth
        open={showAllQuestionModal}
        onClose={closeAllQuestionModal}
      >
        <DialogTitle>Add Questions</DialogTitle>
        <DialogContent>
          <List sx={{}}>
            {questionsList.data.map((item) => {
              const isQuestionAdded = quizQuestionsList.find(
                (q) => q === item._id
              );
              return (
                <ListItem
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography
                    color={isQuestionAdded ? "green" : undefined}
                    flex={1}
                  >
                    {item.question}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      if (isQuestionAdded) {
                        removeQuestionFromQuiz(item._id);
                      } else {
                        addQuestionToQuiz(item._id);
                      }
                    }}
                    color={isQuestionAdded ? "error" : "info"}
                  >
                    {isQuestionAdded ? <ClearIcon /> : <AddIcon />}
                  </IconButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions className={styles.dialogAction}>
          <Button onClick={closeAllQuestionModal}>Done</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={Boolean(quizError)}
        autoHideDuration={6000}
        onClose={() => setQuizError("")}
      >
        <Alert
          onClose={() => setQuizError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {quizError}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default ViewAndEditQuiz;
