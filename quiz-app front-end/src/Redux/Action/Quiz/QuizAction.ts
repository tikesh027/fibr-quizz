import axios from "axios";
import { API_BASE_URL } from "../../../Api/ApiConstant";
import { TACTION } from "../ActionType";
import { QUIZ_ACTION_TYPE } from "./QuizActionType";
import { TQuizList } from "./QuizReducer";
import { getAuthToken } from "../../../Utils/cookieHelper";

function fetchQuizList(): TACTION {
  return {
    type: QUIZ_ACTION_TYPE.FETCH_QUIZ_LIST,
  };
}

function fetchQuizListSuccess(data: TQuizList): TACTION {
  console.log("==========> successs");
  return {
    type: QUIZ_ACTION_TYPE.FETCH_QUIZ_LIST_SUCCESS,
    payload: {
      data
    },
  };
}

function fetchQuizListFailed(error: string): TACTION {
  return {
    type: QUIZ_ACTION_TYPE.FETCH_QUIZ_LIST_FAILED,
    payload: error,
  };
}

export function requestQuizList() {
  return async (dispatch: any) => {
    try {
      dispatch(fetchQuizList());
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      const response = await axios.get(`${API_BASE_URL}/quiz/all`,{ headers });
      const data = response.data?.data?.quizzes;
      dispatch(fetchQuizListSuccess(data));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg;
      dispatch(fetchQuizListFailed(errorMessage));
    }
  };
}
