import React from 'react'
import {Link} from 'react-router-dom'

const PasswordReset = () => {
    return (
        <div className=''>
            <h1>Password reset request link has been send to your email</h1>
            <Link to='/' className="">Back to the main page</Link>
            <Link to='/account' className="">Go to my account</Link>
        </div>
    )
}

export default PasswordReset
