import React, { Component } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'

import {addZeroForBelowTen} from 'utilities/tools/tools.js'

import MovieList from './moviesList.jsx'

class Schedule extends Component {

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
        const month = addZeroForBelowTen(time.getUTCMonth() + 1)
        const day = addZeroForBelowTen(time.getUTCDate())
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
            <div className='schedule'>
            <h2>SCHEDULE</h2>
            <MovieList movies={this.state.movies} />
            <div className='schedule__calendar'>
                <Link to='/calendar'>CALENDAR</Link>
            </div>
        </div>
        )
    }
}

export default Schedule