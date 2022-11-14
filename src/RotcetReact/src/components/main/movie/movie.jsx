import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom";

import {toDateObjects, organizeScreenings} from 'utilities/screenings/scripts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Details from './details.jsx'
import Images from './images/images.jsx'
import Trailers from './trailers.jsx'
import Tickets from './tickets.jsx'


import Gallery from './images/gallery.jsx'
import { Route, Routes, Outlet  } from "react-router-dom";

const Movie = (props) => {
    const [movie, setMovie] = useState(null)
    const [dates, setDates] = useState(null)
    const [trailers, setTrailers] = useState(null)

    const tickets = useRef(null)
    const { id } = useParams();

    useEffect(() => {
        axios.get(`/api/movies/${id}`)
        .then(res => {
            const movie = res.data
            setMovie(movie)
            document.title = movie.name
            // get screenings dates if the movie has any
            if(movie.screenings.length > 0 && movie.tickets_sale_date){
                let dates = toDateObjects(movie.screenings)
                dates = organizeScreenings(dates, 30)
                setDates(dates)
            }
        }).catch(err => {
            console.error(err)
            if(err.response.status == 404){
                props.navigate('/errors/404')
            }
        })
    }, [])

    const scrollToTickets = () => {
        document.documentElement.style.scrollBehavior = 'smooth'
        console.log(tickets);
        window.scrollTo(0, tickets.current.offsetTop)
        document.documentElement.style.scrollBehavior = 'auto'
    }

    useEffect(() => {
        if(movie === null) return

        // add main trailer to trailers array
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
        setTrailers(trailers)
    }, [movie])

    if(movie){
        return (
            <div className='movie'>
                <Routes>
                    <Route path="*" element={<Outlet />}>
                        <Route path="images-:imageId" element={<Gallery images={movie.images} />} />
                    </Route>
                </Routes> */
                <Details scrollToTickets={scrollToTickets} name={movie.name} description={movie.description} shortDescription={movie.short_description}
                image={movie.main_image} tickets={movie.tickets_sale_date} />
                { movie.images.length > 0 &&
                    <Images images={movie.images} />
                }
                { (movie.main_trailer || movie.trailers.length > 0) && trailers &&
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
