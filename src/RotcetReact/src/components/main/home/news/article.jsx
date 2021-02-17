import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

const Article = props => {
    const smallDevice = useScreenWidth(600)
    return (
        <div className='news__article'>
            { !smallDevice &&
                <div className='article__image'>
                    <Link to={`/news/${props.article.id}`}><img src={props.article.thumbnail ? props.article.thumbnail : '/static/images/logo.png' } alt='Article image' /></Link>
                </div>
            }
            <div className='article__content'>
                <Link to={`/news/${props.article.id}`}><h4>{props.article.title}</h4></Link>
                { smallDevice &&
                    <div className='article__image'>
                        <Link to={`/news/${props.article.id}`}><img src={props.article.thumbnail ? props.article.thumbnail : '/static/images/logo.png' } alt='Article image' /></Link>
                    </div>
                }
                <h6>{props.article.day_posted}</h6>
                <p>{props.article.short_description}</p>
            </div>
        </div>
    )
}

Article.propTypes = {
    article: PropTypes.object.isRequired
}

export default Article
