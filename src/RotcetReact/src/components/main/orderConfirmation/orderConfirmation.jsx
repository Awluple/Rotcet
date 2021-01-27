import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import axios from 'axios'

import { useLocation, useParams, useHistory, Link } from 'react-router-dom'

import LoadingGif from 'media/gifs/loading.jsx'

import Tickets from './tickets.jsx'
import Info from './info.jsx'
import UserDetails from './userDetails.jsx'

const OrderConfirmation = props => {

    const [tickets, setTickets] = useState([])

    const [error, setError] = useState(false)

    const [waitingForResponce, setWaitingForResponce] = useState(false)

    const location = useLocation()
    const params = useParams()
    const history = useHistory()

    const errors = {
        'details': 'An error accured during your details validation, please try again'
    }

    useEffect(() => {
        // parse tickets from url
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
    

    const simulatePayment = () => {
        // fake payment process, opens paypal window and redirects to the accepted page
        setTickets([])
        window.open('https://www.sandbox.paypal.com/checkoutnow', 'payment', "height=600,width=600")
        setTimeout(() => {
            history.push('/tickets/accepted')
        }, 1500);
    }

    const proceed = () => {
        if (props.blockPost) {
            return
        }

        const seats = tickets.map(ticket => {
            return ticket[0]
        })
        const types = tickets.map(ticket => {
            return ticket[1]
        })

        setWaitingForResponce(true)
        axios.post('/api/tickets-multiple-creation', {
            screening: params.screeningId,
            seats: seats.join(),
            types: types.join(),
            details: props.userDetails
        }).then(res => {
            if(res.status === 201) {
                simulatePayment()
            }
        }).catch(error => {
            console.error(error)
            if(error.response.status === 400){
                props.reloadData(props.membership.membership, props.membership.defaultType)
            } else {
                history.push(`/errors/${error.response.status}`)
            }
            switch(error.response.data.code) {
                case 1: // problem with ticket type
                    history.push(`/tickets/${params.screeningId}/?error=type`)
                break;
                case 2: // seat occupied
                    history.push(`/tickets/${params.screeningId}/?error=occupied&occupied=${error.response.data.seats.join()}`)
                break;
                case 3: //seat out of range
                    history.push(`/tickets/${params.screeningId}/?error=seat`)
                break;
                case 4: // problem with address
                    setError('details')
                    window.scrollTo(0,0)
                break;
                default:
                    history.push('/errors/400')
                break;
              }
              setWaitingForResponce(false)
        })
    }

    if(waitingForResponce) {
        return (
            <div className='ticket'>
            <h1 className='ticket__header'>Summary</h1>
            <LoadingGif />
        </div>
        )
    }

    return (
        <div className='ticket'>
            <h1 className='ticket__header'>Summary</h1>
            {error ? <p className='tickets__error'>{errors[error]}</p> : ''}
            <div className='ticket__info'>
                {props.screening !== null && <Info screening={props.screening} />}
                <Tickets tickets={tickets} />
            </div>
            <UserDetails updateDetails={props.updateDetails} userDetails={props.userDetails} />
            <h3>Is that correct?</h3>
            <div className='ticket__options'>
                <Link className='ticket__back' to={`/tickets/${params.screeningId}`}>No, back</Link>
                <button className={props.blockPost ? 'ticket__disabled' : 'ticket__continue'}
                onClick={proceed}>Yes, proceed to payment</button>
            </div>
        </div>
    )
}

OrderConfirmation.propTypes = {
    screening: PropTypes.object,
    membership: PropTypes.object.isRequired,
    reloadData: PropTypes.func.isRequired,
    userDetails: PropTypes.object.isRequired,
    updateDetails: PropTypes.func.isRequired,
    blockPost: PropTypes.bool.isRequired
}

export default OrderConfirmation
