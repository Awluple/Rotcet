import React from 'react'
import PropTypes from 'prop-types'

import {Link} from 'react-router-dom'

const Screenings = props => {
    const fillScreenings = (screenings) => {
        // makes 6 spaces for hour of screenings. I should used table...
        screenings = (screenings === null || screenings === undefined) ? [] : screenings
        if(screenings.length >= 6){
            return screenings
        }
        const toFill = []
        for (let numberOfScreenings = screenings.length; numberOfScreenings < 6; numberOfScreenings++) {
            toFill.push('')
        }
        return screenings.concat(toFill)
    }

    const filledScreenings = fillScreenings(props.screenings)
    return (
        <ul className='tickets__hours'>
            {filledScreenings.map((screening, index) => {
                return <li className={screening === '' ? 'tickets__hours--blank' : ''} key={index}>
                        <Link to={screening.id !== undefined ? `/tickets/${screening.id}` : '#'}>
                            {screening.hour}</Link>
                    </li>
            })}
        </ul>
    )
}

Screenings.propTypes = {
    screenings: PropTypes.array
}

export default Screenings
