import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Home from './home/reducer';
import * as Ifr from './ifr/reducer';
import * as AppRegister from './AppRegister/reducer';
import * as AppRegister1 from './AppRegister1/reducer';
import * as AppStore from './appStore/reducer';
import * as TemplateDragStore from './test/reducer';
import * as ZoneRegister from './Zone/reducer';
import * as zoneSettingData from './ZoneSetting/reducer';
import * as MenuRegister from './MenuRegister/reducer';
import thunk from 'redux-thunk';

let store = createStore(
	combineReducers({ ...Home, ...Ifr, ...AppStore, ...AppRegister,...AppRegister1, ...TemplateDragStore, ...ZoneRegister, ...zoneSettingData, ...MenuRegister }),
	{},
	composeWithDevTools(applyMiddleware(thunk))
);
export default store;
