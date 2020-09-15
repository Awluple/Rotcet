import React, {useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

import { UserContext } from 'utilities/contexts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Info from './info.jsx'
import Canvas from './canvas.jsx'

const Tickets = () => {
    const userLoggedContext = useContext(UserContext)
    const [userLogged, setUserLogged] = useState(false)
    const [screening, setScreening] = useState(null)
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

    useEffect(() => {
        if(userLogged){
            axios.get(`/api/screenings/${params.screeningId}`).then(res => {
                setScreening(res.data)
            })
        }
    }, [userLogged])
    console.log(screening)

    if(screening === null){
        return (
            <div>
                <LoadingGif />
            </div>
        )
    }

    return (
        <div className='tickets'>
            <Info name={screening.name} date={screening.date} />
            <Canvas occupied={screening} />
        </div>
    )
}

export default Tickets
