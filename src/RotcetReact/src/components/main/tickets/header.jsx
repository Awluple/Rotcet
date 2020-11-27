import React from 'react'
import PropTypes from 'prop-types'

import {toCompactDate, toCompactHour} from '/utilities/tools/tools.js'

const Header = props => {

    const jsDate = new Date(props.date)
    const date = toCompactDate(jsDate)
    const hour = toCompactHour(jsDate)

    return (
        <div className='tickets__header'>
            <h1>{props.name}</h1>
            <p>{hour}</p>
            <p>{date}</p>
        </div>
    )
}

Header.propTypes = {
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

export default Header
