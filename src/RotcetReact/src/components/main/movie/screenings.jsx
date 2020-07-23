import React from 'react'
import PropTypes from 'prop-types'

const Screenings = props => {
    const fillScreenings = (screenings) => {
        screenings = screenings === null ? [] : screenings
        if(screenings.length >= 7){
            return screenings
        }
        const toFill = []
        for (let numberOfScreenings = screenings.length; numberOfScreenings < 7; numberOfScreenings++) {
            toFill.push('')
        }
        return screenings.concat(toFill)
    }

    const filledScreenings = fillScreenings(props.screenings)
    return (
        <ul>
            {filledScreenings.map((screening, index) => {
                return <li key={index}>{screening}</li>
            })}
        </ul>
    )
}

Screenings.propTypes = {
    screenings: PropTypes.array
}

export default Screenings
