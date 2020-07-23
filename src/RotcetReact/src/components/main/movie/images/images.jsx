import React from 'react'
import PropTypes from 'prop-types'

const Images = props => {
    return (
        <div className='movie__images'>
            <ul>
            {props.images.map(image => {
                return <li key={image.id}><img src={image.thumbnail} alt="image"/></li>
            })}
            </ul>
        </div>
    )
}

Images.propTypes = {
    images: PropTypes.array.isRequired
}

export default Images
