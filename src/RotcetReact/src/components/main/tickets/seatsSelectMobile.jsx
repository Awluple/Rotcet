import React, {useEffect, useState ,useRef} from 'react'
import PropTypes from 'prop-types'

const SeatsSelectMobile = props => {

    const [seat, setSeat] = useState(null)
    const [occupied, setOccupied] = useState(true)
    
    const input = useRef(null)

    const availableSVG = <svg className='available' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>
    const unavailableSVG = <svg className='unavailable' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"></path></svg>

    useEffect(() => {
        // disable scrolling when is visable
        document.body.style.overflow = 'hidden';
        input.current.focus()
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    const checkSeat = (e) => {
        // checks if seat in input is available
        if(e.target.value === "" || props.occupied.includes(parseInt(e.target.value))
        || props.chosenSeats.includes(parseInt(e.target.value))){
            setOccupied(true)
        } else{
            setOccupied(false)
        }
        setSeat(parseInt(e.target.value))
    }

    const addSeat = () => {
        if (occupied || seat === null || isNaN(seat) || seat > 108 || seat < 1) { // input validation
            return
        }
        props.addSeat(seat)
        props.setShowSelectionPanel(false)
    }

    return (
        <div className='seats_selection'>
            <div onClick={() => {props.setShowSelectionPanel(false)}} className='close'></div>
            <div className="close-button">
                <svg onClick={() => {props.setShowSelectionPanel(false)}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"></path>
                </svg>
            </div>
            <form className='seats__panel'>
                <h3 className='header header--medium'>Select a seat</h3>
                <input ref={input} onChange={checkSeat} min='1' max='108' type="number"/>
                <div className='seat-info'>
                    {props.occupied.includes(seat) || seat > 108 ? 
                    <React.Fragment>{unavailableSVG}<p>Seat unavailable</p></React.Fragment> :
                    (seat === null || isNaN(seat)) ? '' :
                    <React.Fragment>{availableSVG}<p>Seat available</p></React.Fragment>}
                </div>
                <button onClick={addSeat}
                className={'button' + ((occupied || seat > 108 || seat < 1) ? ' disabled' : '')}>Add seat</button>
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
