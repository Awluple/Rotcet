import React from 'react'
import PropTypes from 'prop-types'

const Dates = props => {
    let max_date = new Date();
    max_date.setDate(max_date.getDate() + 14); 
    let dates = [];
    for (let day = new Date(); day <= max_date; day.setDate(day.getDate() + 1)) {
        dates.push(new Date(day));
    }
    return (
        <div className='calendar__dates'>
            <ul>
                {dates.map(date => {
                    const year = date.getUTCFullYear()
                    const month = date.getUTCMonth() + 1
                    const day = date.getUTCDate()
                    return <li onClick={() => {props.getScreenings(`${year}-${month}-${day}`)}}>{`${day}.${month}.${year}`}</li>
                })}
            </ul>
        </div>
    )
}
Dates.propTypes = {
    getScreenings: PropTypes.func.isRequired
}

export default Dates
