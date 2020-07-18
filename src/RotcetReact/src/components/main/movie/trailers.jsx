import React from 'react'
import PropTypes from 'prop-types'

const Trailers = props => {
    return (
        <div className='movie__trailers'>
            <h2>Watch trailers</h2>
        </div>
    )
}

Trailers.propTypes = {
    mainTrailer: PropTypes.string,
    trailerThumbnail: PropTypes.string,
    trailers: PropTypes.array
}

export default Trailers
