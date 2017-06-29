import { createStore } from 'redux'
import {SET_FORM_DATA, SET_OPTIONS, SET_UID, SET_USER} from "./components/utilities/actions"
import cookie from 'react-cookie';
import { combineReducers } from 'redux'
import pluginReducers from "../plugins/reducers";
const defaultAppState = {
    allForms : {},
    options: {},
    uid : cookie.load("uid"),
    plugins : pluginReducers({}, {})
};

function appReducer(state = defaultAppState , action) {
    //change the store state based on action.type
    switch(action.type){
        //todo: change this to be a "combined reducer" - will require modifying a lot of jsx components to pull differnt
        case "PLUGIN_ACTION" :
            return {
                ...state,
                plugins : pluginReducers(state.plugins, action)
            }
        case SET_OPTIONS :
            return Object.assign({}, state, {
                options: action.options
            });
        case SET_UID :
            return Object.assign({}, state, {
                uid : action.uid
            });
        case SET_USER :
            return {
                ...state,
                user : action.user
            };
        case SET_FORM_DATA:
            let newFormData = action.formData;
            if(typeof newFormData === "function"){
                newFormData = newFormData(state.allForms[action.name]);
            }
            return {
                ...state,
                allForms : {
                    ...state.allForms,
                    [action.name] : newFormData
                }
            };
        default:
            return state;
    }
}

let store = createStore(appReducer);

store.subscribe(()=>{
    console.log("store changed", store.getState());
});

export { store };