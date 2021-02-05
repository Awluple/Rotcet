import React, { useState } from 'react'
import PropTypes from 'prop-types'

const UserDetails = props => {

    return (
        <div className='user_details'>
            <h3>Your details</h3>
            <label>Name:</label>
            <input onChange={(e) => {props.updateDetails('name', e.target.value)}}
                value={props.userDetails.name} type="text"/>
            
            <label>Surname:</label>
            <input onChange={(e) => {props.updateDetails('surname', e.target.value)}}
                value={props.userDetails.surname} type="text"/>
            
            <label>Address:</label>
            <input onChange={(e) => {props.updateDetails('address', e.target.value)}}
                value={props.userDetails.address} type="text"/>
            
            <label>Postcode:</label>
            <input maxLength='8' onChange={(e) => {props.updateDetails('postcode', e.target.value)}}
                value={props.userDetails.postcode} type="text"/>

        </div>
    )
}

UserDetails.propTypes = {
    userDetails: PropTypes.object.isRequired,
    updateDetails: PropTypes.func.isRequired
}

export default UserDetails
