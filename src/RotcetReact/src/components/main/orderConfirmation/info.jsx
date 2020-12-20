import React from 'react'
import PropTypes from 'prop-types'

import {toCompactDate, toCompactHour} from '/utilities/tools/tools.js'

const Info = props => {

    const jsDate = new Date(props.screening.date)
    const date = toCompactDate(jsDate)
    const hour = toCompactHour(jsDate)

    return (
        <div>
            <h2>Movie</h2>
            <p>{props.screening.name}</p>
            <p>Time: {hour}</p>
            <p>Date: {date}</p>
        </div>
    )
}

Info.propTypes = {
    screening: PropTypes.object
}

export default Info
