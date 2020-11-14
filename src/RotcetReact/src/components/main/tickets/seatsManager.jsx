import React from 'react'
import PropTypes from 'prop-types'

const SeatsManager = props => {
    return (
        <ul>
        { props.seats.map(seat => {
            return (
                <li key={seat}>{seat}</li>
            )
        })}
        <li>+</li>
        </ul>
    )
}

SeatsManager.propTypes = {
    seats: PropTypes.array.isRequired,
    occupied: PropTypes.array.isRequired,
    addSeat: PropTypes.func.isRequired,
    deleteSeat: PropTypes.func.isRequired
}

export default SeatsManager
