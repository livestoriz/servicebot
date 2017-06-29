import { combineReducers } from 'redux'
// import appReducer from "./test/views/reducer.js"

let reducers = {}

// let arr = ["./test/views/reducer.js"];
require("servicebot_plugins").forEach(function(plugin){
    reducers[plugin] = require(`./${plugin}/views/reducer.js`).default;

})
// reducers["test"] = appReducer
console.log(reducers);

export default combineReducers(reducers);

