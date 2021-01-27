import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

import {toDateObjects, organizeScreenings} from 'utilities/screenings/scripts.js'

import Screenings from './screenings.jsx'

const Movie = props => {

    const [screeningsDates, setScreeningsDates] = useState(null); 

    useEffect(() => {
        let screenings = toDateObjects(props.movie.screenings)
        screenings = organizeScreenings(screenings, 30)
        let date = screenings['days'][0]
            const day1 = {
                date: date,
                screenings: screenings[date]
            }
        if (screenings['days'].length > 1){
            date = screenings['days'][1]
            const day2 = {
                date: date,
                screenings: screenings[date]
            }
            
            setScreeningsDates({day1: day1, day2: day2})
        } else {
            setScreeningsDates({day1: day1})
        }
    }, [])

    if (screeningsDates){
        return (
            <li className='movies__movie'>
                <Link to={`/movie/${props.movie.name}-${props.movie.id}`}>
                    <h3>{props.movie.name}</h3>
                </Link>
                <div className='movies__details'>

                    <div className='movies__image'>
                        <Link to={`/movie/${props.movie.name}-${props.movie.id}`}>
                            <img src={props.movie.thumbnail} alt="movie image"/>
                        </Link>
                    </div>

                    <div className='movies__screenings'>
                        <p>{props.movie.has_3D ? '2D/3D' : '2D'}</p>
                        <Screenings day={screeningsDates.day1} />
                        {'day2' in screeningsDates &&
                            <Screenings day={screeningsDates.day2} />
                        }
                    </div>
                </div>
                <div className='movies__all_times'>
                    <Link className='shadow-small'
                    to={{
                        pathname: `/movie/${props.movie.name}-${props.movie.id}`,
                        hash: "#tickets",
                      }} >
                        All times
                    </Link>
                </div>
            </li>
            )
        }else {
        return null
    }
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired
}

export default Movie
