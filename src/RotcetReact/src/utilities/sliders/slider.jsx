import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

import SliderInfo from './sliderInfo.jsx'

const Slider = props => {

    const listRef = useRef(null);

    const [position, setPosition] = useState(0);
    const [isOverWidth, setIsOverWidth] = useState(false);

    const [touchStartPosition, setTouchStartPosition] = useState(0)
    const [touchPosition, setTouchPosition] = useState(0)

    const resetPosition = () => {
        setPosition(0)
    }

    const smallDevice = useScreenWidth(600)

    const overWidth = () => {
        const width = window.innerWidth <= 2100 ? window.innerWidth : 2100
        resetPosition()
        if (listRef.current.scrollWidth < width){
            setIsOverWidth(true)
        }else {
            setIsOverWidth(false)
        }
    }
    
    // =========== FOR DESKTOP ===========

    useEffect(() => {
        // Flexbox needs some time to set width of a element. This function waits for it and
        // removes the slider arrow if element size is lesser than window size
        let iterations = 0;
        let waitForFlexbox
        const width = window.innerWidth <= 2100 ? window.innerWidth : 2100
        const checkWidth = () => {
            iterations++
            if (!(listRef.current.scrollWidth === 50) && isOverWidth !== true){
                clearInterval(waitForFlexbox)
                setIsOverWidth(listRef.current.scrollWidth < width)
                return
            }
            if (iterations === 5){
                clearInterval(waitForFlexbox)
            }
        }

        if(props.elementsNumber !== 0) {
            waitForFlexbox = setInterval(checkWidth, 100);
        }else if(props.elementsNumber === 0){
            setIsOverWidth(false)
        }
      },[props.elementsNumber]);

    const moveList = (operator) => {
        const width = window.innerWidth <= 2100 ? window.innerWidth : 2100
        if(operator === 'add') {
            if((position + 800) < listRef.current.scrollWidth - width){
                setPosition(position + 500)
            }else{
                // don't let the slider go further when no elements remain
                setIsOverWidth(true)
                setPosition(listRef.current.scrollWidth - width)
            }
        }else {
            setIsOverWidth(false)
            if(position < 800){
                setPosition(0)
            }else{
                setPosition(position - 500)
            }
        }
    }

    // =========== FOR MOBILE ===========

    useEffect(() => {
        // resets list position and hides arrow if needed
        window.addEventListener('resize', overWidth);
        return () => {
            window.removeEventListener('resize', overWidth);
         }
     }, [])

    useEffect(() => {
        const medium = window.matchMedia("(max-width: 1024px)")
        medium.addListener(resetPosition)
        return () => {
            medium.removeListener(resetPosition)
        }
    }, [])


    const touchStart = event => {
        setTouchStartPosition(event.touches[0].clientX)
        setTouchPosition(0)
    }

    const touchMove = event => {
        setTouchPosition(event.touches[0].clientX)
    }

    const touchEnd = () => {
        if (smallDevice && props.elementsNumber > 1 && touchPosition !== 0){
            if (touchStartPosition - touchPosition >= 50 && position / 100 < Math.floor((props.elementsNumber - 1) / props.elementsOnScreen)) { // next
                setPosition(position + 100)
            }else if (touchStartPosition - touchPosition <= -50 && position > 0){ // back
                setPosition(position - 100)
            }
        }
    }

    const mouseStart = event => {
        setTouchStartPosition(event.clientX)
        setTouchPosition(0)
    }

    const mouseMove = event => {
        setTouchPosition(event.clientX)
    }

    const mouseEnd = () => {
        if (smallDevice && props.elementsNumber > 1 && touchPosition !== 0){
            if (touchStartPosition - touchPosition >= 50 && position / 100 < Math.floor((props.elementsNumber - 1) / props.elementsOnScreen)) { // next
                setPosition(position + 100)
            }else if (touchStartPosition - touchPosition <= -50 && position > 0){ // back
                setPosition(position - 100)
            }
        }
    }
    

    return (
        <div 
        onTouchMove={touchMove} onTouchStart={touchStart} onTouchEnd={touchEnd}
        className={'slider ' + (props.containerClassName ? props.containerClassName : '')}>
            { position !== 0 && props.elementsNumber !== 0 &&
                <button onClick={() => {moveList('subtract')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            <ul ref={listRef} style={{right: position + (smallDevice ? 'vw' : 'px')}} 
            className={'slider__list ' + (props.listClassName ? props.listClassName : '')}>
                {props.children}
            </ul>
            { props.elementsNumber !== 0 && !isOverWidth &&
                <button onClick={() => {moveList('add')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            { smallDevice && props.elementsNumber > 1 &&
                <SliderInfo sliderInfoClassName={props.sliderInfoClassName} mouseMove={mouseMove} mouseStart={mouseStart} mouseEnd={mouseEnd}
                position={position} elementsNumber={props.elementsNumber} elementsOnScreen={props.elementsOnScreen}/>
            }
        </div>
        
    )
}

Slider.defaultProps = {
    elementsOnScreen: 1
}

Slider.propTypes = {
    children: PropTypes.node.isRequired,
    elementsNumber: PropTypes.number.isRequired,
    elementsOnScreen: PropTypes.number, // number of list items on one page on a small device
    containerClassName: PropTypes.string,
    listClassName: PropTypes.string,
    sliderInfoClassName: PropTypes.string,
}

export default Slider
