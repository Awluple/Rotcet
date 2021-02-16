import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import sinon from 'sinon'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import OrderConfirmation from './orderConfirmation.jsx'
import Info from './info.jsx'
import Tickets from './tickets.jsx'
import UserDetails from './userDetails.jsx'

configure({ adapter: new Adapter() });

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

const membership = {
    membership: true,
    type: 1,
    defaultType: 2
}

describe('OrderConfirmation tests', () => {
    describe('OrderConfirmation component', () => {
        before(() => {
            global.clock = sinon.useFakeTimers()
            window.open = function(){}

            const mock = new MockAdapter(axios)
            mock.onPost('/api/tickets-multiple-creation').reply(() => {
                return [201, {status: 201, data: {}}]
            })

            global.wrapper = mount(<MemoryRouter initialEntries={['/tickets/1/order?&ticket=1,0,&ticket=2,0']}>
                <OrderConfirmation updateDetails={function(){}} screening={screening}
                membership={membership} userDetails={{}} reloadData={function(){}} blockPost={false} />
            </MemoryRouter>)
            global.wrapper2 = mount(<MemoryRouter initialEntries={['/tickets/1/order?&ticket=1,0,&ticket=2,0']}>
                <OrderConfirmation updateDetails={function(){}} screening={screening}
                membership={membership} userDetails={{}} reloadData={function(){}} blockPost={true} />
            </MemoryRouter>)
        })
        afterEach(() => {
            sinon.restore()
        });
        it('renders screening info', () => {
            assert.lengthOf(wrapper.find(Info), 1)
        });
        it('calls api', () => {
            const clock = sinon.useFakeTimers()
            const postTicketsSpy = sinon.spy(axios, 'post')
            wrapper.find('button').simulate('click')
            clock.tick(1500)
            assert.isTrue(postTicketsSpy.calledOnce)
        });
        it('shows loading gif', () => {
            assert.equal(wrapper.find('.ticket__header').text(), 'Summary')
        })
        it('blocks post', () => {
            const clock = sinon.useFakeTimers()
            const postTicketsSpy = sinon.spy(axios, 'post')
            wrapper2.find('button').simulate('click')
            clock.tick(1500)
            assert.isFalse(postTicketsSpy.called)
            assert.lengthOf(wrapper2.find('.ticket__disabled'), 1)
        });
    });
    describe('Info component', () => {
        before(() => {
            global.wrapper = shallow(<Info screening={screening} />)
        })
        it('renders correct info', () => {
            assert.equal(wrapper.find('p').at(0).text(), 'Test Screening')
            assert.equal(wrapper.find('p').at(1).text(), 'Time: 17:00')
            assert.equal(wrapper.find('p').at(2).text(), 'Date: 17.09.2020')
        })
    })
    describe('Tickets component', () => {
        before(() => {
            const tickets = [[1,0], [2,1], [3,2]]
            global.wrapper = shallow(<Tickets tickets={tickets} />)
        })
        it('renders correct info', () => {
            assert.equal(wrapper.find('li').at(0).text(), '1. Seat 1 - Standard6£')
            assert.equal(wrapper.find('li').at(1).text(), '2. Seat 2 - Kids/Seniors4£')
            assert.equal(wrapper.find('li').at(2).text(), '3. Seat 3 - Membership3£')
        })
        it('renders correct total', () => {
            assert.equal(wrapper.find('.ticket__total').text(), 'Total: 13£')
        })
    })
    describe('UserDetails component', () => {
        before(() => {
            global.updateDetailsSpy = sinon.spy()
            global.wrapper = shallow(<UserDetails updateDetails={updateDetailsSpy} userDetails={
                {
                    name: 'Test name',
                    surname: 'Test surname',
                    address: 'Test address',
                    postcode: 'Test postcode'
                }
            } />)
        })
        it('sets default value', () => {
            assert.equal(wrapper.find('input').at(0).props().value, 'Test name')
            assert.equal(wrapper.find('input').at(1).props().value, 'Test surname')
            assert.equal(wrapper.find('input').at(2).props().value, 'Test address')
            assert.equal(wrapper.find('input').at(3).props().value, 'Test postcode')
        })
        it('calls updateDetails', () => {
            wrapper.find('input').at(0).simulate('change', {target: {value: 'Test name update'}})
            assert.isTrue(updateDetailsSpy.calledOnce)
        })
    })
});