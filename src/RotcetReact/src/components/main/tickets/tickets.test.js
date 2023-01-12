import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import sinon from 'sinon'
import { createMemoryRouter, RouterProvider, Link } from 'react-router-dom'

import LoadingGif from 'media/gifs/loading.jsx'

import Tickets from './tickets.jsx'
import Header from './header.jsx'
import Seats from './seats.jsx'
import TicketsType from './ticketsType.jsx'
import TypeSelection from './typeSelection.jsx'

import SeatsManager from './mobileManager/seatsManager.jsx'
import SeatDeletePanelMobile from './mobileManager/seatDeletePanelMobile.jsx'
import SeatsSelectMobile from './mobileManager/seatsSelectMobile.jsx'

configure({ adapter: new Adapter() });

const screening = {
    "id": 39,
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
    "logged": true,
    "defaultType": 1,
    "membership": true,
    "type": 1
}

describe('Tickets tests', () => {
    describe('Header component', () => {
        before(() => {
            global.wrapper = mount(<Header date={screening.date} name={screening.name} in3D={screening.in_3D} />)
        })
        it('renders name', () => {
            assert.equal(wrapper.find('h1').text(), screening.name)
        })
        it('renders proper date format', () => {
            assert.equal(wrapper.find('p').first().text(), '17.09.2020')
            assert.equal(wrapper.find('p').last().text(), '17:00')
        })
        it('renders 3D information', () => {
            assert.equal(wrapper.find('h4').text(), '3D')
        })
    })
    describe('Tickets component', () => {
        before(() => {
            window.HTMLCanvasElement.prototype.getContext = function(){
                return (
                    {clearRect: function(){},
                    beginPath: function(){},
                    fillRect: function(){},
                    fillText: function(){},
                    save: function(){},
                    strokeRect: function(){},
                    rotate: function(){},
                    restore: function(){},
                    moveTo: function(){},
                    lineTo: function(){},
                    fill: function(){}}
                )
            }

            const router1 = createMemoryRouter(
                [
                  {
                    path: '/tickets/:screeningId',
                    element: <Tickets screening={screening} membership={session} />
                  }
                ],
                {
                  initialEntries: ['/tickets/1?error=occupied&occupied=1,2'],
                }
              )
            
            const router2 = createMemoryRouter(
                [
                  {
                    path: '/tickets/:screeningId',
                    element: <Tickets screening={null} membership={session} />
                  }
                ],
                {
                  initialEntries: ['/tickets/1?error=occupied&occupied=1,2'],
                }
              )
            global.wrapper = mount(<RouterProvider router={router1} />)
            global.wrapper2 = mount(<RouterProvider router={router2} />)
        })
        after(() => {
            wrapper.unmount()
        })
        it('shows loading gif', () => {
            assert.lengthOf(wrapper2.find(LoadingGif), 1)
        })
        it('renders child components', () => {
            assert.lengthOf(wrapper.find(Header), 1)
            assert.lengthOf(wrapper.find(Seats), 1)
            assert.lengthOf(wrapper.find(TicketsType), 1)
            
        })
        it('sets link', () => {
            wrapper.find(Seats).props().setChosenSeats([1, 2])
            wrapper.find(TicketsType).props().setTickets([{type: 0, seat: 1}], [{type: 2, seat: 2}])
            wrapper.update()
            assert.equal(wrapper.find(Link).props().to, '/tickets/1/order?&ticket=2,2')
        })
        it('does not pass to many membership tickets', () => {
            wrapper.find(Seats).props().setChosenSeats([1, 2, 3])
            wrapper.find(TicketsType).props().setTickets([{type: 2, seat: 1}, {type: 2, seat: 2}, {type: 2, seat: 3}])
            wrapper.update()
            assert.equal(wrapper.find('h3').text(), 'Please select a seat first')
        })
        it('handles errors', () => {
            assert.deepEqual(wrapper.find(Seats).props().error, {name: 'occupied', occupied: '1,2'})
        })
    })
    describe('Seats component', () => {
        before(() => {
            global.clearRectSpy = sinon.spy();
            window.HTMLCanvasElement.prototype.getContext = function(){
                return (
                    {clearRect: clearRectSpy,
                    beginPath: function(){},
                    fillRect: function(){},
                    fillText: function(){},
                    save: function(){},
                    strokeRect: function(){},
                    rotate: function(){},
                    restore: function(){},
                    moveTo: function(){},
                    lineTo: function(){},
                    fill: function(){}}
                )
            }
            global.wrapper = mount(<Seats error={{name: 'occupied', occupied: [1,2]}} occupied={[1,2]} chosenSeats={[3,4]} setChosenSeats={function(){}} />)
        })
        it('renders canvas', () => {
            assert.lengthOf(wrapper.find('canvas'), 1)
        })
        it('clears canvas on chosenSeats change', () => {
            wrapper.setProps({ chosenSeats: [3,4,5] });
            assert.isTrue(clearRectSpy.calledTwice)
        })
        it('shows error', () => {
            assert.equal(wrapper.find('p').first().text(), 'You have selected seat which is already occupied: 1,2')
        })
    })
    describe('TicketsType component', () => {
        before(() => {
            global.wrapper = shallow(<TicketsType chosenSeats={[3,4]} member={session.membership} memberTicketsChosen={0}
                membershipDefault={1} membershipType={session.type} setTickets={function(){}} tickets={[]} />)
        })
        it('shows tickets price', () => {
            assert.lengthOf(wrapper.find('.tickets__description'), 1)
        })
        it('shows tcikets type selection', () => {
            assert.lengthOf(wrapper.find(TypeSelection), 2)
        })
        it('hides membership info for member', () => {
            assert.lengthOf(wrapper.find('.tickets__info--membership'), 0)
        })
    })
    describe('TypeSelection component', () => {
        before(() => {
            global.setTicketsSpy = sinon.spy()
            global.wrapper = mount(<TypeSelection seat={1} index={0} member={true} membershipType={1} 
                memberTicketsChosen={0} setTickets={setTicketsSpy} tickets={[]}/>)

            global.wrapper2 = mount(<TypeSelection seat={2} index={1} member={true} membershipType={1} 
                memberTicketsChosen={1} setTickets={function(){}} tickets={[]}/>)
        })
        it('displays ticket info', () => {
            assert.equal(wrapper.find('p').first().text(), 'Ticket 1')
            assert.equal(wrapper.find('p').last().text(), 'Seat 1')
        })
        it('sets ticket for members', () => {
            assert.isTrue(wrapper.find('input').last().props().checked)
        })
        it('changes checked on click', () => {
            wrapper.find('label').first().simulate('click')
            assert.isTrue(wrapper.find('input').first().props().checked)
        })
        it('sets tickets', () => {
            assert.isTrue(setTicketsSpy.calledThrice)
        })
        it('sets standard ticket if membership tickets already filled', () => {    
            assert.isTrue(wrapper2.find('input').first().props().checked)
        })
        it('blocks membership option for non members', () => {    
            const wrapper3 = mount(<TypeSelection seat={3} index={2} member={false} membershipType={1} 
                memberTicketsChosen={1} setTickets={function(){}} tickets={[]}/>)
            wrapper3.find('label').last().simulate('click')
            assert.isTrue(wrapper2.find('input').first().props().checked)
        })
    })
    describe('SeatsManager component', () => {
        before(() => {
            global.wrapper = shallow(<SeatsManager chosenSeats={[1]} occupied={[]}
                addSeat={function(){}} deleteSeat={function(){}} />)
        })
        it('panels hidden',() => {
            assert.lengthOf(wrapper.find(SeatsSelectMobile), 0)
            assert.lengthOf(wrapper.find(SeatDeletePanelMobile), 0)
        })
        it('opens SeatsSelectMobile',() => {
            wrapper.find('li').last().simulate('click')
            assert.lengthOf(wrapper.find(SeatsSelectMobile), 1)
        })
        it('opens DeletePanelMobile',() => {
            wrapper.find('li').first().simulate('click')
            assert.lengthOf(wrapper.find(SeatDeletePanelMobile), 1)
        })
    })
    describe('SeatsSelectMobile component', () => {
        before(() => {
            global.addSeatSpy = sinon.spy()
            global.setShowSelectionPanelSpy = sinon.spy()
            global.wrapper = shallow(<SeatsSelectMobile chosenSeats={[1]} occupied={[2]}
                addSeat={addSeatSpy} setShowSelectionPanel={setShowSelectionPanelSpy} />)
        })
        it('calls addSeat',() => {
            wrapper.find('input').simulate('change', {target: { value: 44 }})
            wrapper.find('button').simulate('click')
            assert.isTrue(addSeatSpy.calledOnce)
        })
        it('calls setShowSelectionPanel when submit',() => {
            assert.isTrue(setShowSelectionPanelSpy.calledOnce)
        })
        it('calls setShowSelectionPanel when X clicked',() => {
            wrapper.find('.close-button').find('svg').simulate('click')
            assert.isTrue(setShowSelectionPanelSpy.calledTwice)
        })
        it('calls setShowDeletePanel when hidden area clicked',() => {
            wrapper.find('.close').simulate('click')
            assert.isTrue(setShowSelectionPanelSpy.calledThrice)
        })
        it('prevent a seat selection if already chosen',() => {
            wrapper.find('input').simulate('change', {target: { value: 1 }})
            wrapper.find('button').simulate('click')
            assert.isTrue(addSeatSpy.calledOnce)
        })
        it('prevent a seat selection if already occupied',() => {
            wrapper.find('input').simulate('change', {target: { value: 2 }})
            wrapper.find('button').simulate('click')
            assert.isTrue(addSeatSpy.calledOnce)
        })
        it('shows avaliable SVG',() => {
            assert.lengthOf(wrapper.find('.unavailable'), 1)
        })
        it('shows not avaliable SVG',() => {
            wrapper.find('input').simulate('change', {target: { value: 44 }})
            assert.lengthOf(wrapper.find('.available'), 1)
        })
    })
    describe('SeatDeletePanelMobile component', () => {
        before(() => {
            global.deleteSeatSpy = sinon.spy()
            global.setShowDeletePanelSpy = sinon.spy()
            global.wrapper = shallow(<SeatDeletePanelMobile seat={3} deleteSeat={deleteSeatSpy} setShowDeletePanel={setShowDeletePanelSpy}/>)
        })
        it('calls setShowDeletePanel when X clicked',() => {
            wrapper.find('.close-button').find('svg').simulate('click')
            assert.isTrue(setShowDeletePanelSpy.calledOnce)
        })
        it('calls setShowDeletePanel when hidden area clicked',() => {
            wrapper.find('.close').simulate('click')
            assert.isTrue(setShowDeletePanelSpy.calledTwice)
        })
        it('calls deleteSeat and setShowDeletePanel',() => {
            wrapper.find('button').first().simulate('click')
            assert.isTrue(deleteSeatSpy.calledOnce)
            assert.isTrue(setShowDeletePanelSpy.calledThrice)
        })
        it('calls setShowDeletePanel when NO clicked',() => {
            wrapper.find('button').last().simulate('click')
            assert.isTrue(deleteSeatSpy.calledOnce)
            assert.equal(setShowDeletePanelSpy.callCount, 4)
        })
    })
})