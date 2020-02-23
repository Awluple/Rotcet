import React from 'react'
import PropTypes from 'prop-types'

const Movie = props => {

    const toDateObjects = (screenings) => {
        /* Converts api's dates as string ("2020-02-23T12:09:43Z") to JS Date object */
        screenings = screenings.map(screening => {
            screening = screening.replace('Z', '') // Dont't convert to local time
            return new Date(screening)
        })

        return screenings
    }
    
    const sortScreenings = (screenings) => {
        let sorted = {}
        screenings.map(screening => {
            console.log(screening)
            const dd = screening.getDate()
            const mm = screening.getMonth() + 1
            const yyyy = screening.getFullYear()

            const hour = screening.getHours()
            let minute = screening.getMinutes()

            minute = minute < 10 ? `0${minute}` : minute // if minute is less then 0, add 0 before (9 => 09)

            if (sorted[`${dd}.${mm}.${yyyy}`] in sorted){
                sorted[`${dd}.${mm}.${yyyy}`].push(`${hour}:${minute}`)
            } else {
                sorted[`${dd}.${mm}.${yyyy}`] = [`${hour}:${minute}`]
            }
        })
        return sorted
    }

    console.log(sortScreenings(toDateObjects(props.movie.screenings)))

    return (
        <div className='movies__movie'>
            <h3>{props.movie.name}</h3>
            <div className='movie__details'>

                <div className='movie__image'>
                    <img src={props.movie.thumbnail} alt="movie image"/>
                </div>

                <div className='movie__screenings'>
                    <p>{props.movie.has_3D ? '2D/3D' : '2D'}</p>
                </div>

            </div>
        </div>
        )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired
}

export default Movie
