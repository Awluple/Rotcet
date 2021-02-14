import React from 'react';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import { MemoryRouter, Route } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { UserContext, MembershipContext, DetailsContext } from 'utilities/contexts.js'


import TicketsManager from './ticketsManager.jsx'

const screening = {
    "id": 1,
    "name": "Test Screening",
    "type": "MV",
    "room": 1,
    "url": "http://192.168.88.48:8000/api/screenings/39/",
    "image": "http://192.168.88.48:8000/media/movies/The%20Movie/2020-04-27/main_image/thumbnail_img2_vtNB7gi.jpg",
    "show_id": 4,
    "date": "2020-09-17T16:00:00Z",
    "member_tickets_left": 1,
    "occupied_seats": [
        9,
        10,
        20
    ],
    "in_3D": true,
    "show": 1
}

const session = {
    logged: true,
    membership: true,
    membership_type: 1,
}

configure({ adapter: new Adapter() });

describe('Main directory tests', () => {
    describe('Tickets manager', () => {
        before(() => {
            const mock = new MockAdapter(axios)
            mock.onGet('/api/screenings/1').reply(200, screening)
            global.getSpy = sinon.spy(axios, 'get')

            global.wrapper = mount(
                <UserContext.Provider value={true}>
                    <MembershipContext.Provider value={{membership: false, type: 0, defaultType: 0}}>
                        <DetailsContext.Provider value={{name: '', surname: '', address: '', postcode: ''}}>
                            <MemoryRouter initialEntries={['/tickets/1/']}>
                                <Route path='/tickets/:screeningId' render={() => <TicketsManager />} />
                            </MemoryRouter>
                        </DetailsContext.Provider> 
                    </MembershipContext.Provider>
                </UserContext.Provider>
            )
        })
        it('gets user and screening', () => {
            assert.isTrue(getSpy.calledOnce)
        });
    });
});