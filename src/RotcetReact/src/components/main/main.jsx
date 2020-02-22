import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './home/home.jsx'

const Main = () => {
    return (
        <Router>
        <div className='main'>
            <Route exact path="/">
                <Home />
            </Route>          
        </div>
        </Router>
    )
}

export default Main
