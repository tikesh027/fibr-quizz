import { cloneDeep } from "lodash";
import { USER_ACTION_TYPE } from "./UserActionTypes";
import { TACTION } from "../ActionType";

export type TLoginData = {
  msg: string;
  access_token: string;
  user: {
      name: string;
      email: string;
  }
};

type TLoginState = {
    data: TLoginData| null,
    isLoading: boolean;
    error: string | null;
};

const initialState: TLoginState = {
    data: null,
    isLoading: false,
    error: null,
};


function loginReducer(state = initialState, action: TACTION) {
  const cloneState = cloneDeep(state);
  switch (action.type) {
    case USER_ACTION_TYPE.LOGIN_START: {
      cloneState.isLoading = true;
      cloneState.error = null;
      return cloneState;
    }
    case USER_ACTION_TYPE.LOGIN_SUCCESS: {
      const { data } = action.payload;
      cloneState.isLoading = false;
      cloneState.error = null;
      cloneState.data = data;
      return cloneState;
    }
    case USER_ACTION_TYPE.LOGIN_FAILED: {
      const { error } = action.payload;
      console.log('=========> here 3', error);
      cloneState.isLoading = false;
      cloneState.error = error;
      return cloneState;
    }
    default: {
      return state;
    }
  }
}

export default loginReducer;
