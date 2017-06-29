
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import React from 'react';
import TestPage from "./TestPage.jsx"
import TestPage2 from "./TestPage2.jsx"
import {Link} from 'react-router';


let defaultState = {
    navMenus : [(<li><Link to="/testpage">Test Page<span className="sr-only">(current)</span></Link></li>),(<li><Link to="/testpage2">Test Page2<span className="sr-only">(current)</span></Link></li>)
    ],
    routes : [(<Route name="TestPage" path="testpage" component={TestPage}/>),(<Route name="TestPage2" path="testpage2" component={TestPage2}/>)],
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