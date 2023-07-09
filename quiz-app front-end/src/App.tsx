import React, { useEffect } from "react";
import styles from "../src/App.module.css";
import SignUp from "./Components/User/Signup/SignUp";
import LogIn from "./Components/User/Login/LogIn";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { matchPath } from "react-router";
import HomePage from "./Components/HomePage/HomePage";
import MyQuiz from "./Components/MyQuiz/MyQuiz";
import DashBoard from "./Components/Dashboard/DashBoard";
import Profile from "./Components/Profile/Profile";
import QuizQuestion from "./Components/HomePage/QuizQuestion/QuizQuestion";
import QuestionStructure from "./Components/HomePage/QuestionStructure/QuestionStructure";
import Navbar from "./Components/Navigation-Bar/Navbar";
import Box from "@mui/material/Box";
import QuestionBank from "./Components/QuestionBank/QuestionBank";
import { getAuthToken } from "./Utils/cookieHelper";
import AttemptQuizLandingPage from "./Components/AttemptQuiz/AttemptQuizLandingPage";
import Quiz from "./Components/AttemptQuiz/Component/Quiz";
import { Toolbar, Typography } from "@mui/material";

const UN_GUARD_ROUTS = ["/login", "/signup"];

function App() {
  const authToken = getAuthToken();
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch("/attempt-quiz/:quiz_id");
  useEffect(() => {
    if (!authToken && location.pathname !== "/signup" && !match) {
      navigate("/login");
    }
  }, []);
  if (location.pathname === "/login" || location.pathname === "/signup" || match) {
    return (
      <>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route
            path="/attempt-quiz/:quiz_id"
            element={<AttemptQuizLandingPage />}
          />
        </Routes>
      </>
    );
  }
  return (
    <>
      {!authToken ? null : (
        <>
          <Box sx={{ display: "flex" }}>
            <Box
              component="nav"
              sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              <Navbar />
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${240}px)` } }}
              className={styles.main}
            >
              <Routes>
                <Route path="/" element={<MyQuiz />} />
                {/* <Route path="/dashboard" element={<DashBoard />} /> */}
                {/* <Route path="/profile" element={<Profile />} /> */}
                <Route path="/questions" element={<QuestionBank />} />
                {/* <Route
                path="/questionstructure"
                element={<QuestionStructure />}
              /> */}
              </Routes>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default App;
