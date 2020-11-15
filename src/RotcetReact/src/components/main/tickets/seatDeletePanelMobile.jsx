import React, {useEffect} from 'react'
import PropTypes from 'prop-types'

const SeatDeletePanelMobile = props => {

    useEffect(() => {
        // disable scrolling when is visable
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    return (
        <div className='seats_selection'>
            <button onClick={() => {props.setShowDeletePanel(false)}}>X</button>
            <h3>Do you want to remove seat number {props.seat}?</h3>
            <button onClick={() => {props.deleteSeat(props.seat); props.setShowDeletePanel(false)}}>Yes</button>
            <button onClick={() => {props.setShowDeletePanel(false)}}>No</button>
        </div>
    )
}

SeatDeletePanelMobile.propTypes = {
    seat: PropTypes.number.isRequired,
    deleteSeat: PropTypes.func.isRequired,
    setShowDeletePanel: PropTypes.func.isRequired
}

export default SeatDeletePanelMobile
