import React, {useState, useRef, useEffect, useLayoutEffect} from 'react'
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'

const MoviesList = props => {

    const moviesRef = useRef(null);

    const [position, setPosition] = useState(0);
    const [isOverWidth, setIsOverWidth] = useState(false);

    const [smallDevice, setSmallDevice] = useState(false)

    const resetPosition = () => {
        setPosition(0)
    }

    const changeSize = (size) => {
        resetPosition()
        if(size.matches) {
            setSmallDevice(true)
        }else {
            setSmallDevice(false)
        }
    }

    const over = () => {
        resetPosition()
        if (moviesRef.current.scrollWidth < window.innerWidth){
            setIsOverWidth(true)
        }else {
            setIsOverWidth(false)
        }
    }
    
    useEffect(() => {
        window.addEventListener('resize', over);
        return () => {
            window.removeEventListener('resize', over);
         }
     }, [])

    useEffect(() => {
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


    return (
        <div className='shedule__container shadow-big'>
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
            {/* { !isOverWidth && smallDevice &&
                <svg xmlns="http://www.w3.org/2000/svg" width="50" viewBox="0 0 24 24">
                    <path d="M11 6h-4l5-6 5 6h-4v3h-2v-3zm2 9h-2v3h-4l5 6 5-6h-4v-3zm6-4h-14v2h14v-2z"/>
                </svg>
            } */}
        </div>
        
    )
}

MoviesList.propTypes = {
    movies: PropTypes.array
}

export default MoviesList
