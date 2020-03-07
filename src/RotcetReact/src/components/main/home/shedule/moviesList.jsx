import React from 'react'
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'

const MoviesList = props => {
    return (
        <div className='shedule__movies'>
            {props.movies === null && 
                <LoadingGif />
            }

            {props.movies && props.movies.length === 0 && 
                <h2 className='shedule__no_movies'>Sorry, there are no screenings for now</h2>
            }
            
            {props.movies && props.movies.length > 0 && 
                props.movies.map(movie => {
                    return (
                        <Movie key={movie.id} movie={movie} />
                    )
                })
            }
        </div>
    )
}

MoviesList.propTypes = {
    movies: PropTypes.array
}

export default MoviesList
