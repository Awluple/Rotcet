import React from 'react'
import PropTypes from 'prop-types'

import {addZeroForBelowTen} from 'utilities/tools/tools.js'

const Dates = props => {
    let max_date = new Date();
    max_date.setDate(max_date.getDate() + 14); 
    let dates = [];
    for (let day = new Date(); day <= max_date; day.setDate(day.getDate() + 1)) {
        dates.push(new Date(day));
    }
    return (
        <div className='calendar__dates'>
            <h1>Select day</h1>
            <ul>
                {dates.map(date => {
                    const year = date.getUTCFullYear()
                    const month = addZeroForBelowTen(date.getUTCMonth() + 1)
                    const day = date.getUTCDate()
                    return <li key={date.getUTCDate()} onClick={() => {props.getScreenings(year, month, day)}}>{`${day}.${month}.${year}`}</li>
                })}
            </ul>
        </div>
    )
}
Dates.propTypes = {
    getScreenings: PropTypes.func.isRequired
}

export default Dates
