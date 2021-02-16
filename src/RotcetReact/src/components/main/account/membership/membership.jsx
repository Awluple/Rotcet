import React from 'react'
import PropTypes from 'prop-types'

import {Link} from 'react-router-dom'

import Active from './active.jsx'
import Inactive from './inactive.jsx'


const Membership = props => {

    return (
        <div className='account__membership'>
            <div className='account__navigation shadow-tiny'>
                <Link to='/account'>My account</Link><Link to='#'>/Membership</Link>
            </div>
            <h1>Membership</h1>
                {props.membership ?
                    <Active />
                :
                    <Inactive />
                }
        </div>
    )
}

Membership.propTypes = {
    membership: PropTypes.bool
}

export default Membership
