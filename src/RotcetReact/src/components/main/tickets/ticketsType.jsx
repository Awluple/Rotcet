import React, {useState} from 'react'
import PropTypes from 'prop-types'

import { Link } from "react-router-dom";

import TypeSelection from './typeSelection.jsx'

const TicketsType = props => {

    const [memberTicketsChosen, setMemberTicketsChosen] = useState(0)

    const addMemberTicket = () => {
        setMemberTicketsChosen(memberTicketsChosen + 1)
    }

    const subtractMemberTicket = () => {
        setMemberTicketsChosen(memberTicketsChosen - 1)
    }

    return (
        <div className='tickets__type'>
            <h2>2. Choose the type of tickets</h2>
            {props.chosenSeats.length > 0 ?
                <div className='tickets__tickets'>
                <div className='tickets__description'>
                    <p>Standard - 6£</p>
                    <p>Kids/Seniors* - 4£</p>
                    <p>Membership - 3£</p>
                </div>
                <ul>
                    {props.chosenSeats.map((seat, index) => {
                        return (
                            <TypeSelection key={seat} seat={seat} index={index} member={props.member} membershipType={props.membershipType}
                            memberTicketsChosen={memberTicketsChosen} addMemberTicket={addMemberTicket} subtractMemberTicket={subtractMemberTicket}
                            />
                        )
                    })}
                </ul>
                    {!props.member && 
                        <p className='tickets__info tickets__info--membership'>Visit us often? Try <Link to='/membership' target='blank'>membership</Link> option!</p>
                    }
                    <p className='tickets__info'>*Kids under 13 years old and seniors above 60</p>
                    <p className='tickets__info'>We may ask for age proof for kids/seniors ticket and
                    age restricted movies </p>

                    <Link to='/' className='button shadow-tiny'>Continue</Link>
                </div>
                :
                <h3>Please select a seat first</h3>
            }
        </div>
    )
}

TicketsType.propTypes = {
    chosenSeats: PropTypes.array,
    member: PropTypes.bool.isRequired,
    membershipType: PropTypes.number.isRequired
}

export default TicketsType
