import React from 'react'
import PropTypes from 'prop-types'

const Tickets = props => {

    let total = 0

    return (
        <div className='ticket__tickets'>
            <h2>Tickets</h2>
            <ul>
            { props.tickets.map((ticket, index) => {
                const price = ticket[1] === 0 ? 6 : ticket[1] === 1 ? 4 : 3
                total = total + price
                return (
                    <li key={ticket[0]}>
                        <p>{index + 1}. Seat {ticket[0]} - {ticket[1] === 0 ? 'Standard' :
                        ticket[1] === 1 ? 'Kids/Seniors' : 
                        'Membership'}</p>
                        <p>{price}£</p>
                    </li>
                )
            }) }
        </ul>
        <p className='ticket__total'>Total: {total}£</p>
        </div>
    )
}

Tickets.propTypes = {
    tickets: PropTypes.array.isRequired
}

export default Tickets
