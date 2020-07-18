import React from 'react'
import PropTypes from 'prop-types'

const Details = props => {
    return (
        <div className='movie__details'>
            <img src={props.image} alt="main image"/>
            <div className='movie__description'>
                <h1>{props.name}</h1>
                <p>{props.description ? props.description : props.shortDescription}</p>

                <div className='description__tickets'>
                    {props.tickets ? 
                        <React.Fragment>
                            <h3>On screen!</h3>
                            <button>Tickets and shedule</button>
                        </React.Fragment>
                    : 
                        null
                    }
                </div>
            </div>
        </div>
    )
}

Details.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    shortDescription: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    tickets: PropTypes.string
}

export default Details
