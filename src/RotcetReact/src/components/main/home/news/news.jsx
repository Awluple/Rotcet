import React, {useEffect, useState} from 'react'
import axios from 'axios'

const News = () => {

    const [news, setNews] = useState(null)

    const getNews = () => {
        return axios.get('/api/news', {
            params: {
                
            }
        }).then(
            res => { return res.data.results }
        )
    }


    useEffect(() => {
        
    }, [])

    return (
        <div className='home__news'>
            
        </div>
    )
}

export default News
