import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "../Signup/SignUp.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../Redux/Action/User/UserAction";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { TStore } from "../../../Redux/Store/Store";
import { useNavigate } from "react-router-dom";

type formInput = {
  value: string;
  error: string;
  isValid: boolean;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const loginData = useSelector((state: TStore) => state.login);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [email, setEmail] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });
  const [password, setPassword] = useState<formInput>({
    value: "",
    error: "",
    isValid: true,
  });

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

  useEffect(() => {
    if (loginData.error) {
      setShowErrorPopup(true);
    }
    if (loginData.data) {
      navigate("/");
    }
  }, [loginData]);

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
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
    return validForm;
  };

  const submitForm = () => {
    const isFormValid = validateForm();
    if (!isFormValid) return;
    const payload = {
      email: email.value,
      password: password.value,
    };
    dispatch(login(payload));
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.formContainer}>
          <div className={styles.title}>QUIZZ</div>
          <div className={styles.inputCtr}>
            <TextField
              id="outlined-basic"
              label="Email"
              value={email.value}
              variant="outlined"
              className={styles.textField}
              onChange={handleEmail}
            />
            <TextField
              id="outlined-basic"
              label="Password"
              value={password.value}
              variant="outlined"
              className={styles.textField}
              onChange={handlePassword}
            />
            <div>
              <Button
                variant="contained"
                className={styles.button}
                onClick={submitForm}
              >
                LogIn
              </Button>
            </div>
          </div>
          <div className={styles.loginLink}>
            Don't have a account?&nbsp;
            <Link className={styles.link} to={"/signup"}>
              Register
            </Link>
          </div>
        </div>
      </div>
      <Snackbar
        open={showErrorPopup}
        autoHideDuration={6000}
        onClose={closeErrorPopup}
      >
        <Alert
          onClose={closeErrorPopup}
          severity="error"
          sx={{ width: "100%" }}
        >
          {loginData.error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LogIn;
