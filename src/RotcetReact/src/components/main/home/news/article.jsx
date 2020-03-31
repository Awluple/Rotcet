import React from 'react'
import PropTypes from 'prop-types'

const Article = props => {
    return (
        <div className='news__article'>
            <div className='article--image'>
                <img src={props.article.image} alt='Article image' />
            </div>
            <div className='article--content'>
                <h4>{props.article.title}</h4>
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
