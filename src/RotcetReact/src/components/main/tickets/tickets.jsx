import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useParams, useLocation, Link} from 'react-router-dom'
import qs from 'qs'

import LoadingGif from 'media/gifs/loading.jsx'

import Header from './header.jsx'
import Seats from './seats.jsx'

import TicketsType from './ticketsType.jsx'

const Tickets = (props) => {

    const [chosenSeats, setChosenSeats] = useState([])
    const [tickets, setTickets] = useState([])
    const [memberTicketsChosen, setMemberTicketsChosen] = useState(0)
    const [error, setError] = useState(null)

    const [link, setLink] = useState('/')

    const params = useParams()
    const location = useLocation()

    const { screening } = props

    useEffect(() => {
        if (chosenSeats.length !== tickets.length) {
            const updated = tickets.filter(ticket => {
                return chosenSeats.includes(ticket.seat)
            })
            setTickets(updated)
        }
    }, [chosenSeats.length])

    useEffect(() => {
        if(location.search !== '') {
            const search = qs.parse(location.search.substring(1))

            if (search.error !== undefined) {
                if(search.error === 'occupied') {
                    setError({
                        name: search.error,
                        occupied: search.occupied
                    })
                } else {
                    setError({name: search.error})
                }
            }
        }
    }, [])

    const setTicketsAndUpdateLink = (newTickets) => {
        let memberTickets = 0
        let newLink = newTickets.map(ticket => {
            if(ticket.type === 3) {
                memberTickets = memberTickets + 1
            }
            return `&ticket=${ticket.seat},${ticket.type - 1}`
        })
        newLink = `/tickets/${params.screeningId}/order?` + newLink

        if(memberTickets > props.membership.type || (props.membership.membership === false && memberTickets !== 0)) {
            // if bug with too many memberTickets have occurred, reset everything
            setLink('/')
            setTickets([])
            setMemberTicketsChosen(0)
            setChosenSeats([])
            return
        }

        setLink(newLink)
        setTickets(newTickets)
        setMemberTicketsChosen(memberTickets)
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
            <Header name={screening.name} date={screening.date} in3D={screening.in_3D} />

            <Seats occupied={screening.occupied_seats} chosenSeats={chosenSeats}
            setChosenSeats={setChosenSeats} error={error} />

            <TicketsType member={props.membership.membership} membershipType={props.membership.type} membershipDefault={props.membership.defaultType}
            chosenSeats={chosenSeats} setTickets={setTicketsAndUpdateLink} tickets={tickets}
            memberTicketsChosen={memberTicketsChosen}
            />
            { chosenSeats.length > 0 && 
                <Link to={link} className='tickets__continue button shadow-tiny'>Continue</Link>
            }
        </div>
    )
}


Tickets.propTypes = {
    screening: PropTypes.object,
    membership: PropTypes.object.isRequired,
}

export default Tickets
