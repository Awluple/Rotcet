import React from 'react'
import PropTypes from 'prop-types'

const Screenings = props => {
    const fillScreenings = (screenings) => {
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
                return <li className={screening === '' ? 'tickets__hours--blank' : ''} key={index}>{screening}</li>
            })}
        </ul>
    )
}

Screenings.propTypes = {
    screenings: PropTypes.array
}

export default Screenings
