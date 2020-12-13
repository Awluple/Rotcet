import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { useLocation, useParams } from 'react-router-dom'

const OrderConfirmation = () => {

    const [tickets, setTickets] = useState([])

    const location = useLocation()
    const params = useParams()

    useEffect(() => {
        let tickets = qs.parse(location.search.substring(1))

        tickets = tickets.ticket
        if (tickets === undefined) {
            window.location.href = `/tickets/${params.screeningId}`
            return
        }
        if(typeof(tickets) === 'string') {
            tickets = [tickets]
        }
        tickets = tickets.map(ticket => {return ticket.split(',').map(toInt => {return parseInt(toInt)})})
        setTickets(tickets)
    }, [])
    
    return (
        <div>
            <h1>Tickets</h1>
            { tickets.map((ticket, index) => {
                return (
                    <p key={ticket[0]}>{index + 1}. Seat {ticket[0]} - {ticket[1] === 0 ? 'Starnard' :
                    ticket[1] === 1 ? 'Kids/Seniors' : 
                    'Membership'}</p>
                )
            }) }
        </div>
    )
}

OrderConfirmation.propTypes = {
    screening: PropTypes.object
}

export default OrderConfirmation
