import React, {useState, useEffect} from 'react'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'
import {addZeroForBelowTen} from 'utilities/tools/tools.js'

import Dates from './dates.jsx'
import Screenings from './screenings.jsx'

const Calendar = () => {

    const [screenings, setScreenings] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)


    const makeRequest = (date) => {
        return axios.get('/api/screenings', {
            params: {
                fields: 'id,name,show_id,show_type,image,date',
                date: date,
                ordering: 'date'
            }
        }).then(
            res => { return res.data.results }
        )
    }

    const getScreenings = (year, month, day) => {
        document.title = `Schedule for ${day}.${month}.${year}`
        setSelectedDate(`${day}.${month}.${year}`)
        setScreenings(null) // show loading gif
        makeRequest(`${year}-${month}-${day}`).then(data => {
            setScreenings(data)
        })
    }
    useEffect(() => {
        const date = new Date()
        const year = date.getUTCFullYear()
        const month = addZeroForBelowTen(date.getUTCMonth() + 1)
        const day = addZeroForBelowTen(date.getUTCDate())
        document.title = `Schedule for ${day}.${month}.${year}`
        getScreenings(year, month, day)

        return () => {
            document.title = 'Rotcet Cinema'
        }
    }, [])

    return (
        <div className='calendar'>
            <h1 className='main_section_header'>Select date</h1>
            <Dates selectedDate={selectedDate} getScreenings={getScreenings} />
            <h2>Schedule for {selectedDate}</h2>
            {screenings && screenings.length !== 0 ?
                <Screenings screenings={screenings} />
                : screenings === null ?
                <LoadingGif />
                :
                <h3 className='no_screenings'>There are no scheduled shows on the selected day</h3>
            }
        </div>
    )
}

export default Calendar
