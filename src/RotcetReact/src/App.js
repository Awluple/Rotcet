import React, {useEffect, useState} from 'react';
import './scss/App.scss';

import {BrowserRouter} from 'react-router-dom'
import YoutubeApi from 'utilities/youtube/youtube_api.js'
import { UserContext } from 'utilities/contexts.js'
import axios from 'axios'

import Top from './components/top/top.jsx'
import Main from './components/main/main.jsx'
import Footer from './components/footer/footer.jsx'

function App() {
    window.YoutubeApi = new YoutubeApi()

    const [userLogged, setUserLogged] = useState(false)

    useEffect(() => {
        axios.get('/api/session').then(res => {
            setUserLogged(res.data.logged)
        })
    }, [])

    return (
        <BrowserRouter>
        <div className="App">
            <UserContext.Provider value={userLogged}>
                <Top />
                <Main />
                <Footer />
            </UserContext.Provider>
        </div>
        </BrowserRouter>
    );
}

export default App;
