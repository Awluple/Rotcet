import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

const Article = props => {
    return (
        <div className='news__article'>
            <div className='article--image'>
                <Link to='/'><img src={props.article.image ? props.article.image : props.article.thumbnail } alt='Article image' /></Link>
            </div>
            <div className='article--content'>
                <Link to='/'><h4>{props.article.title}</h4></Link>
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
