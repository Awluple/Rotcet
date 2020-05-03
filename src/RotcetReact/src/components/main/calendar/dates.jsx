import React from 'react'
import PropTypes from 'prop-types'

import {addZeroForBelowTen} from 'utilities/tools/tools.js'

const Dates = props => {
    let max_date = new Date();
    max_date.setDate(max_date.getDate() + 13); 
    let dates = [];
    for (let day = new Date(); day <= max_date; day.setDate(day.getDate() + 1)) {
        dates.push(new Date(day));
    }
    return (
        <div className='calendar__dates'>
            <ul>
                {dates.map(date => {
                    const year = date.getUTCFullYear()
                    const month = addZeroForBelowTen(date.getUTCMonth() + 1)
                    const day = addZeroForBelowTen(date.getUTCDate())
                    return <li className={'shadow-small' + (props.selectedDate === `${day}.${month}.${year}` ? ' selected' : '')} key={date.getUTCDate()} 
                    onClick={() => {props.getScreenings(year, month, day)}}>{`${day}.${month}.${year}`}</li>
                })}
            </ul>
        </div>
    )
}
Dates.propTypes = {
    getScreenings: PropTypes.func.isRequired
}

export default Dates
