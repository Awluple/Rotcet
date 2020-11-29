import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

import { UserContext, MembershipContext } from 'utilities/contexts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Header from './header.jsx'
import Seats from './seats.jsx'

import TicketsType from './ticketsType.jsx'

const Tickets = () => {
    const userLoggedContext = useContext(UserContext)

    const [userLogged, setUserLogged] = useState(false)
    const [userMembership, setUserMembership] = useState({membership: false, type: 0})

    const [screening, setScreening] = useState(null)
    const [chosenSeats, setChosenSeats] = useState([])

    const params = useParams()

    useEffect(() => {
        if(!userLoggedContext){
            // check if user is logged after redirection from login page
            // when userLoggedContext is false by default
            axios.get('/api/session').then(res => {
                if(res.data.logged){
                    setUserLogged(res.data.logged)
                    setUserMembership({
                        membership: res.data.membership,
                        type: res.data.membership_type
                    })
                } else {
                    window.location.href = `/login?next=/tickets/${params.screeningId}&login_required=true`
                }
            })
        } else {
            setUserLogged(true)
            setUserMembership(MembershipContext)
        }
    }, [])

    useEffect(() => {
        if(userLogged){
            axios.get(`/api/screenings/${params.screeningId}`).then(res => {
                setScreening(res.data)
            })
        }
    }, [userLogged])

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
            <TicketsType member={userMembership.membership} membershipType={userMembership.type} chosenSeats={chosenSeats} />
        </div>
    )
}

export default Tickets
