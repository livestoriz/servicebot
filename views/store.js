import { createStore, applyMiddleware } from 'redux'
import {SET_FORM_DATA, SET_OPTIONS, SET_UID, SET_USER, SET_NOTIFICATIONS, SET_NOTIFICATION, ADD_NOTIFICATION, INITIALIZE, initializeState} from "./components/utilities/actions"
import cookie from 'react-cookie';
import thunk from "redux-thunk";
import {isAuthorized} from "./components/utilities/authorizer.jsx";
import Fetcher from "./components/utilities/fetcher.jsx";
import { combineReducers } from 'redux'
import pluginReducers from "../plugins/reducers";



const defaultAppState = {
    allForms : {},
    options: {},
    uid : cookie.load("uid"),
    plugins : pluginReducers({}, {}),
    notifications: [],
    system_notifications: []]


};

function appReducer(state = defaultAppState , action) {
    //change the store state based on action.type
    //todo: make notifications cleaner
    switch(action.type){
        //todo: change this to be a "combined reducer" - will require modifying a lot of jsx components to pull differnt
        case "PLUGIN_ACTION" :
            return {
                ...state,
                plugins : pluginReducers(state.plugins, action)
            }
        case INITIALIZE :
            console.log("INIT", state);
            return action.initialState
        case ADD_NOTIFICATION :
            let location = "notifications"
            if(action.isSystem){
                location = "system_notifications"
            }
            return {
                ...state,
                [location] : [...state[location], action.notification]
            }
        case SET_NOTIFICATIONS :
            let setLocation = "notifications"
            if(action.isSystem){
                setLocation = "system_notifications"
            }
            return {
                ...state,
                [setLocation] : action.notifications
            }
        case SET_NOTIFICATION :
            let setLocation = "notifications"
            if(action.isSystem){
                setLocation = "system_notifications"
            }
            let modifiedArray = state[setLocation].map(notification => {
                if(notification.id == action.notification.id){
                    return action.notification
                }else{
                    return notification;
                }
            });
            return {
                ...state,
                [setLocation] : modifiedArray
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

let store = createStore(appReducer, applyMiddleware(thunk) );

store.subscribe(()=>{
    console.log("store changed", store.getState());
});


let initializedState = async function(dispatch){
    let initialState = {
        allForms : {},
        options: {},
        notifications: [],
        system_notifications: [],
        uid : cookie.load("uid")
    };
    initialState.options = await Fetcher("/api/v1/system-options/public");
    try {
        if (cookie.load("uid")) { // if user is logged in
            initialState.user = (await Fetcher("/api/v1/users/own"))[0];
            initialState.notifications = await Fetcher("/api/v1/notifications/own");
            if(isAuthorized({permissions: "put_email_templates_id"})){
                initialState.system_notifications = await Fetcher("/api/v1/notifications/system");
            }
        }
    }
    catch(err){
        initialState.options.backgroundColor = "#000000";
    }
    return dispatch(initializeState(initialState));
};



export { store, initializedState };