import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Switch, Route} from 'react-router-dom'

import {checkIfOutdated} from '/utilities/screenings/scripts.js'

import LoadingGif from 'media/gifs/loading.jsx'

import TicketDetails from './ticketDetails.jsx'
import TicketsList from './ticketsList.jsx'

const Tickets = () => {
    const [tickets, setTickets] = useState(null)
    const [screenings, setScreenings] = useState([])

    useEffect(() => {
        axios.get('/api/tickets')
        .then((res) => {
            sortTickets(res.data)
        }).catch(error => {
            console.error(error)
        })
    }, [])

    const sortTickets = (userTickets) => {
        // goes through tickets and sort them by screening
        let sortedTickets = {}
        let screeningsWithTickets = [] // list with sortedTickets keys

        userTickets.map(ticket => {
            const date = new Date(ticket.screening_details.date.slice(0, -1))
            if (ticket.screening in sortedTickets) {
                // add to existing sortedTickets key
                sortedTickets[ticket.screening].push(ticket)
            } else {
                // create new key in sortedTickets
                screeningsWithTickets.push({id: ticket.screening, outdated: checkIfOutdated(date)})
                sortedTickets[ticket.screening] = [ticket]
            }
        })
        setTickets(sortedTickets)
        setScreenings(screeningsWithTickets)
    }

    
    return (
        <div className='account__tickets'>
            {tickets !== null ? 
                <Switch>
                <Route exact path='/account/tickets' render={() => <TicketsList tickets={tickets} screenings={screenings} />} />
                <Route exact path='/account/tickets/:screeningID' render={() => <TicketDetails tickets={tickets} screenings={screenings} />} />
                </Switch>
            :
                <LoadingGif />
            }
        </div>
    )
}

export default Tickets
