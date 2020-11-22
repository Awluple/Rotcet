import React from 'react'
import PropTypes from 'prop-types'

const TicketsType = props => {
    return (
        <div className='tickets__type'>
            <h2>2. Choose type of tickets</h2>
        </div>
    )
}

TicketsType.propTypes = {
    seats: PropTypes.func,
}

export default TicketsType
