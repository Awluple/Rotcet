import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import queryString from 'query-string'

const Schedule = () => {
    const [movies, setMovies] = useState(null);
    useEffect(() => {
        let time = new Date()
        time.setTime(time.getTime() + time.getTimezoneOffset()*60*1000)
        const query = {
            'fields': 'id,name,has_3D,screenings,main_image'
        }
        axios.get()
    },[])
    return (
        <div className='shedule'>
            <h2>SHEDULE</h2>
            
            <Link to='/calendar'>CALENDAR</Link>
        </div>
    )
}

export default Schedule