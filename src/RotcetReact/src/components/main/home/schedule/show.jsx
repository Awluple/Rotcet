import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

import {toDateObjects, organizeScreenings} from 'utilities/screenings/scripts.js'

import Screenings from './screenings.jsx'

const Movie = props => {

    const [screeningsDates, setScreeningsDates] = useState(null); 

    useEffect(() => {
        let screenings = toDateObjects(props.show.screenings)
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
                <Link to={`/movie/${props.show.name.replace(" ", "-")}-${props.show.type}-${props.show.id}`}>
                    <h3>{props.show.name}</h3>
                </Link>
                <div className='movies__details'>

                    <div className='movies__image'>
                        <Link to={`/movie/${props.show.name.replace(" ", "-")}-${props.show.type}-${props.show.id}`}>
                            <img src={props.show.thumbnail ? props.show.thumbnail : "/static/images/logo.png"} alt="movie image"/>
                        </Link>
                    </div>

                    <div className='movies__screenings'>
                        <p>{props.show.has_3D == null ? "" : props.show.has_3D ? '2D/3D' : '2D'}</p>
                        <Screenings day={screeningsDates.day1} />
                        {'day2' in screeningsDates &&
                            <Screenings day={screeningsDates.day2} />
                        }
                    </div>
                </div>
                <div className='movies__all_times'>
                    <Link className='shadow-small'
                    to={{
                        pathname: `/movie/${props.show.name.replace(" ", "-")}-${props.show.type}-${props.show.id}`,
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
    show: PropTypes.object.isRequired
}

export default Movie
