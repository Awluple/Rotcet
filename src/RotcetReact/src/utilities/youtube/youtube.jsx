import React, {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'

const Youtube = (props) => {
    const youtubePlayer = useRef(null)

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
                'onReady': props.onPlayerReady,
                'onStateChange': playerStateChange

              }
         })
    }

    useEffect(() => {
        window.YoutubeApi.registerIframe(loadIframe)
    }, [])
    return (
        <div>
            <div ref={youtubePlayer}></div>
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
