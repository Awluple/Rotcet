import React from 'react'
import PropTypes from 'prop-types'

const SliderInfo = props => {
    const position = props.position / 100
    return (
        <div className={'schedule_slider_info' + (position === props.movies - 1 ? ' schedule_slider_info--last' : '')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                { position === 0 || position === props.movies - 1 ?
                    <path d="M 11,6 H 7 l 5,-6 5,6 h -4 v 3 h -2 z m 8,5 H 5 v 2 h 14 z"/>
                    : <path d="M11 6h-4l5-6 5 6h-4v3h-2v-3zm2 9h-2v3h-4l5 6 5-6h-4v-3zm6-4h-14v2h14v-2z"/>
                }
            </svg>
        </div> 
    )
}

SliderInfo.propTypes = {
    position: PropTypes.number.isRequired,
    movies: PropTypes.number.isRequired
}

export default SliderInfo
