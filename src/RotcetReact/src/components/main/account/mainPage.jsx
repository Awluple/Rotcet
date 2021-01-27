import React from 'react'

import {Link} from 'react-router-dom'

const MainPage = () => {
    return (
        <div className='links'>
            <h1>My account</h1>
            <Link to='/account/tickets'>Tickets</Link>
            <Link to='/account/account'>Accoutn</Link>
            <Link to='/account/membership'>Membership</Link>
        </div>
    )
}

export default MainPage
