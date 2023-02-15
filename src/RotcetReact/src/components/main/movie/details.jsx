import React from 'react'
import PropTypes from 'prop-types'

import {toCompactDate} from 'utilities/tools/tools.js'
import {useScreenWidth} from 'utilities/hooks/hooks.js'

const Details = props => {
    const smallDevice = useScreenWidth(700)
    let dayCompact;
    let day;
    if(props.releaseDate !== null) {
        day = new Date(props.releaseDate)
        dayCompact = toCompactDate(day)
    }
    return (
        <div className='movie__details'>
            {smallDevice && <h1>{props.name}</h1>}
            <img src={props.image ? props.image : '/static/images/logo.png'} alt="main image"/>
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
                : props.releaseDate !== null && day > new Date() ? 
                    <h3 className='description__coming'>Coming {dayCompact}</h3>
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
    image: PropTypes.string,
    tickets: PropTypes.string,
    scrollToTickets: PropTypes.func.isRequired,
    releaseDate: PropTypes.string,
}

export default Details
