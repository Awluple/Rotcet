import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
    return (
        <div className='footer'>
            <ul>
                <li><Link to=''>FAQs</Link></li>
                <li><Link to=''>Privacy policy</Link></li>
                <li><Link to=''>Careers</Link></li>
            </ul>
            <ul>
                <li><Link to=''>Cookies Policy</Link></li>
                <li><Link to=''>Contact Us</Link></li>
                <li><Link to=''>Private Hire</Link></li>
            </ul>
            <ul>
                <li><Link to=''>Terms and Conditions</Link></li>
                <li><Link to='/'><img src="/static/images/logo.png" alt="logo"/></Link></li>
            </ul>
        </div>
    )
}

export default Footer