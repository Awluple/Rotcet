import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Switch, Route} from 'react-router-dom'

import LoadingGif from 'media/gifs/loading.jsx'

import TicketDetails from './ticketDetails.jsx'
import TicketsList from './ticketsList.jsx'

const Tickets = () => {
    const [tickets, setTickets] = useState(null)

    useEffect(() => {
        axios.get('/api/tickets')
        .then((res) => {
            setTickets(res.data)
        })
    }, [])
    
    return (
        <div className='account__tickets'>
            {tickets !== null ? 
                <Switch>
                <Route exact path='/account/tickets' render={() => <TicketsList tickets={tickets} />} />
                <Route exact path='/account/tickets/:screeningID' render={() => <TicketDetails tickets={tickets} />} />
                </Switch>
            :
                <LoadingGif />
            }
        </div>
    )
}

export default Tickets
