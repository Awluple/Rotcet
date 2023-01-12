import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {toCompactDate, toCompactHour, convertDateToUTC} from 'utilities/tools/tools.js'

const TicketsList = props => {

    const { tickets, screenings } = props

    return (
        <div className='user_tickets'>
            <div className='side_navigation shadow-tiny'>
                <Link to='/account'>My account</Link><Link to='#'>/Tickets</Link>
            </div>
            <h1>My tickets</h1>
            <ul>
                {screenings.map(screening => {

                    let screeningDate = new Date(tickets[screening.id][0].screening_details.date)
                    screeningDate = convertDateToUTC(screeningDate)
                    const date = toCompactDate(screeningDate)
                    const hour = toCompactHour(screeningDate)
                    return (
                        <li key={screening.id}>
                            <Link to={`/account/tickets/${screening.id}`}>
                            <div className='user_tickets__ticket_details'>
                                <p>{hour}</p>
                                <p>{date}</p>
                            </div>
                            <p className={'user_tickets__ticket_screening_name'
                            + (screening.outdated ? ' user_tickets__ticket_screening_name--outdated' : '')}
                            >{tickets[screening.id][0].screening_details.name}</p>
                            <p className={'user_tickets__ticket_amount' + (screening.outdated ? ' user_tickets__ticket_amount--outdated' : '')}>
                            x{tickets[screening.id].length}</p>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

TicketsList.propTypes = {
    tickets: PropTypes.object.isRequired,
    screenings: PropTypes.array.isRequired
}

export default TicketsList
