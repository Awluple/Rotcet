import React from 'react'

import {Switch, Route} from 'react-router-dom'

import Tickets from './tickets/tickets.jsx'
import AccountManager from './accountManager/accountManager.jsx'
import Membership from './membership/membership.jsx'
import MainPage from './mainPage.jsx'

const Account = () => {
    return (
        <div className='account'>
            <Switch>
                <Route path='/account/tickets' component={Tickets} />
                <Route path='/account/account-manager' component={AccountManager} />
                <Route path='/account/membership' component={Membership} />
                <Route exact path='/account' component={MainPage} />
            </Switch>
        </div>
    )
}

export default Account