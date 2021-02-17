import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

const Article = props => {
    const smallDevice = useScreenWidth(600)

    return (
        <li className='news__article'>
            { !smallDevice &&
                <div className='article__image'>
                    { props.article.thumbnail ?
                        <img src={props.article.thumbnail} alt="article image"/>
                        : <img src='/static/images/logo.png' alt="article image"/>
                    }
                </div>
            }
            <div className='article__content'>
                <Link to='/'><h4>{props.article.title}</h4></Link>
                { smallDevice &&
                    <div className='article__image'>
                        { props.article.thumbnail ?
                            <img src={props.article.thumbnail} alt="article image"/>
                            : <img src='/static/images/logo.png' alt="article image"/>
                        }
                    </div>
                }
                <h6>{props.article.day_posted}</h6>
                <p>{props.article.short_description}</p>
            </div>
        </li>
    )
}

Article.propTypes = {
    article: PropTypes.object.isRequired
}

export default Article