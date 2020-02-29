import React from 'react';
import ReactDOM from 'react-dom';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import Movie from './movie.jsx'
import Screening from './screenings.jsx'

configure({ adapter: new Adapter() });


const movie = {
    'name': 'Test',
    'thumbnail': '/test.img',
    'has_3D': true,
    'screenings': ['2200-02-26T12:09:43Z']
}

describe('Shedule movie component tests', () => {
    beforeEach(() => {
        global.wrapper = mount(<Movie movie={movie}/>)
    })
    it('renders name', () => {
        assert.equal(global.wrapper.find('h3').contains('Test'), true)
    })
    it('renders thumbnail', () => {
        assert.equal(global.wrapper.find('img').prop('src'), '/test.img')
    })
    it('renders good 2D/3D information with 3D', () => {
        assert.equal(global.wrapper.find('p').contains('2D/3D'), true)
    })
    it('renders good 2D/3D information with 2D only', () => {
        movie['has_3D'] = false
        const wrapper = mount(<Movie movie={movie}/>)
        assert.equal(wrapper.find('p').contains('2D'), true)
    })
    it('renders screening informations with 1 day', () => {
        assert.lengthOf(wrapper.find(Screening), 1)
    })
    it('renders screening informations with 2 days', () => {
        movie['screenings'] = ['2200-02-26T12:09:43Z', '2200-02-27T12:09:43Z']
        const wrapper = mount(<Movie movie={movie}/>)
        assert.lengthOf(wrapper.find(Screening), 2)
    })
});