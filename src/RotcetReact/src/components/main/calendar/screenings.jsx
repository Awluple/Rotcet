import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import {addZeroForBelowTen} from 'utilities/tools/tools.js'

const Screenings = props => {
    return (
        <div className='calendar__screenings'>
            {
                props.screenings.map(screening => {
                    const date = new Date(screening.date)
                    const hour = addZeroForBelowTen(date.getHours())
                    const minute = addZeroForBelowTen(date.getMinutes())
                    return (
                        <div key={screening.id} className='calendar__screening'>
                            <h4>{`${hour}:${minute}`}</h4>
                            {screening.image ? 
                                <Link className='calendar__screening__img' to=''><img src={screening.image} alt="show image"/></Link>
                            :
                                <Link className='calendar__screening__img' to=''><img src="/static/images/logo.png" alt="logo"/></Link>
                            }
                            <Link className='calendar__screening__name' to=''><h3>{screening.name}</h3></Link>
                        </div>
                    )
                })
            }
        </div>
    )
}

Screenings.propTypes = {
    screenings: PropTypes.array.isRequired,
}

export default Screenings
