import React, { Component } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'

import MovieList from './moviesList.jsx'

class Shedule extends Component {

    state = {
        movies: null
    }

    getMovies = (query) => {
        return axios.get(`/api/movies`,
        {params: query
        })
         .then(
            res => { return res.data.results }
        )
    }

    componentDidMount() {
        let time = new Date()
        const year = time.getUTCFullYear()
        const month = time.getUTCMonth() + 1
        const day = time.getUTCDate()
        const query = {
            'fields': 'id,name,has_3D,screenings,thumbnail',
            'screenings_min': `${year}-${month}-${day}`,
            'page_size': 100
        }
        this.getMovies(query).then(data => {
            this.setState({
                movies: data
            })
        })
    }

    render() {
        return (
            <div className='shedule'>
            <h2>SHEDULE</h2>
            <MovieList movies={this.state.movies} />
            <div className='shedule__calendar'>
                <Link to='/calendar'>CALENDAR</Link>
            </div>
        </div>
        )
    }
}

export default Shedule