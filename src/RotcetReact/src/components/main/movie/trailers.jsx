import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import YouTube from 'utilities/youtube/youtube.jsx'
import {youtubeButton} from 'media/svgs/svgs.js'

const Trailers = props => {

    const [primaryTrailer, setPrimaryTrailer] = useState(props.trailers[0])
    const [videoPlay, setVideoPlay] = useState(false)
    const [clickedOnceOrChanged, setClicedOnceOrChanged] = useState(false)

    const changeTrailer = (trailer) => {
        setVideoPlay(false)
        setPrimaryTrailer(trailer)
    }

    const onPlayerReady = event => {
        event.target.playVideo()
    }

    useEffect(() => {
        if(!videoPlay && clickedOnceOrChanged){
            setVideoPlay(true)
        }
    }, [videoPlay, clickedOnceOrChanged])

    const trailers = props.trailers.filter((trailer) => {
        return trailer.id !== primaryTrailer.id
    })

    return (
        <div className='movie__trailers'>
            <h2 className='header header--medium shadow-small'>Watch trailers</h2>
            <div className='movie__primary_trailer'>
                { videoPlay ? 
                    <YouTube videoId={primaryTrailer.trailer}
                    onPlayerReady={onPlayerReady}
                    width={700}
                    height={394}
                    />
                :
                    <div className='youtube-thumbnail' onClick={() => {setVideoPlay(true), setClicedOnceOrChanged(true)}}>
                        <img src={primaryTrailer.trailer_thumbnail} alt="primary trailer"/>
                        {youtubeButton}
                    </div>
            }
            </div>
            <ul className='movie__trailers-list'>
                {trailers.map(trailer => {
                    return <li onClick={() => {changeTrailer(trailer), setClicedOnceOrChanged(true)}} key={trailer.id}>
                                {youtubeButton}
                                <img src={trailer.trailer_thumbnail} alt="trailer"/>
                            </li>
                })}
            </ul>
        </div>
    )
}

Trailers.propTypes = {
    trailers: PropTypes.array
}

export default Trailers
