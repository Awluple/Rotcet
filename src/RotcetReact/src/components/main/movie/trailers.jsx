import React from 'react'
import PropTypes from 'prop-types'

const Trailers = props => {
    return (
        <div className='movie__trailers'>
            <h2>Watch trailers</h2>
            <div className='movie__primary_trailer'>
                <img src={props.trailerThumbnail ? props.trailerThumbnail : props.trailers[0].trailer_thumbnail} alt="primary trailer"/>
            </div>
            <ul>
                {props.trailers.slice(1).map(trailer => {
                    return <li><img src={trailer.trailer_thumbnail} alt="trailer"/></li>
                })}
            </ul>
        </div>
    )
}

Trailers.propTypes = {
    mainTrailer: PropTypes.string,
    trailerThumbnail: PropTypes.string,
    trailers: PropTypes.array
}

export default Trailers
