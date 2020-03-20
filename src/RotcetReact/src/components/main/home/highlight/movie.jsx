import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

const Movie = props => {
    console.log(props.index)
    return (
        <div className={'highlight_movie' + ((props.index === 1) ? ' highlight_movie--left' : '')}>
            <div className='movie__graphic'>
                {props.movie.main_trailer ? 
                    <iframe src={props.movie.main_trailer} frameBorder="0"></iframe>
                :
                    <img src={props.movie.thumbnail} alt="movie main image"/>
                }
            </div>
            <div className='movie__description'>
                <div className='movie__info'>
                    <h3>{props.movie.name}</h3>
                    <p>{props.movie.short_description}</p>
                </div>
                <Link to='' >Tickets</Link>
            </div>
        </div>
    )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default Movie
