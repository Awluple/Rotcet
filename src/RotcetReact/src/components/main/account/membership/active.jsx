import React, {useEffect, useState} from 'react'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'

import {toCompactDate} from 'utilities/tools/tools.js'

const Active = () => {

    const [membership, setMembership] = useState(null)

    useEffect(() => {
        axios.get('/api/membership').then(res => {
            setMembership(res.data)
        }).catch(error => {
            console.error(error)
        })
    }, [])

    let payment = 'Not continued'

    if(membership !== null && membership.is_continued) {
        const date = new Date(membership.next_payment)
        payment = toCompactDate(date)
    }

    return (
        <div className='membership__active shadow-tiny'>
            {membership === null ? 
                <LoadingGif />
            :
            <React.Fragment>
                <p>Membership status: {membership.type === 1 ? 'Single' : 'Double'}</p>
                <p>Renewal: {membership.is_continued ? 'Yes' : 'No'}</p>
                <p>Next payment: {payment}</p>
             
        
            { membership.is_continued ? 
                <a className='button shadow-tiny' href='#'>Cancel</a>
            :
                <a className='button shadow-tiny' href='#'>Extend</a>
            }
            </React.Fragment>   
    }
        </div>
    )
}


export default Active
