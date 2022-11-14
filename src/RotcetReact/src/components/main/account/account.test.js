import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { MemoryRouter, Link, Route, Routes, createMemoryRouter, RouterProvider } from 'react-router-dom'

import { UserContext } from 'utilities/contexts.js'
import LoadingGif from 'media/gifs/loading.jsx'

import Account from './account.jsx'

import Tickets from './tickets/tickets.jsx'
import TicketDetails from './tickets/ticketDetails.jsx'
import TicketsList from './tickets/ticketsList.jsx'

import Membership from './membership/membership.jsx'
import Active from './membership/active.jsx'
import AccountManager from './accountManager/accountManager.jsx';

configure({ adapter: new Adapter() });

describe('Account tests', () => {
    describe('Account component', () => {
        before(() => {
            Object.defineProperty(window, 'location', {
                value: {
                  href: ''
                }
              });

              global.router = createMemoryRouter(
                [
                  {
                    path: '/account/tickets/:screeningID',
                    element: 
                        <TicketDetails screenings={[{id: 1, outdated: false}]} tickets={
                            {1: [{
                                id: 1,
                                seat: 1,
                                type: 0,
                                screening_details: {
                                    name: 'Test',
                                    date: '2200-01-01T12:00:00Z'
                                }
                            }]}
                        } />
                  }
                ],
                {
                  // Set for where you want to start in the routes. Remember, KISS (Keep it simple, stupid) the routes.
                  initialEntries: ['/account/tickets/1'],
                  // We don't need to explicitly set this, but it's nice to have.
                  initialIndex: 0,
                }
              )
        })
        it('waits for user context', () => {
            const wrapper = mount(<MemoryRouter><Account /></MemoryRouter>, {
                wrappingComponent: UserContext.Provider,
                wrappingComponentProps: {
                  value: 'awaitingResponse',
                },})

            assert.lengthOf(wrapper.find(LoadingGif), 1)
        });
        it('blocks unauthorised users', () => {
            const wrapper = mount(<MemoryRouter><Account /></MemoryRouter>, {
                wrappingComponent: UserContext.Provider,
                wrappingComponentProps: {
                  value: false,
                },})

            assert.equal('/login?next=/account&login_required=true', window.location.href)
        });
        it('renders Routes', () => {
            const wrapper = mount(<MemoryRouter><Account /></MemoryRouter>, {
                wrappingComponent: UserContext.Provider,
                wrappingComponentProps: {
                  value: true,
                },})

            assert.lengthOf(wrapper.find(Routes), 1)
        });
    });

    describe('Ticket components', () => {
        describe('Ticket', () => {
            before(() => {
                const mock = new MockAdapter(axios)
                mock.onGet('/api/tickets').reply(200, 
                    [{
                        screening: 1,
                        screening_details: {
                            date: '2200-01-01T12:00:00Z'
                        }
                    }]
                )
                global.wrapper = mount(<MemoryRouter><Tickets /></MemoryRouter>)
            })
            it('waits for screenings', () => {
                assert.lengthOf(wrapper.find(LoadingGif), 1)
            })
            it('shows Routes when tickets state in not null', () => {
                wrapper.update()
                assert.lengthOf(wrapper.find(Routes), 1)
            })
        })
        
        describe('TicketsList', () => {
            before(() => {
                global.wrapper = shallow(<TicketsList screenings={[{id: 1, outdated: false}]} tickets={
                    {1: [{
                        id: 1,
                        screening_details: {
                            name: 'Test',
                            date: '2200-01-01T12:00:00Z'
                        }
                    }]}
                } />)
            })
            it('displays correct info', () => {
                assert.equal(wrapper.find('.user_tickets__ticket_details').find('p').at(0).text(), '12:00')
                assert.equal(wrapper.find('.user_tickets__ticket_details').find('p').at(1).text(), '01.01.2200')
                assert.equal(wrapper.find('.user_tickets__ticket_screening_name').text(), 'Test')
                assert.equal(wrapper.find('.user_tickets__ticket_amount').text(), 'x1')
                assert.equal(wrapper.find('li').find(Link).props().to, '/account/tickets/1')
            })
        })
        describe('TicketDetails', () => {
            before(() => {
                global.wrapper = mount(<RouterProvider router={router} />)
            })
            it('displays correct info', () => {
                assert.equal(wrapper.find('.ticket__show').find('p').at(0).text(), 'Test')
                assert.equal(wrapper.find('.ticket__show').find('p').at(1).text(), 'Time: 12:00')
                assert.equal(wrapper.find('.ticket__show').find('p').at(2).text(), 'Date: 01.01.2200')
                assert.equal(wrapper.find('li').text(), '1. Seat 1 - Standard')
            })
        })

        describe('Membership', () => {
            const mock = new MockAdapter(axios)
            mock.onGet('/api/membership').reply(200, {
                "id": 1,
                "type": 2,
                "is_active": true,
                "is_continued": true,
                "next_payment": "2200-01-01",
                "user": 1
            })
            global.wrapper = mount(<MemoryRouter><Membership membership={true}/></MemoryRouter>)
        })
            it('displays correct component', () => {
                assert.lengthOf(wrapper.find(Active), 1)
            })
        })

        describe('Active', () => {
            before(() => {
                const mock = new MockAdapter(axios)
                mock.onGet('/api/membership').reply(200, 
                    {
                        "id": 1,
                        "type": 2,
                        "is_active": true,
                        "is_continued": true,
                        "next_payment": "2200-01-01",
                        "user": 1
                    }
                )
                global.wrapper = mount(<Active membership={true}/>)
            })
        it('displays loading gif', () => {
            assert.lengthOf(wrapper.find(LoadingGif), 1)
        })
        it('displays correct info', () => {
            wrapper.update()
            assert.equal(wrapper.find('p').at(0).text(), 'Membership status: Double')
            assert.equal(wrapper.find('p').at(1).text(), 'Renewal: Yes')
            assert.equal(wrapper.find('p').at(2).text(), 'Next payment: 01.01.2200')
        })
    })

    describe('AccountManager', () => {
        before(() => {
            global.postSpy = sinon.spy(axios, 'post')
            const mock = new MockAdapter(axios)
            mock.onPost('/api/update-details').reply(() => {
                return [201, {status: 201, data: {}}]
            })

            global.wrapper = mount(<MemoryRouter><AccountManager details={{
                name: 'Test',
                surname: '',
                address: '',
                postcode: ''
            }}/></MemoryRouter>)
        })
    it('displays values from props', () => {
        assert.equal(wrapper.find('input').at(0).props().value, 'Test')
    })
    it('changes values', () => {
        wrapper.find('input').at(0).simulate('change', { target: {value: 'Test test' }})
        assert.equal(wrapper.find('input').at(0).props().value, 'Test test')
    })
    it('has blocked button when empty value exists', () => {
        assert.lengthOf(wrapper.find('.inactive'), 1)
    })
    it('blocks post request', () => {
        wrapper.find('.inactive').simulate('click')
        assert.isFalse(postSpy.called)
    })
    it('unlocks button when all inputs filled', () => {
        wrapper.find('input').at(1).simulate('change', { target: {value: 'Test' }})
        wrapper.find('input').at(2).simulate('change', { target: {value: 'Test' }})
        wrapper.find('input').at(3).simulate('change', { target: {value: 'Test' }})
        assert.lengthOf(wrapper.find('.inactive'), 0)
    })
    it('unlocks post request', () => {
        wrapper.find('button').at(0).simulate('click')
        assert.isTrue(postSpy.calledOnce)
    })
})
});