import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Movie = props => {
    return (
        <div className='upcoming__movie'>
            <Link to={`/movie/${props.movie.name}-MV-${props.movie.id}`}>
                <img src={props.movie.thumbnail} alt="movie image"/>
                <p>{props.movie.name}</p>
            </Link>
        </div>
    )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired
}

export default Movie
