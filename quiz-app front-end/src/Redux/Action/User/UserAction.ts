import axios from "axios";
import { USER_ACTION_TYPE } from "./UserActionTypes";
import { API_BASE_URL } from "../../../Api/ApiConstant";
import { TACTION } from "../ActionType";
import { TLoginData } from "./LogInUserReducer";
import { setAuthToken } from "../../../Utils/cookieHelper";

type TLoginPayload = {
  email: string;
  password: string;
};

function loginStart(): TACTION {
  return {
    type: USER_ACTION_TYPE.LOGIN_START,
  };
}

function loginSuccess(data: TLoginData): TACTION {
  return {
    type: USER_ACTION_TYPE.LOGIN_SUCCESS,
    payload: {
      data,
    },
  };
}

function loginFailed(error: string): TACTION {
  console.log('=========> here 2', error);
  return {
    type: USER_ACTION_TYPE.LOGIN_FAILED,
    payload: {
      error,
    },
  };
}

export function login(payload: TLoginPayload) {
  return (
    async (dispatch: any) => {
    dispatch(loginStart());
    try {
      const response: any = await axios.post(`${API_BASE_URL}/login`, payload);
      const data = response.data;
      console.log('=========> here', data);
      setAuthToken(data.access_token);
      dispatch(loginSuccess(data));
    } catch (error: any) {
      console.log('=========> here', error?.response);
      const errorMessage = error?.response?.data?.msg;
      dispatch(loginFailed(errorMessage));
    }
  }
  )
}
