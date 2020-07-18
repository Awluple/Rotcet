import React, {useState, useEffect} from 'react'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'

import Details from './details.jsx'
import Images from './images/images.jsx'
import Trailers from './trailers.jsx'
import Tickets from './tickets.jsx'

const Movie = (props) => {
    const [movie, setMovie] = useState(null)

    useEffect(() => {
        axios.get(`/api/movies/${props.match.params.id}`)
        .then(res => {
            setMovie(res.data)
        }).catch(err => {
            console.log(err)
            if(err.response.status == 404){
                props.history.push('/errors/404')
            }
        })
    }, [])

    if(movie){
        return (
            <div className='movie'>
                <Details name={movie.name} description={movie.description} shortDescription={movie.short_description}
                image={movie.main_image} tickets={movie.tickets_sale_date} />
                { movie.images.lenght > 0 && 
                    <Images images={movie.images} />
                }
                { movie.main_trailer || movie.trailers.length > 0 &&
                    <Trailers mainTrailer={movie.main_trailer} trailerThumbnail={movie.trailer_thumbnail} trailers={movie.trailers} />
                }
                { movie.screenings && 
                    <Tickets screenings={movie.screenings} />
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
