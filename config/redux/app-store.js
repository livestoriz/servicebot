import { createStore } from 'redux'

const defaultAppState = {
    systemOptions: {},
};

function appReducer(state = defaultAppState , action) {
    //change the store state based on action.type
    switch(action.type){
        case: INITIALIZE_APP
        default:
            return state;
    }
}

let store = createStore(appReducer);

store.subscribe(()=>{
    console.log("store changed", store.getState());
});

export { store };