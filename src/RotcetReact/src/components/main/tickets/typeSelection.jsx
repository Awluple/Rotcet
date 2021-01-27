import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const TypeSelection = props => {

    const [type, setType] = useState(null)

    const validateType = (newType) => {
        // disable membership option for non members and if no more member tickets available
        if(!props.member && newType === 3) {
            return false
        } else if (newType === 3 && props.memberTicketsChosen >= props.membershipType) {
            return false
        } else {
            return true
        }
    }

    useEffect(() => {
        if (validateType(3)) {
            setType(3)
        } else {
            setType(1)
        }

        return () => {
             // remove this ticket
             const updated = props.tickets.filter(ticket => {
                 return ticket.seat !== props.seat
                 })
             props.setTickets(updated)
        }
    }, [])

    const changeType = newType => {
        if(validateType(newType)){
            setType(newType)
        }
    }

    useEffect(() => {
        // update tickets
        const { setTickets, tickets } = props
        let updated
        if (tickets.length > 0) {
            updated = tickets.filter(ticket => {
                return ticket.seat !== props.seat
            })
            updated = updated.concat([{seat: props.seat, type: type}])
        } else {
            updated = [{seat: props.seat, type: type}]
        }
        setTickets(updated)
    }, [type])

    return (
        <div>
            <li key={props.seat}>
                <div className='tickets__seat'>
                    <p>Ticket {props.index + 1}</p>
                    <p>Seat {props.seat}</p>
                </div>
                <div className='tickets__select'>
                        <input id={`ticket-${props.seat}-1`} name={`ticket-${props.seat}`}
                        value={1} type="radio" checked={type === 1}
                        checked={type === 1}
                        onChange={() => {return}}/>
                        <label htmlFor={`ticket-${props.seat}-1`} onClick={() => {changeType(1)}}></label>
                        
                        <input id={`ticket-${props.seat}-2`} name={`ticket-${props.seat}`}
                        value={2} type="radio" checked={type === 2}
                        checked={type === 2}
                        onChange={() => {return}}/>
                        <label htmlFor={`ticket-${props.seat}-2`} onClick={() => {changeType(2)}}></label>

                        <input id={`ticket-${props.seat}-3`} name={`ticket-${props.seat}`}
                        value={3} type="radio" checked={type === 3}
                        checked={type === 3}
                        className={(props.member && ((props.memberTicketsChosen !== props.membershipType) || type === 3)) ? '' : 'disabled'}
                        onChange={() => {return}}/>
                        <label htmlFor={`ticket-${props.seat}-3`} onClick={() => {changeType(3)}}></label>
                </div>
            </li>
        </div>
    )
}

TypeSelection.propTypes = {
    seat: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    member: PropTypes.bool.isRequired,
    membershipType: PropTypes.number.isRequired,
    memberTicketsChosen: PropTypes.number.isRequired,
    setTickets: PropTypes.func.isRequired,
    tickets: PropTypes.array.isRequired
}

export default TypeSelection
