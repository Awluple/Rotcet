import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'

const Accepted = () => {

    useEffect(() => {
        document.title = 'Payment accepted'
    }, [])
    
    return (
        <div className="ticket">
            <h1 className='ticket__header'>Payment accepted!</h1>
            <p className='ticket__description'>You can now see your tickets in
            <Link to='/account' className='ticket__description--link'> 'My account' </Link>page</p>
            <div className='ticket__options ticket__options--accepted'>
                <Link to='/' className="ticket__back">Back to the main page</Link>
                <Link to='/account/tickets' className="ticket__continue">Go to my tickets</Link>
            </div>
        </div>
    )
}

export default Accepted
