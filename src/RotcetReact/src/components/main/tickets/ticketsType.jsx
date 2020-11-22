import React from 'react'
import PropTypes from 'prop-types'

const TicketsType = props => {
    return (
        <div className='tickets__type'>
            <h2>2. Choose the type of tickets</h2>
            {props.chosenSeats.length > 0 &&
                <ul>
                    {props.chosenSeats.map((seat, index) => {
                        return (
                            <li key={seat}>
                                <div className='tickets__seat'>
                                    <p>Ticket {index + 1}</p>
                                    <p>Seat {seat}</p>
                                </div>
                                <div className='tickets__select'>
                                        <input id={`ticket-${seat}-1`} name={`ticket-${seat}`} type="radio"/>
                                        <label htmlFor={`ticket-${seat}-1`}></label>
                                        
                                        <input id={`ticket-${seat}-2`} name={`ticket-${seat}`} type="radio"/>
                                        <label htmlFor={`ticket-${seat}-2`}></label>

                                        <input id={`ticket-${seat}-3`} name={`ticket-${seat}`} type="radio"/>
                                        <label htmlFor={`ticket-${seat}-3`}></label>
                                </div>
                            </li>
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
