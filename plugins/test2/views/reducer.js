
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import React from 'react';
import TestPage from "./TestPage.jsx"
import TestPage2 from "./TestPage2.jsx"
import {Link} from 'react-router';


let defaultState = {
    navMenus : [(<li><Link to="/testpage3">Test Page3<span className="sr-only">(current)</span></Link></li>),(<li><Link to="/testpage4">Test Page4<span className="sr-only">(current)</span></Link></li>)
    ],
    routes : [(<Route name="TestPage3" path="testpage3" component={TestPage}/>),(<Route name="TestPage4" path="testpage4" component={TestPage2}/>)],
    options : {},


}

function appReducer(pluginState = defaultState , action) {
    //change the store state based on action.p_type
    switch(action.p_type){
        case "SET_TEST" :
            return Object.assign({}, pluginState, {
                test: action.test
            });
        default:
            return pluginState;
    }
}

export default appReducer;