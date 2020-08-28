import React from 'react';
import { MemoryRouter, NavLink } from 'react-router-dom'
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import { UserContext } from 'utilities/contexts.js'
import Nav from './nav'

configure({ adapter: new Adapter() });

describe('Top components tests', () => {
    describe('Nav tests', () => {
        before(() => {
            global.wrapper = mount(<MemoryRouter>
                <UserContext.Provider value={true}>
                    <Nav />
                </UserContext.Provider>
            </MemoryRouter>)
            global.wrapper2 = mount(<MemoryRouter>
                <UserContext.Provider value={false}>
                    <Nav />
                </UserContext.Provider>
            </MemoryRouter>)
        })
        it('changes nav for logged users', () => {
            assert.lengthOf(wrapper.find('.user-menu').find(NavLink), 1)
            assert.lengthOf(wrapper2.find('.user-menu').find(NavLink), 0)
        });
    });
});