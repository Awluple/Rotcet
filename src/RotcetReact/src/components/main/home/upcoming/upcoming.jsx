import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import Movie from './movie.jsx'

const Upcoming = () => {
    const [upcoming, setUpcoming] = useState(null)
    const upcomingRef = useRef(null)

    const getMovies = () => {
        const date = new Date()
        return axios.get('/api/movies', {
            params: {
                has_tickets_sale_date: false,
                release_date__gt: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                fields: 'id,name,thumbnail'
            }
        }).then(
            res => { return res.data.results }
        )
    }

    const handleScroll = () => {
        let screenBottomPosition = window.pageYOffset + window.innerHeight
        let elementPosition = upcomingRef.current.offsetTop
        if (screenBottomPosition - elementPosition > -700) { // load if screen position to the element is less than 700px 
            window.removeEventListener('scroll', handleScroll);
            getMovies().then(data => {
                setUpcoming(data)
            })
        }
    }

    useEffect(() => { // wait for a user to scroll to send the request
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    if(upcoming === null || upcoming.length === 0){
        return <div ref={upcomingRef} className='upcoming'></div>
    } else {
        return (
            <div ref={upcomingRef} className='upcoming'>
                <h2 className='header header--medium'>COMING SOON</h2>
                    <div className='upcoming__movies'>
                        {upcoming.map(movie => {
                            return <Movie key={movie.id} movie={movie} />
                        })}
                    </div>
            </div>
        )
}}

export default Upcoming
