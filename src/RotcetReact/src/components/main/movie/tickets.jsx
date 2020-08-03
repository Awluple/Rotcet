import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import LoadingGif from 'media/gifs/loading.jsx'

import {toCompactDate} from 'utilities/tools/tools.js'

import Screenings from './screenings.jsx'

const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
}

const Tickets = props => {

    const [dates, setDates] = useState(null)


    const loadDays = daysNumber => {
        let date = new Date()
        let maxDate = new Date()
        maxDate.setDate(maxDate.getDate() + daysNumber)

        let screenings = []

        for (let today = date.getTime(); maxDate > today; today = date.setDate(date.getDate() + 1)) {
            const day = new Date(today)
            const dayCompact = toCompactDate(day)
            const screening = {
                screenings: props.screenings[dayCompact] === undefined ? null : props.screenings[dayCompact],
                date: dayCompact,
                day: days[day.getDay()]
            }
            screenings.push(screening)
        }
        screenings[0].day = 'Today'
        screenings[1].day = 'Tomorow'
        return screenings
    }

    const loadMore = () => {
        setDates(loadDays(dates.length + 3))
    }


    useEffect(() => {
        setDates(loadDays(7))
    }, [])


    if (!dates){
        return <LoadingGif />
    }

    return (
        <div className='movie__tickets'>
            <h2 className='header header--medium shadow-small'>Shedule and tickets</h2>
            <Link className='button shadow-small' to='/pricing' target="_blank">Pricing</Link>
            <ul className='tickets__list'>
                {dates.map(date => {
                    return (
                        <li className='tickets__date' key={date.date}>
                            <div className='tickets__day-info'>
                                <h4>{date.day}</h4>
                                <p>{date.date}</p>
                            </div>
                            <Screenings screenings={date.screenings} />
                        </li>
                    )
                })}
            </ul>
            <button onClick={loadMore}>Load more</button>
        </div>
    )
}

Tickets.propTypes = {
    screenings: PropTypes.object.isRequired
}

export default Tickets
