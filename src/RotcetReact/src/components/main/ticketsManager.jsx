import React, {useContext, useEffect, useState} from 'react'
import { Route, Switch } from "react-router-dom";
import {useParams, useHistory} from 'react-router-dom'
import axios from 'axios'

import { UserContext, MembershipContext, DetailsContext } from 'utilities/contexts.js'
import {convertDateToUTC} from 'utilities/tools/tools.js'

import Tickets from './tickets/tickets.jsx'
import OrderConfirmation from './orderConfirmation/orderConfirmation.jsx'

const TicketsManager = () => {
    // handles tickets booking process

    const userLoggedContext = useContext(UserContext)
    const userMembershipContext = useContext(MembershipContext)
    const userDetailsContext = useContext(DetailsContext)

    const [userLogged, setUserLogged] = useState(false)
    const [userMembership, setUserMembership] = useState({membership: false, type: 0, defaultType: 0})
    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        address: '',
        postcode: ''
    })

    const [blockPost, setBlockPost] = useState(false)

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
                document.title = `${res.data.name} - Booking`
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

    const updateDetails = (detail, value) => {
        let new_values = {...userDetails,
            [detail]: value
        }
        setUserDetails(new_values)
        new_values = Object.values(new_values).map(value => {return value.trim()}) // check for strings with only whitespaces
        if(new_values.includes('')) {
            setBlockPost(true)
        } else {
            setBlockPost(false)
        }
    }

    const getUser = () => {
        if(!userLoggedContext){
            // check if user is logged after redirection from login page
            // when userLoggedContext is false by default
            axios.get('/api/session').then(res => {
                if(res.data.logged){
                    setUserLogged(res.data.logged)
                    if (res.data.user_details !== null) {
                        setUserDetails(res.data.user_details)
                    } else {
                        setBlockPost(true)
                    }
                    getScreening(res.data.membership, res.data.membership_type)
                } else {
                    window.location.href = `/login?next=/tickets/${params.screeningId}&login_required=true`
                }
            })
        } else {
            setUserLogged(true)
            setUserDetails(userDetailsContext)
            getScreening(userMembershipContext.membership, userMembershipContext.type)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div>
            <Switch>
                <Route path='/tickets/:screeningId/order' render={() => <OrderConfirmation screening={screening} userDetails={userDetails}
                updateDetails={updateDetails} membership={userMembership} reloadData={getScreening} blockPost={blockPost} />} />
                <Route exact path='/tickets/:screeningId' render={() => <Tickets reloadData={getScreening} screening={screening} membership={userMembership} />} />
            </Switch>
        </div>
    )
}

export default TicketsManager
