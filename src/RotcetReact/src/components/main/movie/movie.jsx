import React, {useState, useEffect, useRef, useCallback} from 'react'
import axios from 'axios'

import {toDateObjects, organizeScreenings} from 'utilities/screenings/scripts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Details from './details.jsx'
import Images from './images/images.jsx'
import Trailers from './trailers.jsx'
import Tickets from './tickets.jsx'

const Movie = (props) => {
    const [movie, setMovie] = useState(null)
    const [dates, setDates] = useState(null)

    const tickets = useRef(null)

    useEffect(() => {
        axios.get(`/api/movies/${props.match.params.id}`)
        .then(res => {
            const movie = res.data
            setMovie(movie)

            if(movie.screenings.length > 0 && movie.tickets_sale_date){
                let dates = toDateObjects(movie.screenings)
                dates = organizeScreenings(dates)
                setDates(dates)
            }
        }).catch(err => {
            console.log(err)
            if(err.response.status == 404){
                props.history.push('/errors/404')
            }
        })
    }, [])

    const scrollToTickets = () => {
        document.documentElement.style.scrollBehavior = 'smooth'
        window.scrollTo(0, tickets.current.offsetTop)
        document.documentElement.style.scrollBehavior = 'auto'
    }

    if(movie){
        let trailers = movie.trailers
        if (movie.main_trailer){
            trailers = [
                {
                    id: 'main',
                    trailer: movie.main_trailer,
                    trailer_thumbnail: movie.trailer_thumbnail,
                }
            ].concat(movie.trailers)
        }
        return (
            <div className='movie'>
                <Details scrollToTickets={scrollToTickets} name={movie.name} description={movie.description} shortDescription={movie.short_description}
                image={movie.main_image} tickets={movie.tickets_sale_date} />
                { movie.images.length > 0 &&
                    <Images images={movie.images} />
                }
                { (movie.main_trailer || movie.trailers.length > 0) &&
                    <Trailers trailers={trailers} />
                }
                { dates &&
                    <Tickets ref={tickets} scrollToTickets={scrollToTickets} screenings={dates} />
                }
            </div>
        )
    }else{
        return (
            <div className='movie'>
                <LoadingGif />
            </div>
        )
    }
}

export default Movie
