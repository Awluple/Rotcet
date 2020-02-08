import React from 'react'
import Nav from './nav.jsx'

const Top = () => {
    return (
        <div className='top'>
            <div className='logo'>
                <img src="/static/images/logo.png" alt="Logo"/>
            </div>
            <Nav />
        </div>
    )
}

export default Top;