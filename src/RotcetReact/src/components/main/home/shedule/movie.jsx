import React from 'react'
import PropTypes from 'prop-types'

const Movie = props => {
    return (
        <div className='movies__movie'>
            <h3>{props.movie.name}</h3>
            <div className='movie__details'>
                <div className='movie__image'>
                    <img src={props.movie.thumbnail} alt="movie image"/>
                </div>
                <div className='movie__screenings'>
                    <p>{props.movie.has_3D ? '2D/3D' : '2D'}</p>
                </div>
            </div>
        </div>
        )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired
}

export default Movie
