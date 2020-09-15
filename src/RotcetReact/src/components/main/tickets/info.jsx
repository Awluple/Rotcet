import React from 'react'
import PropTypes from 'prop-types'

import {toCompactDate, toCompactHour} from '/utilities/tools/tools.js'

const Info = props => {

    const jsDate = new Date(props.date)
    const date = toCompactDate(jsDate)
    const hour = toCompactHour(jsDate)

    return (
        <div className='tickets__info'>
            <h1>{props.name}</h1>
            <p>{hour}</p>
            <p>{date}</p>
        </div>
    )
}

Info.propTypes = {
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

export default Info
