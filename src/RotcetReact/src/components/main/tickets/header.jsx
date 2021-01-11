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
            { props.in3D ? <h4>3D</h4> : ''}
            <p>{date}</p>
            <p>{hour}</p>
        </div>
    )
}

Header.propTypes = {
    date: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    in3D: PropTypes.bool.isRequired,
}

export default Header
