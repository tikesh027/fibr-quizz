import { cloneDeep } from 'lodash';
import { USER_ACTION_TYPE } from './UserActionTypes'; 
import { TACTION } from '../ActionType';

const initalState = {
    data: null,
    isLoading: true,
    error: null
}

function signUpUser(state = initalState, action:TACTION){
    const cloneState = cloneDeep(state);

    switch(action.type){
        case USER_ACTION_TYPE.SIGN_UP_START: {
            cloneState.isLoading = true;
            cloneState.error = null;
            return cloneState;
        }
        case USER_ACTION_TYPE.SIGN_UP_SUCCESS: {
            const {data} = action.payload;
            cloneState.isLoading = false;
            cloneState.error = null;
            cloneState.data = data;
            return cloneState;
        }
        case USER_ACTION_TYPE.SIGN_UP_FAILED: {
            const {error} = action.payload;
            cloneState.isLoading = false;
            cloneState.error = error;
            return cloneState;
        }
        default: {
            return state;
        }
    }
};

export default signUpUser;
