import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from 'react-router-dom'

import Upcoming from './upcoming.jsx'
import Movie from './movie.jsx'

configure({ adapter: new Adapter() });

const movie = {
    name: 'Test 1',
    thumbnail: '/test/test.jpg'
}

describe('Upcoming components tests', () => {
    describe('Upcoming component', () => {
        before(() => {
            global.wrapper = shallow(<Upcoming />)
        })
        it('renders empty div as default', () => {
            assert.isTrue(wrapper.find('div').exists())
        });
    });
    describe('Movie component', () => {
        before(() => {
            global.wrapper = mount(<MemoryRouter><Movie movie={movie} /></MemoryRouter>)
        })
        it('renders data', () => {
            assert.equal(wrapper.find('p').text(), 'Test 1')
            assert.equal(wrapper.find('img').prop('src'), '/test/test.jpg')
        });
    });
});