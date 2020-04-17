import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'

const MoviesList = props => {

    const moviesRef = useRef(null);

    const [position, setPosition] = useState(0);
    const [isOverWidth, setIsOverWidth] = useState(false);

    const [smallDevice, setSmallDevice] = useState(false)

    const [touchStartPosition, setTouchStartPosition] = useState(0)
    const [touchPosition, setTouchPosition] = useState(0)

    const resetPosition = () => {
        setPosition(0)
    }

    const overWidth = () => {
        resetPosition()
        if (moviesRef.current.scrollWidth < window.innerWidth){
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

        const checkWidth = () => {
            iterations++
            if (!(moviesRef.current.scrollWidth === 50) && isOverWidth !== true){
                clearInterval(waitForFlexbox)
                setIsOverWidth(moviesRef.current.scrollWidth < window.innerWidth)
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
        if(operator === 'add') {
            if((position + 800) < moviesRef.current.scrollWidth - window.innerWidth){
                setPosition(position + pxToScroll)
            }else{
                // don't let the slider go further when no movies remain
                setIsOverWidth(true)
                setPosition(moviesRef.current.scrollWidth - window.innerWidth)
            }
        }else {
            setIsOverWidth(false)
            if(position < 800){
                setPosition(0)
            }else{
                setPosition(position - pxToScroll)
            }
        }
    }

    // =========== FOR MOBILE ===========

    const changeSize = (size) => {
        resetPosition()
        if(size.matches) {
            setSmallDevice(true)
        }else {
            setSmallDevice(false)
        }
    }

    useEffect(() => {
        // resets list position and hides arrow if needed
        window.addEventListener('resize', overWidth);
        return () => {
            window.removeEventListener('resize', overWidth);
         }
     }, [])

    useEffect(() => {
        // activates list move by touch
        const small = window.matchMedia("(max-width: 600px)")
        changeSize(small)
        small.addListener(changeSize)
        return () => {
            small.removeListener(changeSize)
        }
    }, [])

    useEffect(() => {
        const medium = window.matchMedia("(max-width: 1024px)")
        medium.addListener(resetPosition)
        return () => {
            medium.removeListener(changeSize)
        }
    }, [])

    const touchStart = event => {
        setTouchStartPosition(event.touches[0].clientX)
    }

    const touchMove = event => {
        setTouchPosition(event.touches[0].clientX)
    }

    const touchEnd = () => {
        if (smallDevice && props.movies.length > 1){
            if (touchStartPosition - touchPosition >= 50 && position / 100 < props.movies.length - 1) { // next
                setPosition(position + 100)
            }else if (touchStartPosition - touchPosition <= -50 && position > 0){ // back
                setPosition(position - 100)
            }
        }
    }
    

    return (
        <div onTouchMove={touchMove} onTouchStart={touchStart} onTouchEnd={touchEnd} className='shedule__container shadow-big'>
            { position !== 0 &&
                <button onClick={() => {moveMovies('subtract')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            <ul ref={moviesRef} style={{right: position + (smallDevice ? 'vw' : 'px')}} 
            className={'shedule__movies' + (props.movies === null || (props.movies && props.movies.length === 0) ? ' shedule__movies--no_movies' : '')}>

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
                <div className='shedule_slider_info'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M11 6h-4l5-6 5 6h-4v3h-2v-3zm2 9h-2v3h-4l5 6 5-6h-4v-3zm6-4h-14v2h14v-2z"/>
                    </svg>
                </div> 
            }
        </div>
        
    )
}

MoviesList.propTypes = {
    movies: PropTypes.array
}

export default MoviesList
