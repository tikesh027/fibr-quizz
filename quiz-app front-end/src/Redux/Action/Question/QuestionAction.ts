import axios from "axios";
import { TACTION } from "../ActionType";
import { QUESTION_ACTION_TYPE } from "./QuestionActionType";
import { TQuestion } from "./QuestionReducer";
import { API_BASE_URL } from "../../../Api/ApiConstant";
import { getAuthToken } from "../../../Utils/cookieHelper";

function fetchQuestionList(): TACTION {
  return {
    type: QUESTION_ACTION_TYPE.FETCH_QUESTION_LIST,
  };
}

function fetchQuestionListSuccess(data: TQuestion[]): TACTION {
  return {
    type: QUESTION_ACTION_TYPE.FETCH_QUESTION_LIST_SUCCESS,
    payload: {
      data,
    },
  };
}

function fetchQuestionListFailed(error: string): TACTION {
  return {
    type: QUESTION_ACTION_TYPE.FETCH_QUESTION_LIST_FAILED,
    payload: {
      error,
    },
  };
}

export function requestQuestionList() {
  return async (dispatch: any) => {
    try {
      dispatch(fetchQuestionList());
      const headers = {
        "X-Authorization": getAuthToken(),
      };
      const response = await axios.get(`${API_BASE_URL}/question/all`,{ headers });
      const data = response.data?.questions;
      dispatch(fetchQuestionListSuccess(data));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.msg;
      dispatch(fetchQuestionListFailed(errorMessage));
    }
  };
}
