import React, {useEffect} from 'react'
import { Route, Routes, useLocation, Outlet } from "react-router-dom";

import Home from './home/home.jsx'
import Calendar from './calendar/calendar.jsx'
import Movie from './movie/movie.jsx'
import Account from './account/account.jsx'
import News from './news/news.jsx'
import FullArticle from './news/fullArticle/fullArticle.jsx'

import TicketsManager from './ticketsManager.jsx'
import Accepted from './orderConfirmation/accepted.jsx';

const Main = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0,0)
    }, [pathname])

    return (
        <div className='main'>
            <Routes>
                <Route path='/movie/:name-:id/*' element={<Movie />} />
                <Route path='/tickets/accepted' element={<Accepted />} />
                <Route path='/tickets/:screeningId/*' element={<TicketsManager />} />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/account/*' element={<Account />} />
                <Route exact path='/news' element={<News />} />
                <Route path='/news/:articleId' element={<FullArticle />} />
                <Route path='/' element={<Home />} />
                {/* <Route >
                    <h1>No mach</h1>
                </Route> */}
            </Routes>
        </div>
    )
}

export default Main
