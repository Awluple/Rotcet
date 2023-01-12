import React, {useEffect} from 'react'
import { Route, Routes, useLocation, Outlet } from "react-router-dom";

import Home from './home/home.jsx'
import Calendar from './calendar/calendar.jsx'
import Movie from './movie/movie.jsx'
import Account from './account/account.jsx'
import News from './news/news.jsx'
import FullArticle from './news/fullArticle/fullArticle.jsx'
import Membership from './membership/membership.jsx';
import About from './about/about.jsx';
import Faqs from './faqs/faqs.jsx';
import NotFound from './errors/NotFound.jsx';

import TicketsManager from './ticketsManager.jsx'
import Accepted from './orderConfirmation/accepted.jsx';

const Main = () => {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if(hash === '') {
            window.scrollTo(0,0)
        }     
    }, [pathname])

    return (
        <div className='main'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/movie/:name-:id/*' element={<Movie />} />
                <Route path='/tickets/accepted' element={<Accepted />} />
                <Route path='/tickets/:screeningId/*' element={<TicketsManager />} />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/account/*' element={<Account />} />
                <Route path='/news' >
                    <Route index element={<News />} />
                    <Route path=':articleId' element={<FullArticle />} />
                </Route>
                <Route path='/membership' element={<Membership />} />
                <Route path='/about' element={<About />} />
                <Route path='/faqs' element={<Faqs />} />
                <Route path="/errors/404" element={<NotFound />} />
            </Routes>
        </div>
    )
}

export default Main
