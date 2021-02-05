import React, {useEffect, useState, useContext} from 'react'
import {Switch, Route} from 'react-router-dom'

import { UserContext, MembershipContext, DetailsContext } from 'utilities/contexts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Tickets from './tickets/tickets.jsx'
import AccountManager from './accountManager/accountManager.jsx'
import Membership from './membership/membership.jsx'
import MainPage from './mainPage.jsx'

const Account = () => {

    const userLoggedContext = useContext(UserContext)
    const userMembershipContext = useContext(MembershipContext)
    const userDetailsContext = useContext(DetailsContext)

    const [user, setUser] = useState('awaitingResponse')


    useEffect(() => {
        if(userLoggedContext === true) {
            setUser({
                logged: userLoggedContext,
                membership: userMembershipContext.membership,
                membership_type: userMembershipContext.type,
                user_details: userDetailsContext
            })
        } else if (userLoggedContext === false) {
            window.location.href = `/login?next=/account&login_required=true`
        }

        
    }, [userLoggedContext])

    return (
        <div className='account'>
            {user === 'awaitingResponse' ? 
                <LoadingGif />
            :
            <Switch>
                <Route path='/account/tickets' component={Tickets} />
                <Route path='/account/account-manager' render={() => <AccountManager details={user.user_details} />} />
                <Route path='/account/membership' component={Membership} />
                <Route exact path='/account' component={MainPage} />
            </Switch>
        }
        </div>
    )
}

export default Account