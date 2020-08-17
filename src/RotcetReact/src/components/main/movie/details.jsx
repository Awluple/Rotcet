import React from 'react'
import PropTypes from 'prop-types'

import {useScreenWidth} from 'utilities/hooks/hooks.js'

const Details = props => {
    const smallDevice = useScreenWidth(700)
    return (
        <div className='movie__details'>
            {smallDevice && <h1>{props.name}</h1>}
            <img src={props.image} alt="main image"/>
            <div className='movie__description'>
                <div className='description__info'>
                    {!smallDevice && <h1>{props.name}</h1>}
                    {props.description ? 
                        <p className='description description--long'>{props.description}</p>  : 
                        <p className='description description--short'>{props.shortDescription}</p>
                    }
                </div>
                {props.tickets ? 
                    <div className='description__tickets'>
                                <h3>On screen!</h3>
                                <button onClick={props.scrollToTickets} className='button shadow-tiny'>Tickets and shedule</button>
                    </div>
                : 
                    null
                }
            </div>
        </div>
    )
}

Details.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    tickets: PropTypes.string,
    scrollToTickets: PropTypes.func.isRequired
}

export default Details
