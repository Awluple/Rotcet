import React from 'react'

import {Link} from 'react-router-dom'

const MainPage = () => {
    return (
        <div className='account__main_page'>
            <div className='side_navigation shadow-tiny'>
                <Link to='#'>My account</Link>
            </div>
            <h1>My account</h1>
            <div className='account__links'>
                <Link to='/account/tickets'>Tickets</Link>
                <Link to='/account/account-manager'>Account</Link>
                <Link to='/account/membership'>Membership</Link>
            </div>
        </div>
    )
}

export default MainPage
