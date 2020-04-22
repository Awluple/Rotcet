import React from 'react'

import Schedule from './schedule/schedule.jsx'
import Highlight from './highlight/highlight.jsx'
import News from './news/news.jsx';
import Informations from './info/informations.jsx'
import Upcoming from './upcoming/upcoming.jsx'

const Home = () => {
    return (
        <React.Fragment>
            <Schedule />
            <Highlight />
            { /*
            <div className='news_and_info'>
                <News />
                <Informations />
            </div>
            <Upcoming /> */}
        </React.Fragment>
    )
}

export default Home
