import React, {useState, useEffect} from 'react'
import axios from 'axios'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

import Article from './article.jsx'

const News = () => {

    const [news, setNews] = useState([])
    const [nextPage, setNextPage] = useState(1)

    const getNews = () => {
        if(nextPage === null) {
            return
        }
        setNextPage(nextPage + 1)
        axios.get(`/api/news/?page_size=10&page=${nextPage}&fields=id,day_posted,thumbnail,short_description,title`)
        .then(res => {
            setNews(news.concat(res.data.results))
            if(res.data.next === null) {
                setNextPage(null)
            }
        })
    }

    useEffect(() => {
        document.title = `News`
        getNews()
    }, [])

    return (
        <div className='news'>
            <h1 className='simple_header'>News</h1>
            <ul>
                {news.map(article => {
                    return (
                        <Article article={article} key={article.id} />
                    )
                })}
            </ul>
            {nextPage !== null &&
                <button className='button' onClick={getNews}>Load more</button>
            }
        </div>
    )
}

export default News
