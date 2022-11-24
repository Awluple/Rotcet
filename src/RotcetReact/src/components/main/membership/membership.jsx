import React from 'react'
import { Link } from 'react-router-dom'

const Membership = () => {
  return (
    <div className='membership'>
        <div className='membership__header'>
            <img src="/static/images/logo.png" alt="Logo"/>
            <h1>Membership</h1>
        </div>
        <div className='membership__explanation'>
            <h2>What it gives you?</h2>
            <p>Membership is a perfect option if you visit us often!
            Have -50% price reduction on tickets for each screening!</p>
        </div>
        <div className='membership__options'>
            <div>
                <h3>Single</h3>
                <p>Price: 6.99£/month</p>
                <p>Number of membership tickets: 1 for each screening</p>
            </div>
            <div>
                <h3>Double</h3>
                <p>Price: 9.99£/month</p>
                <p>Number of membership tickets: 2 for each screening</p>
            </div>
        </div>
        <Link className='button shadow-small' to="/account/membership">Order on 'My account' page</Link>
    </div>
  )
}

export default Membership