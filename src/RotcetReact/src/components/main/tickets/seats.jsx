import React, {useRef, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

import SeatsManager from './mobileManager/seatsManager.jsx'

import {draw} from './canvasDraw.js'

const Seats = props => {
    const canvasRef = useRef(null)
    
    const smallDevice = useScreenWidth(600)

    const addSeat = seat => {
        props.setChosenSeats(props.chosenSeats.concat(seat))
    }

    const deleteSeat = seat => {
        props.setChosenSeats(props.chosenSeats.filter(s => {return s !== seat}))
    }

    useEffect(() => {
        // init canvas draw and redraw if props.chosenSeats.length has changed
        const canvas = canvasRef.current
        canvas.width = 600
        canvas.height = 450
        
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();


        draw(canvas, ctx, smallDevice, props.occupied, props.chosenSeats, addSeat, deleteSeat)
    }, [props.chosenSeats.length, smallDevice])

    return (
        <div className='tickets__canvas'>
            { !smallDevice && <h2>1. Select seats</h2>}
            <canvas ref={canvasRef} />
            {smallDevice && 
                <div className='seats_manager'>
                    <h2>1. Select seats</h2>
                    <SeatsManager chosenSeats={props.chosenSeats} occupied={props.occupied} addSeat={addSeat} deleteSeat={deleteSeat} />
                </div>
            }
        </div>
    )
}

Seats.propTypes = {
    occupied: PropTypes.array.isRequired,
    chosenSeats: PropTypes.array.isRequired,
    setChosenSeats: PropTypes.func.isRequired
    // addTicket: PropTypes.func.isRequired
}

export default Seats
