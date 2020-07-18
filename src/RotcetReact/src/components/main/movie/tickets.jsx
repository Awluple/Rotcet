import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

const Tickets = props => {
    return (
        <div className='movie__tickets'>
            <h2>Shedule and tickets</h2>
            <Link>Pricing</Link>
        </div>
    )
}

Tickets.propTypes = {
    screenings: PropTypes.array.isRequired
}

export default Tickets
