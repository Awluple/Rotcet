import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'

const MoviesList = props => {

    const moviesRef = useRef(null);

    const [position, setPosition] = useState(0);
    const [isOverWidth, setIsOverWidth] = useState(false);

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
                setPosition(position + 500)
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
                setPosition(position - 500)
            }
        }
    }


    return (
        <div className='shedule__container shadow-big'>
            { position !== 0 &&
                <button onClick={() => {moveMovies('subtract')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            <ul ref={moviesRef} style={{right: position + 'px'}} 
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
        </div>
        
    )
}

MoviesList.propTypes = {
    movies: PropTypes.array
}

export default MoviesList
