import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {useNavigate, Link} from 'react-router-dom'

import LoadingGif from 'media/gifs/loading.jsx'


const AccountManager = props => {

    const [blockSave, setBlockSave] = useState(false)
    const [awaitingResponse, setAwaitingResponse] = useState(false)
    const [notification, setNotification] = useState(null)

    const navigate = useNavigate()

    const [userDetails, setUserDetails] = useState({
        name: '',
        surname: '',
        address: '',
        postcode: ''
    })

    const updateDetails = (detail, value) => {
        setNotification(null)
        let new_values = {...userDetails,
            [detail]: value
        }
        setUserDetails(new_values)
        new_values = Object.values(new_values).map(value => {return value.trim()}) // check for strings with only whitespaces
        if(new_values.includes('')) {
            setBlockSave(true)
        } else {
            setBlockSave(false)
        }
    }

    const postDetails = () => {
        if(blockSave) {
            return
        }

        setAwaitingResponse(true)
        setBlockSave(true)

        axios.post('/api/update-details', {details: userDetails})
        .then(res => {
            if(res.status === 201) {
                setNotification('ok')
                setAwaitingResponse(false)
            }
        }).catch(error => {
            setNotification('error')
            setAwaitingResponse(false)
            console.error(error)
        })
    }

    const passwordChange = () => {
        navigate('/account/account-manager/password-reset')
    }

    useEffect(() => {
        if(props.details !== null) {
            setUserDetails(props.details)
        }
    }, [])

    return (
        <div className='account__manager'>
            
            <div className='side_navigation shadow-tiny'>
                <Link to='/account'>My account</Link><Link to='#'>/Account managment</Link>
            </div>

            <h1>Account managment</h1>

            <div className='user_details__info'>
                { awaitingResponse && 
                    <LoadingGif />
                }
                {
                    notification === 'ok' ?
                    <p>Details updated successfully</p> : notification === 'error'
                    ? <p>An error accured during details update process</p> : ''   
                 }
            </div>

            <div className='user_details'>
                <h3>Your details</h3>

                <label>Name:</label>
                <input onChange={(e) => {updateDetails('name', e.target.value)}}
                    value={userDetails.name} type="text"/>

                <label>Surname:</label>
                <input onChange={(e) => {updateDetails('surname', e.target.value)}}
                    value={userDetails.surname} type="text"/>

                <label>Address:</label>
                <input onChange={(e) => {updateDetails('address', e.target.value)}}
                    value={userDetails.address} type="text"/>

                <label>Postcode:</label>
                <input className='user_details__postcode' maxLength='8' onChange={(e) => {updateDetails('postcode', e.target.value)}}
                    value={userDetails.postcode} type="text"/>

                <button className={(blockSave ? 'button inactive' : 'button') + ' shadow-tiny'} onClick={postDetails}>Save</button>
            </div>


            <div className='user_details__password'>
                <button className='button shadow-tiny' onClick={passwordChange}>Request password reset</button>
            </div>


        </div>
    )
}

AccountManager.propTypes = {
    details: PropTypes.object
}

export default AccountManager
