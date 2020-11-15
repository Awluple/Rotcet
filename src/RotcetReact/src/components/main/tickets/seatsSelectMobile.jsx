import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

const SeatsSelectMobile = props => {

    const [seat, setSeat] = useState(null)
    const [occupied, setOccupied] = useState(true)

    useEffect(() => {
        // disable scrolling when is visable
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const checkSeat = (e) => {
        if(e.target.value === "" || props.occupied.includes(parseInt(e.target.value))
        || props.chosenSeats.includes(parseInt(e.target.value))){
            setOccupied(true)
        } else{
            setOccupied(false)
        }
        setSeat(parseInt(e.target.value))
    }

    const addSeat = () => {
        if (occupied || seat === null || isNaN(seat)) {
            return
        }
        props.addSeat(seat)
        props.setShowSelectionPanel(false)
    }

    return (
        <div className='seats_selection'>
            <button onClick={() => {props.setShowSelectionPanel(false)}}>X</button>
            <form onSubmit={e => {e.preventDefault()}}>
                <input onChange={checkSeat} min='1' max='108' type="number"/>
                <button onClick={addSeat}
                className={'button' + (occupied ? ' disabled' : '')}>Add seat</button>
            </form>
        </div>
    )
}

SeatsSelectMobile.propTypes = {
    chosenSeats: PropTypes.array.isRequired,
    occupied: PropTypes.array.isRequired,
    addSeat: PropTypes.func.isRequired,
    setShowSelectionPanel: PropTypes.func.isRequired
}

export default SeatsSelectMobile
