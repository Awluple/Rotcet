import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const TypeSelection = props => {

    const [type, setType] = useState(1)
    const [init, setInit] = useState(true)

    const updateTickets = (newType) => {
        const { setTickets, tickets } = props
        let updated
        if (tickets.length > 0 || newType !== type) {
            updated = tickets.filter(ticket => {
                return ticket.seat !== props.seat
            })
            updated = updated.concat([{seat: props.seat, type: newType}])
        } else {
            updated = [{seat: props.seat, type: newType}]
        }
        setTickets(updated)
        setType(newType)
    } 

    const validateType = (newType) => {
        // disable membership option for non members and if no more member tickets available
        if((!props.member && newType === 3) || (props.member && (props.memberTicketsChosen === props.membershipType) && newType === 3)) {
            return
        } else if (newType === 3) {
            updateTickets(newType)
            props.addMemberTicket()
        } else {
            if (type === 3){
                props.subtractMemberTicket()
            }
            updateTickets(newType)
        }
    }

    useEffect(() => {
        // set member ticket as default if possible
        if(props.member && props.membershipType && (props.memberTicketsChosen !== props.membershipType)) {
            updateTickets(3)
            props.addMemberTicket()
        }
    }, [])

    useEffect(() => {
        return () => {
            if(type === 3) {
                props.subtractMemberTicket()
            }
        }
    }, [type])

    useEffect(() => {
        // ignore for first render
        if(init) {
            setInit(false)
            return
        }
        updateTickets(type)
    }, [props.index])

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
                        <label htmlFor={`ticket-${props.seat}-1`} onClick={() => {validateType(1)}}></label>
                        
                        <input id={`ticket-${props.seat}-2`} name={`ticket-${props.seat}`}
                        value={2} type="radio" checked={type === 2}
                        checked={type === 2}
                        onChange={() => {return}}/>
                        <label htmlFor={`ticket-${props.seat}-2`} onClick={() => {validateType(2)}}></label>

                        <input id={`ticket-${props.seat}-3`} name={`ticket-${props.seat}`}
                        value={3} type="radio" checked={type === 3}
                        checked={type === 3}
                        className={(props.member && ((props.memberTicketsChosen !== props.membershipType) || type === 3)) ? '' : 'disabled'}
                        onChange={() => {return}}/>
                        <label htmlFor={`ticket-${props.seat}-3`} onClick={() => {validateType(3)}}></label>
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
    addMemberTicket: PropTypes.func.isRequired,
    subtractMemberTicket: PropTypes.func.isRequired,
    setTickets: PropTypes.func.isRequired,
    tickets: PropTypes.array.isRequired
}

export default TypeSelection
