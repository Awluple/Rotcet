import React, {useState, useRef, useEffect} from 'react'
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'

const MoviesList = props => {

    const moviesRef = useRef(null);

    const [position, setPosition] = useState(0);
    const [isOverWidth, setIsOverWidth] = useState(false);

    useEffect(() => {
        let iterations = 0;

        const checkWidth = () => {
            iterations++
            if (!(moviesRef.current.scrollWidth === 50)){
                clearInterval(waitForFlexbox)
                setIsOverWidth(moviesRef.current.scrollWidth < window.innerWidth)
                return
            }
            if (iterations === 5){
                clearInterval(waitForFlexbox)
            }
        }
        const waitForFlexbox = setInterval(checkWidth, 100);
      },[]);

    const moveMovies = (operator) => {   
        if(operator === 'add') {
            if((position + 500) < moviesRef.current.scrollWidth - window.innerWidth){
                setPosition(position + 500)
            }else{
                setIsOverWidth(true)
                setPosition(moviesRef.current.scrollWidth - window.innerWidth)
            }
        }else {
            setIsOverWidth(false)
            if(position < 500){
                setPosition(0)
            }else{
                setPosition(position - 500)
            }
        }
    }

    console.log(isOverWidth)

    return (
        <div className='shedule__container'>
            { position !== 0 &&
                <button onClick={() => {moveMovies('subtract')}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg></button>
            }
            <ul ref={moviesRef} style={{right: position + 'px', display: 'inline-flex'}} className='shedule__movies'>
                {props.movies === null && 
                    <LoadingGif />
                }

                {props.movies && props.movies.length === 0 && 
                    <h2 className='shedule__no_movies'>Sorry, there are no screenings for now</h2>
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
