import React, {useEffect, useState} from 'react'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'

import Movie from './movie.jsx'

const Highlight = () => {

    const [highlights, setHighlights] = useState(null)

    const getMovies = () => {
        return axios.get('/api/movies', {
            params: {
                'highlight': true,
                'fields': 'id,name,main_trailer,thumbnail,short_description,trailer_thumbnail,screenings'
            }
        }).then(
            res => { return res.data.results }
        )
    }

    useEffect(() => {
        getMovies().then(data => {
            setHighlights(data)
        })
    }, [])

    if(highlights === null){
        return (
            <div className='highlight highlight--no_movies'>
                <LoadingGif />
            </div>
        )
    }else if (highlights.length === 0){
        return null
    }

    return (
        <div className='highlight'>
            <h2 className='header header--big'>Highlights</h2>
            <div className='highlight__movies'>
                {highlights.map((movie, index) => {
                    return <Movie key={movie.id} movie={movie} index={index} />
                })}
            </div>
        </div>
    )
}

export default Highlight
