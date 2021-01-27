import React from 'react'
import PropTypes from 'prop-types'

import { Link } from "react-router-dom";

const Screenings = props => {
    return (
        <div className="screenings__day">
            <h4>{props.day.date}</h4>
            <ul>
                {props.day.screenings.map((screening, index) => {
                    return <li key={index}><Link to={`/tickets/${screening.id}`}>{screening.hour}</Link></li>
                })}
            </ul>
        </div>
    )
}

Screenings.propTypes = {
    day: PropTypes.object.isRequired
}

export default Screenings
