import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'
import SliderInfo from './sliderInfo.jsx'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

const MoviesList = props => {

    const moviesRef = useRef(null);

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
        if (moviesRef.current.scrollWidth < width){
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
            if (!(moviesRef.current.scrollWidth === 50) && isOverWidth !== true){
                clearInterval(waitForFlexbox)
                setIsOverWidth(moviesRef.current.scrollWidth < width)
                return
            }
            if (iterations === 5){
                clearInterval(waitForFlexbox)
            }
        }

        if(props.movies && props.movies.length !== 0) {
            waitForFlexbox = setInterval(checkWidth, 100);
        }else if(props.movies && props.movies.length === 0){
            setIsOverWidth(true)
        }
      },[props.movies]);

    const moveMovies = (operator) => {
        const width = window.innerWidth <= 2100 ? window.innerWidth : 2100
        if(operator === 'add') {
            if((position + 800) < moviesRef.current.scrollWidth - width){
                setPosition(position + 500)
            }else{
                // don't let the slider go further when no movies remain
                setIsOverWidth(true)
                setPosition(moviesRef.current.scrollWidth - width)
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
        if (smallDevice && props.movies.length > 1 && touchPosition !== 0){
            if (touchStartPosition - touchPosition >= 50 && position / 100 < props.movies.length - 1) { // next
                setPosition(position + 100)
            }else if (touchStartPosition - touchPosition <= -50 && position > 0){ // back
                setPosition(position - 100)
            }
        }
    }
    

    return (
        <div onTouchMove={touchMove} onTouchStart={touchStart} onTouchEnd={touchEnd} className='schedule__container shadow-big'>
            { position !== 0 &&
                <button onClick={() => {moveMovies('subtract')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            <ul ref={moviesRef} style={{right: position + (smallDevice ? 'vw' : 'px')}} 
            className={'schedule__movies' + (props.movies === null || (props.movies && props.movies.length === 0) ? ' schedule__movies--no_movies' : '')}>

                {/* Wait for server response */}
                {props.movies === null && 
                    <LoadingGif />
                }

                {props.movies && props.movies.length === 0 && 
                    <h2>Sorry, there are no screenings for now</h2>
                }

                {props.movies && props.movies.length > 0 && 
                    props.movies.map(movie => {
                        return (
                            <Movie key={movie.id} movie={movie} />
                        )
                    })
                }
            </ul>
            { !isOverWidth &&
                <button onClick={() => {moveMovies('add')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            { props.movies !== null && smallDevice && props.movies.length > 1 &&
                <SliderInfo position={position} movies={props.movies.length} />
            }
        </div>
        
    )
}

MoviesList.propTypes = {
    movies: PropTypes.array
}

export default MoviesList
