import React from 'react'

import Schedule from './shedule/shedule.jsx'
import Highlight from './highlight/highlight.jsx'
import News from './news/news.jsx';

const Home = () => {
    return (
        <React.Fragment>
            <Schedule />
            <Highlight />
            <News />
        </React.Fragment>
    )
}

export default Home
