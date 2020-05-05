import React from 'react'
import { Route, Switch } from "react-router-dom";

import Home from './home/home.jsx'
import Calendar from './calendar/calendar.jsx'

const Main = () => {
    return (
        <div className='main'>
            <Switch>
                <Route path='/calendar' component={Calendar} />
                <Route exact path='/' component={Home} />
                <Route >
                    <h1>No mach</h1>
                </Route>
            </Switch>
        </div>
    )
}

export default Main
