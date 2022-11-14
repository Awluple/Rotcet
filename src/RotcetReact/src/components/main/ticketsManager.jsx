import React, {useContext, useEffect, useState} from 'react'
import { Route, Routes } from "react-router-dom";
import {useParams, useNavigate } from 'react-router-dom'
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

    const [userLogged, setUserLogged] = useState('awaitingResponse')
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
    const navigate = useNavigate ()

    const getScreening = (membership_active, defaultType) => {
        axios.get(`/api/screenings/${params.screeningId}`).then(res => {
            let now = new Date()
            now = convertDateToUTC(now)
            now.setMinutes(now.getMinutes() + 30)
            const screeningDate = new Date(res.data.date.replace('Z', ''))
            if (screeningDate < now){
                navigate('/errors/outdated')
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
                navigate('/errors/404')
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

    useEffect(() => {

        if(userLoggedContext === true) {  
            setUserLogged(userLoggedContext)
            setUserDetails(userDetailsContext)
            getScreening(userMembershipContext.membership, userMembershipContext.type)

            const details = Object.values(userDetailsContext).map(value => {return value.trim()}) // check for strings with only whitespaces
            if(details.includes('')) {
                setBlockPost(true)
            }

        } else if (userLoggedContext === false) {
            window.location.href = `/login?next=/tickets/${params.screeningId}&login_required=true`
        }

    }, [userLoggedContext])

    return (
        <div>
            <Routes>
                <Route path='/tickets/:screeningId/order' element={<OrderConfirmation screening={screening} userDetails={userDetails}
                updateDetails={updateDetails} membership={userMembership} reloadData={getScreening} blockPost={blockPost} />} />
                <Route path='/tickets/:screeningId' element={<Tickets reloadData={getScreening} screening={screening} membership={userMembership} />} />
            </Routes>
        </div>
    )
}

export default TicketsManager
