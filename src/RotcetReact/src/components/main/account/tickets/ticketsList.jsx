import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {toCompactDate, toCompactHour, convertDateToUTC} from 'utilities/tools/tools.js'

const TicketsList = props => {

    const [tickets, setTickets] = useState({})
    const [screenings, setScreenings] = useState([])

    useEffect(() => {
        // goes through tickets and sort them by screening
        let sortedTickets = {}
        let screeningsWithTickets = [] // list with sortedTickets keys
        props.tickets.map(ticket => {
            if (ticket.screening in sortedTickets) {
                // add to existing sortedTickets key
                sortedTickets[ticket.screening].push(ticket)
            } else {
                // create new key in sortedTickets
                screeningsWithTickets.push(ticket.screening)
                sortedTickets[ticket.screening] = [ticket]
            }
        })
        setTickets(sortedTickets)
        setScreenings(screeningsWithTickets)
    }, [])

    return (
        <div className='user_tickets'>
            <h1>My tickets</h1>
            <ul>
                {screenings.map(screening => {
                    let screeningDate = new Date(tickets[screening][0].screening_details.date)
                    screeningDate = convertDateToUTC(screeningDate)
                    const date = toCompactDate(screeningDate)
                    const hour = toCompactHour(screeningDate)
                    return (
                        <li key={screening}>
                            <Link to={`/account/tickets/${screening}`}>
                            <div className='user_tickets__ticket_details'>
                                <p>{hour}</p>
                                <p>{date}</p>
                            </div>
                            <p className='user_tickets__ticket_screening_name'>{tickets[screening][0].screening_details.name}</p>
                            <p className='user_tickets__ticket_amount'>x{tickets[screening].length}</p>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

TicketsList.propTypes = {
    tickets: PropTypes.array.isRequired
}

export default TicketsList
