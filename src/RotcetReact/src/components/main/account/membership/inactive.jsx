import React from 'react'
import {Link} from 'react-router-dom'

const Inactive = () => {
    return (
        <div className='membership__inactive shadow-tiny'>
            <h2>Mebership status: Inactive</h2>
            <p>Membership is a perfect option if you visit us often!
            One -50% ticket for each screening only 6.99£ per month!</p>
            <p>Or if you enjoy watching movies with someone select
            Tier 2 membership for 10.49£ to have two membership tickets avaliable for each screening</p>
            <Link className='button shadow-tiny' to='#'>Select plan!</Link>
        </div>
    )
}

export default Inactive
