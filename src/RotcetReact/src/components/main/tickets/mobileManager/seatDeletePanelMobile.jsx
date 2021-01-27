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
        <div className='seats_selection seats_selection--delete'>
            <div onClick={() => {props.setShowDeletePanel(false)}} className='close'></div>
            <div className="close-button">
                <svg onClick={() => {props.setShowDeletePanel(false)}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"></path>
                </svg>
            </div>
            <div className='seats__panel'>
            <h3 className='header header--medium'>Do you want to remove seat number <span className='seats__number'>{props.seat}</span>?</h3>
            <div className='seats__buttons'>
                <button onClick={() => {props.deleteSeat(props.seat); props.setShowDeletePanel(false)}}>Yes</button>
                <button onClick={() => {props.setShowDeletePanel(false)}}>No</button>
            </div>
            </div>
        </div>
    )
}

SeatDeletePanelMobile.propTypes = {
    seat: PropTypes.number.isRequired,
    deleteSeat: PropTypes.func.isRequired,
    setShowDeletePanel: PropTypes.func.isRequired
}

export default SeatDeletePanelMobile
