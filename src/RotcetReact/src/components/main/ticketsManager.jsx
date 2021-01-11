import React, {useContext, useEffect, useState} from 'react'
import { Route, Switch } from "react-router-dom";
import {useParams, useHistory} from 'react-router-dom'
import axios from 'axios'

import { UserContext, MembershipContext } from 'utilities/contexts.js'
import {convertDateToUTC} from 'utilities/tools/tools.js'

import Tickets from './tickets/tickets.jsx'
import OrderConfirmation from './orderConfirmation/orderConfirmation.jsx'

const TicketsManager = () => {
    // handles tickets booking process

    const userLoggedContext = useContext(UserContext)
    const userMembershipContext = useContext(MembershipContext)

    const [userLogged, setUserLogged] = useState(false)
    const [userMembership, setUserMembership] = useState({membership: false, type: 0, defaultType: 0})

    const [screening, setScreening] = useState(null)

    const params = useParams()
    const history = useHistory()

    const getScreening = (membership_active, defaultType) => {
        axios.get(`/api/screenings/${params.screeningId}`).then(res => {
            let now = new Date()
            now = convertDateToUTC(now)
            now.setMinutes(now.getMinutes() + 30)
            const screeningDate = new Date(res.data.date.replace('Z', ''))
            if (screeningDate < now){
                history.push('/errors/outdated')
            } else {
                setScreening(res.data)
                setUserMembership({
                    membership: membership_active,
                    type: res.data.member_tickets_left,
                    defaultType: defaultType
                })
            }
        }).catch(err => {
            console.error(err)
            if(err.response.status == 404){
                history.push('/errors/404')
            }
        })
    }

    const getUser = () => {
        if(!userLoggedContext){
            // check if user is logged after redirection from login page
            // when userLoggedContext is false by default
            axios.get('/api/session').then(res => {
                if(res.data.logged){
                    setUserLogged(res.data.logged)
                    getScreening(res.data.membership, res.data.membership_type)
                } else {
                    window.location.href = `/login?next=/tickets/${params.screeningId}&login_required=true`
                }
            })
        } else {
            setUserLogged(true)
            getScreening(userMembershipContext.membership, userMembershipContext.type)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div>
            <Switch>
                <Route path='/tickets/:screeningId/order' render={() => <OrderConfirmation screening={screening} membership={userMembership} reloadData={getScreening} />} />
                <Route exact path='/tickets/:screeningId' render={() => <Tickets reloadData={getScreening} screening={screening} membership={userMembership} />} />
            </Switch>
        </div>
    )
}

export default TicketsManager
