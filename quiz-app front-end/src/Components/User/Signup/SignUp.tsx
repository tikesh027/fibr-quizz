import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import styles from "../Signup/SignUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Api/ApiConstant";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

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

type TSignUpPayload = {
  name: string;
  email: string;
  password: string;
};

const SignUp: React.FC = () => {
  const naviagate = useNavigate();
  const [age, setAge] = React.useState("");
  const [isSigningUp, setIsSigninUp] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [userName, setUsername] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [password, setPassword] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [email, setEmail] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [designation, setDesignation] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail({
      error: "",
      value: event.target.value,
      isValid: true,
    });
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
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
  const handleDesignation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesignation({
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
    if (password.value.length < 6) {
      setPassword({
        ...password,
        isValid: false,
        error: "Password is Less than 6 Character",
      });
      validForm = false;
    }
    if (userName.value === "") {
      setUsername({
        ...userName,
        isValid: false,
        error: "Please Fill your FULLNAME",
      });
      validForm = false;
    }
    // if (designation.value === "") {
    //   setDesignation({
    //     ...designation,
    //     isValid: false,
    //     error: "Please Fill your FULLNAME",
    //   });
    //   validForm = false;
    // }
    return validForm;
  };

  const resetError = () => {
    setSignUpError("");
  };

  const submitForm = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) return;
    const payload: TSignUpPayload = {
      email: email.value,
      password: password.value,
      name: userName.value,
    };
    setIsSigninUp(true);
    try {
      await axios.post(`${API_BASE_URL}/register`, payload);
      naviagate('/login');
    } catch (error: any) {
      setSignUpError(error?.response?.data?.msg);
    } finally {
      setIsSigninUp(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.formContainer}>
          <div className={styles.title}>QUIZZ</div>
          <div className={styles.inputCtr}>
            <TextField
              id="outlined-basic"
              label="Full name"
              variant="outlined"
              className={styles.textField}
              onChange={handleUsername}
              error={!userName.isValid}
              helperText={userName.error}
              value={userName.value}
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
            />
            <TextField
              id="outlined-basic"
              label="Password"
              variant="outlined"
              className={styles.textField}
              error={!password.isValid}
              helperText={password.error}
              onChange={handlePassword}
              value={password.value}
            />
            <div>
              {isSigningUp ? (
                <Button
                  disabled
                  variant="contained"
                  className={styles.loadingButton}
                >
                  <CircularProgress size={20} />
                  <span>Registering...</span>
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={styles.button}
                  onClick={submitForm}
                >
                  Register
                </Button>
              )}
            </div>
          </div>
          <div className={styles.loginLink}>
            Already have a account?&nbsp;
            <Link className={styles.link} to={"/login"}>
              LogIn
            </Link>
          </div>
        </div>
      </div>
      <Snackbar
        open={Boolean(signUpError)}
        autoHideDuration={6000}
        onClose={resetError}
      >
        <Alert onClose={resetError} severity="error" sx={{ width: "100%" }}>
          {signUpError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignUp;
