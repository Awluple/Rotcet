import "regenerator-runtime/runtime";
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {useScreenWidth} from 'utilities/hooks/hooks.js'
import YouTube from 'utilities/youtube/youtube.jsx'
import {youtubeButton} from 'media/svgs/svgs.js'

const Movie = props => {
    
    const [iframeClicked, setiframeClicked] = useState(false)
    const [videoClicked, setVideoClicked] = useState(false)

    const smallDevice = useScreenWidth(1024)

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

    const onPlayerReady = event => {
        event.target.playVideo()
    }
    return (
        <div className={'highlight_movie' + ((props.movie.main_trailer === null) ? ' highlight_movie--no_trailer' : '') + ((props.index === 1) ? ' highlight_movie--left' : '') }>
            {   smallDevice && 
                <Link to={`/movie/${props.movie.slug}-MV-${props.movie.id}`}><h3>{props.movie.name}</h3></Link>
            }
            <div className={'movie__graphic' + ((iframeClicked && props.movie.main_trailer) ? ' movie__graphic--remove-border-radius' : '')
                 + (props.movie.main_trailer ? ' movie__graphic--has_trailer' : '')}>
                {props.movie.main_trailer ?
                    !videoClicked ? 
                    <div onClick={() => {setVideoClicked(true)}} className='movie__trailer_thumbnail'>
                        {youtubeButton}
                        <img src={props.movie.trailer_thumbnail} alt="trailer"/>
                    </div>
                    :
                    <YouTube key={props.movie.main_trailer} videoId={props.movie.main_trailer}
                    onPlay={setBorder}
                    onPlayerReady={onPlayerReady}
                    />
                :
                    <Link to={`/movie/${props.movie.slug}-MV-${props.movie.id}`}>
                        <img className='movie__graphic--no_trailer_image' src={props.movie.thumbnail} alt="movie main image thumbnail"/>
                    </Link>
                }
            </div>
            <div className='movie__description'>
                <div className='movie__info'>
                    { !smallDevice && 
                    <Link to={`/movie/${props.movie.slug}-MV-${props.movie.id}`}><h3>{props.movie.name}</h3></Link>
                    }
                    <p>{props.movie.short_description}</p>
                </div>
                { props.movie.screenings.length !== 0 ? 
                    <Link className='button shadow-tiny' to={`/movie/${props.movie.slug}-MV-${props.movie.id}#tickets`}>Tickets</Link>
                :
                    <Link className='button shadow-tiny' to={`/movie/${props.movie.slug}-MV-${props.movie.id}`}>See details</Link>
                }
            </div>
        </div>
    )
}

Movie.propTypes = {
    movie: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default Movie
