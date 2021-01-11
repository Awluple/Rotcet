import React, {useEffect, useState} from 'react';
import './scss/App.scss';

import {BrowserRouter} from 'react-router-dom'
import YoutubeApi from 'utilities/youtube/youtube_api.js'
import { UserContext, MembershipContext } from 'utilities/contexts.js'
import axios from 'axios'

import Top from './components/top/top.jsx'
import Main from './components/main/main.jsx'
import Footer from './components/footer/footer.jsx'

function App() {
    window.YoutubeApi = new YoutubeApi()

    const [userLogged, setUserLogged] = useState(false)
    const [userMembership, setUserMembership] = useState({membership: false, type: 0})

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFToken";
        axios.get('/api/session').then(res => {
            setUserLogged(res.data.logged)
            if(res.data.logged) {
                setUserMembership({
                    membership: res.data.membership,
                    type: res.data.membership_type
                })
            }
        })
    }, [])

    return (
        <BrowserRouter>
        <div className="App">
            <UserContext.Provider value={userLogged}>
            <MembershipContext.Provider value={userMembership}>
                <Top />
                <Main />
                <Footer />
            </MembershipContext.Provider>
            </UserContext.Provider>
        </div>
        </BrowserRouter>
    );
}

export default App;
