import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Screenings from './screenings.jsx'

const Movie = props => {

    const [screeningsDates, setScreeningsDates] = useState(null);
    
    const toDateObjects = (screenings) => {
        /* Converts api's dates as string ("2020-02-23T12:09:43Z") to JS Date object */
        screenings = screenings.map(screening => {
            screening = screening.replace('Z', '') // Dont't convert to local time
            return new Date(screening)
        })

        return screenings
    }
    
    const checkIfOutdated = date => {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        let now = new Date()
        now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        if (date < now) {
            return true
        } else{
            return false
        }
    }

    const organizeScreenings = (screeningsArray) => {
        /* Changes array of dates to organised object */
        screeningsArray = screeningsArray.sort((date1, date2) => {return date1.getTime() - date2.getTime()}) // set dates in ascending order
        let organized = {
            days: []
        }
        screeningsArray.map(screening => {

            if (checkIfOutdated(screening)) { // ignore outdated screenings
                return
            }

            const dd = screening.getDate()
            const mm = screening.getMonth() + 1
            const yyyy = screening.getFullYear()
            

            organized['days'].push(`${dd}.${mm}.${yyyy}`) // list of all dates

            const hour = screening.getHours()
            let minute = screening.getMinutes()

            minute = minute < 10 ? `0${minute}` : minute // if minute is less then 0, add 0 before (9 => 09)
            
            if (`${dd}.${mm}.${yyyy}` in organized){
                organized[`${dd}.${mm}.${yyyy}`].push(`${hour}:${minute}`)
            } else {
                organized[`${dd}.${mm}.${yyyy}`] = [`${hour}:${minute}`]
            }
        })
        organized['days'] = organized['days'].filter((a, b) => organized['days'].indexOf(a) === b) // remove duplicates

        return organized
    }

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
            <div className='movies__movie'>
                <h3>{props.movie.name}</h3>
                <div className='movie__details'>

                    <div className='movie__image'>
                        <img src={props.movie.thumbnail} alt="movie image"/>
                    </div>

                    <div className='movie__screenings'>
                        <p>{props.movie.has_3D ? '2D/3D' : '2D'}</p>
                        <Screenings day={screeningsDates.day1} />
                        {screeningsDates.day2 &&
                            <Screenings day={screeningsDates.day2} />
                        }
                    </div>

                </div>
            </div>
            )
        }else {
        return null
    }
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired
}

export default Movie
