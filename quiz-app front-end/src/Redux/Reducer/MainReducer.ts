import { combineReducers } from "redux";
// import signUpUser from "../Action/User/SignUpUserReducer";
import CreateQuiz from "../Action/Quiz/QuizReducer";
import CreateQuestion from "../Action/Question/QuestionReducer";
import loginReducer from "../Action/User/LogInUserReducer";

const rootReducer = combineReducers({
//   signUp: signUpUser,
  login: loginReducer,
  quiz: CreateQuiz,
  question: CreateQuestion,
});

export default rootReducer;
