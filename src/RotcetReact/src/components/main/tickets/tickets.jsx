import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

import { UserContext } from 'utilities/contexts.js'

const Tickets = () => {
    const userLoggedContext = useContext(UserContext)
    const [userLogged, setUserLogged] = useState(false)
    const params = useParams()

    useEffect(() => {
        if(!userLoggedContext){
            // check if user is logged after redirection from login page
            // when userLoggedContext is false by default
            axios.get('/api/session').then(res => {
                if(res.data.logged){
                    setUserLogged(res.data.logged)
                } else {
                    window.location.href = `/login?next=/tickets/${params.screeningId}&login_required=true`
                }
            })
        } else {
            setUserLogged(true)
        }
    }, [])

    return (
        <div>
            <h1>Tickets</h1>
            <h2>{params.screeningId}</h2>
        </div>
    )
}

export default Tickets
