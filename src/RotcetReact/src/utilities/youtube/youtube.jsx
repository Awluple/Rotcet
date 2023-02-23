import React, {useEffect, useState, useRef} from 'react'
import ReactDOM from "react-dom"
import PropTypes from 'prop-types'

import LoadingGif from 'media/gifs/loading.jsx'

const Youtube = (props) => {
    const youtubePlayer = useRef(null)

    const [loaded, setLoaded] = useState(false)

    let player = null

    const playerStateChange = () => {
        switch (player.getPlayerState()) {
            case 0:
                if(props.onEnd){
                    props.onEnd()
                }
                break;
            case 1:
                if(props.onPlay){
                    props.onPlay()
                }

                break;
            case 2:
                if(props.onPause){
                    props.onPause()             
                }

                break;
            case 3:
                if(props.onBuffer){
                    props.onBuffer()
                }
                break;
        }
    }

    const onReady = (event) => {
        props.onPlayerReady(event)
        setLoaded(true)
    }

    const loadIframe = () => {
        const playerInfo = {
            id: youtubePlayer.current,
            height: props.height ? props.height : '340',
            width: props.width ? props.width : '640',
            videoId: props.videoId,
        }
        player = new YT.Player(playerInfo.id, {
            height: playerInfo.height,
            width: playerInfo.width,
            videoId: playerInfo.videoId,
            events: {
                'onReady': onReady,
                'onStateChange': playerStateChange

              }
         })
    }

    useEffect(() => {
        window.YoutubeApi.registerIframe(loadIframe)
    }, [])

    return (
        <div className='youtube-video'>
            <div ref={youtubePlayer}>
            </div>
            { !loaded &&
                <LoadingGif />
            }
        </div>
    )
}

Youtube.propTypes = {
    onEnd: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onBuffer: PropTypes.func,
    onPlayerReady: PropTypes.func,
    videoId: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.number
}

export default Youtube
