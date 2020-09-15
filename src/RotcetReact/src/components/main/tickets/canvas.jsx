import React, {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

import {draw} from './canvasDraw.js'

const Canvas = props => {
    const canvasRef = useRef(null)


    const reDraw = () => {
        
    }

    useEffect(() => {
        const canvas = canvasRef.current
        canvas.width = 600
        canvas.height = 450
        const context = canvas.getContext('2d')
        draw(context, [1,2,3])
    }, [])
    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    )
}

Canvas.propTypes = {

}

export default Canvas
