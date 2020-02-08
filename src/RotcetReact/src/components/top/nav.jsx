import React from 'react'
import {Link} from 'react-router-dom'

const Nav = () => {
    return (
        <div className='nav'>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/programme">programme</Link></li>
                <li><Link to="/membershio">Membership</Link></li>
                <li><Link to="/news">News</Link></li>
            </ul>
        </div>
    )
}

export default Nav;
