import React, {useState} from 'react'
import PropTypes from 'prop-types'

import SeatsSelectMobile from './seatsSelectMobile.jsx'
import DeletePanelMobile from './seatDeletePanelMobile.jsx'

const SeatsManager = props => {
    // Seats manager for small devices, big devices can click on the canvas to select a seat

    const [showSelectionPanel, setShowSelectionPanel] = useState(false)
    const [showDeletePanel, setShowDeletePanel] = useState(false)
    const [seatToDelete, setSeatToDelete] = useState(0)

    const askToDelete = (seat) => {
        // ask the user if the seat should be deleted
        setSeatToDelete(seat)
        setShowDeletePanel(true)
    }

    return (
        <ul>
        { showSelectionPanel && 
            <SeatsSelectMobile chosenSeats={props.chosenSeats} occupied={props.occupied}
            addSeat={props.addSeat} setShowSelectionPanel={setShowSelectionPanel} />
        }

        { showDeletePanel && 
            <DeletePanelMobile seat={seatToDelete}
            deleteSeat={props.deleteSeat} setShowDeletePanel={setShowDeletePanel} />
        }

        { props.chosenSeats.map(seat => {
            return (
                <li key={seat} onClick={() => {askToDelete(seat)}}>{seat}</li>
            )
        })}
        <li className={props.chosenSeats.length === 0 ? 'empty' : ''} onClick={() => {setShowSelectionPanel(true)}}>+</li>
        </ul>
    )
}

SeatsManager.propTypes = {
    chosenSeats: PropTypes.array.isRequired,
    occupied: PropTypes.array.isRequired,
    addSeat: PropTypes.func.isRequired,
    deleteSeat: PropTypes.func.isRequired
}

export default SeatsManager
