import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import {toDateObjects, organizeScreenings} from 'utilities/screenings/scripts.js'

import Screenings from './screenings.jsx'

const Movie = props => {

    const [screeningsDates, setScreeningsDates] = useState(null); 

    useEffect(() => {
        let screenings = toDateObjects(props.movie.screenings)
        screenings = organizeScreenings(screenings)
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
                <h3>{props.movie.name}</h3>
                <div className='movie__details'>

                    <div className='movie__image'>
                        <img src={props.movie.thumbnail} alt="movie image"/>
                    </div>

                    <div className='movie__screenings'>
                        <p>{props.movie.has_3D ? '2D/3D' : '2D'}</p>
                        <Screenings day={screeningsDates.day1} />
                        {'day2' in screeningsDates &&
                            <Screenings day={screeningsDates.day2} />
                        }
                    </div>
                </div>
                <div className='movie__all_times'>
                    <a href="">All times</a>
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
