import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as Main from './main/reducer';
import * as Ifr from './ifr/reducer';
import thunk from 'redux-thunk';

let store = createStore(
	combineReducers({ ...Main, ...Ifr }),
	applyMiddleware(thunk),
	window.devToolsExtension ? window.devToolsExtension() : undefined
);

export default store;
