import React from 'react'
import PropTypes from 'prop-types'

import TypeSelection from './typeSelection.jsx'

const TicketsType = props => {
    return (
        <div className='tickets__type'>
            <h2>2. Choose the type of tickets</h2>
            {props.chosenSeats.length > 0 &&
                <ul>
                    {props.chosenSeats.map((seat, index) => {
                        return (
                            <TypeSelection key={seat} seat={seat} index={index} />
                        )
                    })}
                </ul>
            }
        </div>
    )
}

TicketsType.propTypes = {
    chosenSeats: PropTypes.array,
}

export default TicketsType
