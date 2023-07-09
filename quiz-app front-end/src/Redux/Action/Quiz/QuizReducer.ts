import { cloneDeep } from 'lodash';
import { QUIZ_ACTION_TYPE } from '../Quiz/QuizActionType'; 
import { TACTION } from '../ActionType';
import { TQuestion } from '../Question/QuestionReducer';

export type TQuizList = {
    _id: string;
    title: string;
    questions: TQuestion[];
    createdAt: string;
}[];

type TQuizState = {
    data: TQuizList;
    isLoading: boolean;
    error: string | null
};

const initialState: TQuizState = {
    data: [],
    isLoading: false,
    error: null,
}

function CreateQuiz(state = initialState, action:TACTION){
    const cloneState = cloneDeep(state);

    switch(action.type){
        case QUIZ_ACTION_TYPE.FETCH_QUIZ_LIST: {
            cloneState.isLoading = true;
            cloneState.error = null;
            return cloneState;
        }
        case QUIZ_ACTION_TYPE.FETCH_QUIZ_LIST_SUCCESS: {
            console.log("==========> here");
            const {data} = action.payload;
            cloneState.isLoading = false;
            cloneState.error = null;
            cloneState.data = data;
            return cloneState;
        }
        case QUIZ_ACTION_TYPE.FETCH_QUIZ_LIST_FAILED: {
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

export default CreateQuiz;
