import React, {useEffect, useState, useContext} from 'react'
import {Routes, Route} from 'react-router-dom'

import { UserContext, MembershipContext, DetailsContext } from 'utilities/contexts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Tickets from './tickets/tickets.jsx'
import AccountManager from './accountManager/accountManager.jsx'
import PassowrdReset from './accountManager/passwordReset.jsx'
import Membership from './membership/membership.jsx'
import MainPage from './mainPage.jsx'

const Account = () => {

    const userLoggedContext = useContext(UserContext)
    const userMembershipContext = useContext(MembershipContext)
    const userDetailsContext = useContext(DetailsContext)

    const [user, setUser] = useState('awaitingResponse')


    useEffect(() => {
        document.title = `Your account`
        if(userLoggedContext === true) {
            setUser({
                logged: userLoggedContext,
                membership: userMembershipContext.membership,
                membership_type: userMembershipContext.type,
                user_details: userDetailsContext
            })
        } else if (userLoggedContext === false) {
            window.location.href = (`/login?next=/account&login_required=true`);
        }
        
    }, [userLoggedContext])


    return (
        <div className='account'>
            {user === 'awaitingResponse' ? 
                <LoadingGif />
            :
            <Routes>
                <Route >
                    <Route index element={<MainPage />} />
                    <Route path='tickets/*' element={<Tickets />} />
                    <Route path='account-manager' element={<AccountManager details={user.user_details} />} />
                    <Route path='account-manager/password-reset' element={<PassowrdReset />} />
                    <Route path='membership' element={<Membership membership={user.membership} />} />
                </Route>
            </Routes>
        }
        </div>
    )
}

export default Account