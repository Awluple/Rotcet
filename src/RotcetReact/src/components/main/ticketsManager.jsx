import React, {useContext, useEffect, useState} from 'react'
import { Route, Switch } from "react-router-dom";
import {useParams, useHistory} from 'react-router-dom'
import axios from 'axios'

import { UserContext, MembershipContext } from 'utilities/contexts.js'

import Tickets from './tickets/tickets.jsx'
import OrderConfirmation from './orderConfirmation/orderConfirmation.jsx'

const TicketsManager = () => {
    // handles tickets booking process

    const userLoggedContext = useContext(UserContext)
    const userMembershipContext = useContext(MembershipContext)

    const [userLogged, setUserLogged] = useState(false)
    const [userMembership, setUserMembership] = useState({membership: false, type: 0})

    const [screening, setScreening] = useState(null)

    const params = useParams()
    const history = useHistory()

    const checkUser = () => {
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
            setUserMembership(userMembershipContext)
        }
    }

    useEffect(() => {
        checkUser()
    }, [])

    useEffect(() => {
        if(userLogged){
            axios.get(`/api/screenings/${params.screeningId}`).then(res => {
                setScreening(res.data)
            }).catch(err => {
                console.error(err)
                if(err.response.status == 404){
                    history.push('/errors/404')
                }
            })
        }
    }, [userLogged])

    return (
        <div>
            <Switch>
                <Route path='/tickets/:screeningId/details' render={() => <OrderConfirmation screening={screening} />} />
                <Route exact path='/tickets/:screeningId' render={() => <Tickets screening={screening} membership={userMembership} />} />
            </Switch>
        </div>
    )
}

export default TicketsManager
