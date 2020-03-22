import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import YouTube from 'react-youtube';

const Movie = props => {
    
    const [iframeClicked, setiframeClicked] = useState(false)


    let style

    if(iframeClicked){
        style = {
            borderRadius: '0px'
        }
    }

    const opts = {
        width: '750px',
        height: '422px'
    }

    const setBorder = () => {
        setiframeClicked(!iframeClicked)
    }

    return (
        <div className={'highlight_movie' + ((props.movie.main_trailer === null) ? ' highlight_movie--no_trailer' : '') + ((props.index === 1) ? ' highlight_movie--left' : '') }>
            <div className={'movie__graphic' + ((iframeClicked && props.movie.main_trailer) ? ' movie__graphic--remove-border-radius' : '')}>
                {props.movie.main_trailer ? 
                    <YouTube videoId={props.movie.main_trailer} opts={opts} 
                    onPlay={setBorder}
                    onPause={setBorder}
                    onEnd={setBorder}
                    />
                :
                   <img src={props.movie.thumbnail} alt="movie main image"/>
                }
            </div>
            <div className='movie__description'>
                <div className='movie__info'>
                    <h3>{props.movie.name}</h3>
                    <p>{props.movie.short_description}</p>
                </div>
                <Link className='shadow-small' to='' >Tickets</Link>
            </div>
        </div>
    )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default Movie
