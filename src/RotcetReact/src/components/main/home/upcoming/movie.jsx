import React from 'react'
import PropTypes from 'prop-types'

const Movie = props => {
    return (
        <div className='upcoming__movie'>
            <img src={props.movie.thumbnail} alt="movie image"/>
            <p>{props.movie.name}</p>
        </div>
    )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired
}

export default Movie
