import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import rootReducer from '../Reducer/MainReducer';

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

export type TStore = ReturnType<typeof store.getState>;

console.log(store.getState());
store.subscribe(()=> console.log(store.getState()));

export default store;