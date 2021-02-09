import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Link, useParams, useHistory} from 'react-router-dom'

import {toCompactDate, toCompactHour, convertDateToUTC} from 'utilities/tools/tools.js'

const TicketDetails = props => {

    const params = useParams()
    const history = useHistory()


    const tickets = props.tickets[params.screeningID]


    if(tickets === undefined) {
        history.push('/errors/404')
        return null
    }

    let screeningDate = new Date(tickets[0].screening_details.date)
    screeningDate = convertDateToUTC(screeningDate)
    const hour = toCompactHour(screeningDate)
    const date = toCompactDate(screeningDate)
    

    return (
        <div className='ticket'>
            <div className='account__navigation shadow-tiny'>
                <Link to='/account'>My account</Link><Link to='/account/tickets'>/Tickets</Link>
                <Link to='#'>/{tickets[0].screening_details.name}</Link>
            </div>
            <div className='ticket__info'>
                <div className='ticket__show'>
                    <h2>Movie</h2>
                    <p>{tickets[0].screening_details.name}</p>
                    <p>Time: {hour}</p>
                    <p>Date: {date}</p>
                </div>
                <div className='ticket__tickets'>
                    <h2>Tickets</h2>
                    <ul>
                        {tickets.map((ticket, index) => {
                            return <li key={ticket.seat}>
                                <p>{index + 1}. Seat {ticket.seat} - {ticket.type === 0 ? 'Standard' :
                                ticket.type === 1 ? 'Kids/Seniors' : 
                                'Membership'}</p>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <div className='ticket__options'>
                    <Link to=''>Download</Link>
                    <Link to=''>Show online ticket</Link>
                </div>
        </div>
    )
}

TicketDetails.propTypes = {
    tickets: PropTypes.object.isRequired,
    screenings: PropTypes.array.isRequired
}

export default TicketDetails
