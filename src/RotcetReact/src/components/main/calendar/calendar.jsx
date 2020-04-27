import React from 'react'
import axios from 'axios'

import Dates from './dates.jsx'

const Calendar = () => {
    const getScreenings = () => {
        return axios.get('/api/screenings', {
            params: {
            }
        }).then(
            res => { return res.data.results }
        )
    }
    return (
        <div className='calendar'>
            <Dates />
        </div>
    )
}

export default Calendar
