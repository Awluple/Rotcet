import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { useHistory } from "react-router-dom";

const Slider = props => {

    const [position, setPosition] = useState(null)
    let history = useHistory();

    const hide = () => {
        if (props.from === 'left'){
            setPosition(-100)
        }else {
            setPosition(100)
        }
        setTimeout(() => {
            document.body.style.overflow = 'auto' // enable scrolling
            props.close(false)
        }, 100);
    }

    useEffect(() => {
        setPosition(0)
        document.body.style.overflow = 'hidden' // disable scrolling
    }, [])

    useEffect(() => {
        // hide slider after path changes
        const unlisten = history.listen((location, action) => {
            if (action === 'PUSH'){
                hide()
            }
        });
        return () => {
            unlisten()
        }
    }, [])

    return (
        <div className={'slider ' + (props.from === 'left' ? 'slider--left' : 'slider--right') } style={{left: position + '%'}}>
            <div className='slider__close'>
                <svg onClick={hide} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/>
                </svg>
            </div>
            {props.children}
        </div>
    )
}

Slider.defaultProps = {
    from: 'left',
}

Slider.propTypes = {
    children: PropTypes.node.isRequired,
    close: PropTypes.func.isRequired,
    from: PropTypes.string,
}

export default Slider
