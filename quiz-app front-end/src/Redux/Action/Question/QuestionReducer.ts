import { cloneDeep } from 'lodash';
import { QUESTION_ACTION_TYPE } from './QuestionActionType'; 
import { TACTION } from '../ActionType';

export type TQuestion = {
    _id: string;
    createdAt: string;
    question: string;
    options: {
        text: string;
        isCorrect: boolean;
        _id: string;
    }[]
};

type TQuestionState = {
    data: TQuestion[],
    isLoading: boolean;
    error: string | null;
};

const initialState: TQuestionState = {
    data: [],
    isLoading: true,
    error: null
}

function CreateQuestion(state = initialState, action:TACTION){
    const cloneState = cloneDeep(state);

    switch(action.type){
        case QUESTION_ACTION_TYPE.FETCH_QUESTION_LIST: {
            cloneState.isLoading = true;
            cloneState.error = null;
            return cloneState;
        }
        case QUESTION_ACTION_TYPE.FETCH_QUESTION_LIST_SUCCESS: {
            const {data} = action.payload;
            cloneState.isLoading = false;
            cloneState.error = null;
            cloneState.data = data;
            return cloneState;
        }
        case QUESTION_ACTION_TYPE.FETCH_QUESTION_LIST_FAILED: {
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

export default CreateQuestion;
