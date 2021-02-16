import React, {useEffect} from 'react'
import { Route, Switch, useLocation } from "react-router-dom";

import Home from './home/home.jsx'
import Calendar from './calendar/calendar.jsx'
import Movie from './movie/movie.jsx'
import Account from './account/account.jsx'

import TicketsManager from './ticketsManager.jsx'
import Accepted from './orderConfirmation/accepted.jsx';

const Main = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0,0)
    }, [pathname])

    return (
        <div className='main'>
            <Switch>
                <Route path='/movie/:name-:id' component={Movie} />
                <Route path='/tickets/accepted' component={Accepted} />
                <Route path='/tickets/:screeningId' component={TicketsManager} />
                <Route path='/calendar' component={Calendar} />
                <Route path='/account' component={Account} />
                <Route exact path='/' component={Home} />
                <Route >
                    <h1>No mach</h1>
                </Route>
            </Switch>
        </div>
    )
}

export default Main
