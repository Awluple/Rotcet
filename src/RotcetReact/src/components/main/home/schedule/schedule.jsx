import React, { Component } from 'react'
import { Link } from "react-router-dom"
import axios from 'axios'

import {addZeroForBelowTen} from 'utilities/tools/tools.js'

import Show from './show.jsx'
import Slider from 'utilities/sliders/slider.jsx'
import LoadingGif from 'media/gifs/loading.jsx'

class Schedule extends Component {

    state = {
        shows: null
    }

    componentDidMount() {
        let time = new Date()
        time.setMinutes(time.getMinutes() + 30)
        const year = time.getUTCFullYear()
        const month = addZeroForBelowTen(time.getUTCMonth() + 1)
        const day = addZeroForBelowTen(time.getUTCDate())

        const hours = addZeroForBelowTen(time.getUTCHours())
        const minutes = addZeroForBelowTen(time.getUTCMinutes())
        const seconds = addZeroForBelowTen(time.getUTCSeconds())

        const query = {
            'fields': 'id,name,type,has_3D,screenings,thumbnail',
            'screenings_min': `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            'page_size': 100
        }
        axios.all([
            axios.get(`/api/movies`,
            {params: query
            }),
            axios.get(`/api/marathons`,
            {params: query
            })
          ])
          .then(axios.spread((data1, data2) => {
            this.setState({
                shows: data1.data.results.concat(data2.data.results)
            })
          }));
        
    }

    render() {
        return (
            <div className='schedule'>
            <h2 className='main_section_header'>SCHEDULE</h2>
            <Slider elementsNumber={this.state.shows ? this.state.shows.length : 0}
            listClassName={'schedule__movies' + (this.state.shows === null || (this.state.shows && this.state.shows.length === 0) ? ' schedule__movies--no_movies' : '')}
            containerClassName='schedule__container shadow-small'
            sliderInfoClassName='schedule_slider_info'>
                { this.state.shows !== null ? 
                    this.state.shows.length > 0 ? 
                        this.state.shows.map(show => {
                            return (
                                <Show key={show.id} show={show} />
                            )
                        })
                    :  <h2>Sorry, there are no screenings for now</h2>
                :
                <LoadingGif /> 
            }
            </Slider>
            <div className='schedule__calendar'>
                <Link to='/calendar'>CALENDAR</Link>
            </div>
        </div>
        )
    }
}

export default Schedule