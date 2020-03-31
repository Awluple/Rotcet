import React, {useEffect, useState} from 'react'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'

import Article from './article.jsx'


const News = () => {

    const [news, setNews] = useState(null)

    const getNews = () => {
        return axios.get('/api/news', {
            params: {
                'page_size': 3,
                'fields': 'id,title,image,day_posted,short_description'
            }
        }).then(
            res => { return res.data.results }
        )
    }


    useEffect(() => {
        getNews().then(data => {
            setNews(data)
        })
    }, [])

    return (
        <div className='home__news'>
            <h3 className='header header--medium'>News</h3>
            {news !== null ?
                news.map(article => {
                    return <Article article={article} key={article.id} />
                })
                :
                <LoadingGif />
            }
            
        </div>
    )
}

export default News
