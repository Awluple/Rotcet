import React from 'react'
import PropTypes from 'prop-types'

const Screenings = props => {
    return (
        <div className="screenings__day">
            <h4>{props.day.date}</h4>
            <ul>
                {props.day.screenings.map((screening, index) => {
                    return <li key={index}>{screening}</li>
                })}
            </ul>
        </div>
    )
}

Screenings.propTypes = {
    day: PropTypes.object.isRequired
}

export default Screenings
