import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useParams, Link} from 'react-router-dom'

import LoadingGif from 'media/gifs/loading.jsx'

import Header from './header.jsx'
import Seats from './seats.jsx'

import TicketsType from './ticketsType.jsx'

const Tickets = (props) => {

    const [chosenSeats, setChosenSeats] = useState([])
    const [tickets, setTickets] = useState([])

    const [link, setLink] = useState('/')

    const params = useParams()

    const { screening } = props

    useEffect(() => {
        if (chosenSeats.length < tickets.length) {
            const updated = tickets.filter(ticket => {
                return chosenSeats.includes(ticket.seat)
            })
            setTickets(updated)
        }
    }, [chosenSeats.length])


    const setTicketsAndUpdateLink = (newTickets) => {
        let newLink = newTickets.map(ticket => {
            return `&ticket=${ticket.seat},${ticket.type - 1}`
        })
        newLink = `/tickets/${params.screeningId}/details?` + newLink
        setLink(newLink)
        setTickets(newTickets)
    }


    if(screening === null){
        return (
            <div className='tickets'>
                <LoadingGif />
            </div>
        )
    }

    return (
        <div className='tickets'>
            <Header name={screening.name} date={screening.date} />
            <Seats occupied={screening.occupied_seats} chosenSeats={chosenSeats} setChosenSeats={setChosenSeats} />
            <TicketsType member={props.membership.membership} membershipType={props.membership.type} chosenSeats={chosenSeats}
            setTickets={setTicketsAndUpdateLink} tickets={tickets}
            />
            { chosenSeats.length > 0 && 
                <Link to={link} className='tickets__continue button shadow-tiny'>Continue</Link>
            }
        </div>
    )
}


Tickets.propTypes = {
    screening: PropTypes.object,
    membership: PropTypes.object.isRequired
}

export default Tickets
