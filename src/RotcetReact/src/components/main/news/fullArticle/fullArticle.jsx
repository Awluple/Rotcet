import React, {useEffect, useState} from 'react'
import {useParams, useHistory, Link} from 'react-router-dom'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'

const FullArticle = () => {

    const [article, setArticle] = useState(null)

    const params = useParams()
    const history = useHistory()


    useEffect(() => {
        axios.get(`/api/news/${params.articleId}`)
        .then(res => {
            setArticle(res.data)
        }).catch(error => {
            console.error(error)
            switch (error.response.status) {
                case 404:
                    history.push('/errors/404')
                    break;
                case 500:
                    history.push('/errors/500')
                    break;
            }
        })
    }, [])

    if(article === null) {
        return (
            <div className='full_article'>
                <div className='full_article__side_navigation shadow-tiny'>
                    <Link className='ig' to='/news'>All articles</Link>
                </div>
                <LoadingGif />
            </div>
        )
    }

    return (
        <div className='full_article'>
            <h1 className='simple_header'>News</h1>
            <div className='full_article__side_navigation shadow-tiny'>
                <Link className='ig' to='/news'>All articles</Link>
            </div>
            <h2>{article.title}</h2>
            <div className={'full_article__image' + (article.image === null ? ' full_article__image--logo' : '')}>
                <img src={article.image !== null ? article.image : '/static/images/logo.png'} alt="Article image"/>
                <h6>{article.day_posted}</h6>
            </div>
            <p>{article.full_description !== null && article.full_description !== '' ?
            article.full_description : article.short_description}</p>
        </div>
    )
}

export default FullArticle
