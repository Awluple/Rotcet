import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'
import queryString from 'query-string'

import MovieList from './moviesList.jsx'

const Schedule = () => {
    const [movies, setMovies] = useState(null);

    const getMovies = (query) => {
        query = queryString.stringify(query)
        axios.get(`/api/movies?${query}`).then(
            res => {
                setMovies(res.data.results)
            }
        )
    }

    useEffect(() => {
        let time = new Date()
        const year = time.getUTCFullYear()
        const month = time.getUTCMonth() + 1
        const day = time.getUTCDate()
        const query = {
            'fields': 'id,name,has_3D,screenings,thumbnail',
            'screenings_min': `${year}-${month}-${day}`,
            'page_size': 100
        }
        getMovies(query)
    },[])
    return (
        <div className='shedule'>
            <h2>SHEDULE</h2>
            <MovieList movies={movies} />
            <Link to='/calendar'>CALENDAR</Link>
        </div>
    )
}

export default Schedule