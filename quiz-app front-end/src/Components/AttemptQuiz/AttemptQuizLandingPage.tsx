import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./AttemptQuizLandingPage.module.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../Api/ApiConstant";
import Quiz from "./Component/Quiz";

const cookies = new Cookies();

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type formInput = {
  value: string;
  error: string;
  isValid: boolean;
};

const AttemptQuizLandingPage = () => {
  const [email, setEmail] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [userName, setUsername] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };

  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };

  const validateForm = () => {
    let validForm = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setEmail({
        ...email,
        isValid: false,
        error: "Please Fill a Valid Email Address",
      });
      validForm = false;
    }
    if (userName.value === "") {
      setUsername({
        ...userName,
        isValid: false,
        error: "Please Fill your Full name",
      });
      validForm = false;
    }
    return validForm;
  };

  const registerUser = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) return;
    try {
      setIsLoading(true);
      const payload = {
        name: userName.value,
        email: email.value,
      };
      await axios.post(`${API_BASE_URL}/participant/register`, payload);
      cookies.set("participantEmail", email.value);
      setIsRegistered(true);
    } catch (error: any) {
      setSignUpError(error?.response?.data?.msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setSignUpError("");
  };
  if (!isRegistered) {
    return (
      <Grid
        container
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={styles.main}
      >
        {isLoading ? (
          <Modal open={isLoading}>
            <CircularProgress
              className={styles.spinner}
              sx={{ color: "#28fffb" }}
            />
          </Modal>
        ) : null}
        <Box
          display="flex"
          gap="25px"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          className={styles.contentBox}
        >
          <Typography variant="h5" textAlign="center">
            Register
          </Typography>
          <TextField
            id="outlined-basic"
            label="Full name"
            variant="outlined"
            className={styles.textField}
            onChange={handleUsername}
            error={!userName.isValid}
            helperText={userName.error}
            value={userName.value}
            fullWidth
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            className={styles.textField}
            error={!email.isValid}
            helperText={email.error}
            onChange={handleEmail}
            value={email.value}
            fullWidth
          />
          <Button variant="contained" onClick={registerUser}>
            Register
          </Button>
        </Box>
        <Snackbar
          open={Boolean(signUpError)}
          autoHideDuration={6000}
          onClose={resetError}
        >
          <Alert onClose={resetError} severity="error" sx={{ width: "100%" }}>
            {signUpError}
          </Alert>
        </Snackbar>
      </Grid>
    );
  }
  return <Quiz setIsRegistered={setIsRegistered} />;
};

export default AttemptQuizLandingPage;
