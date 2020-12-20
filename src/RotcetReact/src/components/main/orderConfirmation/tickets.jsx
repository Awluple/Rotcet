import React from 'react'
import PropTypes from 'prop-types'

const Tickets = props => {

    let total = 0

    return (
        <div>
            <h2>Tickets</h2>
            <ol>
            { props.tickets.map((ticket) => {
                const price = ticket[1] === 0 ? 6 : ticket[1] === 1 ? 4 : 3
                total = total + price
                return (
                    <li key={ticket[0]}>
                        <p>Seat {ticket[0]} - {ticket[1] === 0 ? 'Starnard' :
                        ticket[1] === 1 ? 'Kids/Seniors' : 
                        'Membership'}</p>
                        <p>{price}£</p>
                    </li>
                )
            }) }
        </ol>
        <p>Total {total}£</p>
        </div>
    )
}

Tickets.propTypes = {
    tickets: PropTypes.array.isRequired
}

export default Tickets
