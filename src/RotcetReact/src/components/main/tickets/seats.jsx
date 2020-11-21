import React, {useRef, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

import SeatsManager from './seatsManager.jsx'

import {draw} from './canvasDraw.js'

const Seats = props => {
    const canvasRef = useRef(null)

    const [chosenSeats, setChosenSeats] = useState([])
    
    const smallDevice = useScreenWidth(600)

    const addSeat = seat => {
        setChosenSeats(chosenSeats.concat(seat))
    }

    const deleteSeat = seat => {
        setChosenSeats(chosenSeats.filter(s => {return s !== seat}))
    }

    useEffect(() => {
        // init canvas draw and redraw if chosenSeats.length has changed
        const canvas = canvasRef.current
        canvas.width = 600
        canvas.height = 450
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();


        draw(canvas, ctx, smallDevice, props.occupied, chosenSeats, addSeat, deleteSeat)
    }, [chosenSeats.length, smallDevice])

    return (
        <div className='tickets__canvas'>
            { !smallDevice && <h2>1. Select seats</h2>}
            <canvas ref={canvasRef} />
            {smallDevice && 
                <div className='seats_manager'>
                    <h2>1. Select seats</h2>
                    <SeatsManager chosenSeats={chosenSeats} occupied={props.occupied} addSeat={addSeat} deleteSeat={deleteSeat} />
                </div>
            }
        </div>
    )
}

Seats.propTypes = {
    occupied: PropTypes.array.isRequired,
    // addTicket: PropTypes.func.isRequired
}

export default Seats
