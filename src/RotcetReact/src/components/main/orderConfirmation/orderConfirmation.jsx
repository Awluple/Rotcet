import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { useLocation, useParams, useHistory, Link } from 'react-router-dom'

import Tickets from './tickets.jsx'
import Info from './info.jsx'


const OrderConfirmation = props => {

    const [tickets, setTickets] = useState([])

    const location = useLocation()
    const params = useParams()
    const history = useHistory()

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
    
    const proceed = () => {
        window.open('https://www.sandbox.paypal.com/checkoutnow', 'payment', "height=600,width=600")
        setTimeout(() => {
            history.push('/accepted')
        }, 1500);
    }

    return (
        <div>
            {props.screening !== null && <Info screening={props.screening} />}
            <Tickets tickets={tickets} />

            <h1>Is that corrent?</h1>
            <Link to={`/tickets/${params.screeningId}`}>No, back</Link>
            <button onClick={proceed}>Yes, proceed to payment</button>
        </div>
    )
}

OrderConfirmation.propTypes = {
    screening: PropTypes.object
}

export default OrderConfirmation
