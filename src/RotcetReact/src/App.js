import React, {useEffect, useState} from 'react';
import './scss/App.scss';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
import YoutubeApi from 'utilities/youtube/youtube_api.js'
import { UserContext, MembershipContext, DetailsContext } from 'utilities/contexts.js'
import axios from 'axios'

import Top from './components/top/top.jsx'
import Main from './components/main/main.jsx'
import Footer from './components/footer/footer.jsx'

function App() {
    window.YoutubeApi = new YoutubeApi()

    const [userLogged, setUserLogged] = useState('awaitingResponse')
    const [userMembership, setUserMembership] = useState({membership: false, type: 0})
    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        address: '',
        postcode: ''
    })

    useEffect(() => {
        axios.defaults.xsrfHeaderName = "X-CSRFToken";
        axios.get('/api/session').then(res => {
            if(res.data.logged) {
                setUserMembership({
                    membership: res.data.membership,
                    type: res.data.membership_type
                })
                if (res.data.user_details !== null) {
                    setUserDetails(res.data.user_details)
                }
            }
            setUserLogged(res.data.logged)
        })
    }, [])

    return (
        <BrowserRouter>
        <div className="App">
            <UserContext.Provider value={userLogged}>
            <DetailsContext.Provider value={userDetails}>
            <MembershipContext.Provider value={userMembership}>
                <Top />
                <Main />
                <Footer />
            </MembershipContext.Provider>
            </DetailsContext.Provider>
            </UserContext.Provider>
        </div>
        </BrowserRouter>
    );
}

export default App;
