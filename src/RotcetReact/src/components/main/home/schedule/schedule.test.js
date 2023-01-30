import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import 'utilities/mocks/matchMedia.mock';

import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Schedule from './schedule.jsx'
import Show from './show.jsx'
import Screening from './screenings.jsx'


configure({ adapter: new Adapter() });


const movie = {
    'id': 1,
    'name': 'Test',
    'thumbnail': '/test.img',
    'has_3D': true,
    'screenings': [{id: 1, date: '2200-02-26T12:09:43Z'}]
}

const movie2 = {
    'id': 2,
    'name': 'Test2',
    'thumbnail': '/test.img',
    'has_3D': true,
    'screenings': [{id: 2, date: '2200-02-26T12:09:43Z'}]
}
const marathon1 = {
    'id': 2,
    'name': 'Test Marathon',
    'thumbnail': '/test.img',
    'screenings': [{id: 2, date: '2200-02-26T12:09:43Z'}]
}

describe('Schedule components tests', () => {
    
    describe('Schedule component', () => {
        before(() => {
           const mock = new MockAdapter(axios)
           mock.onGet('/api/movies').reply(200, {
            results: [
                movie, movie2
            ]
           })
           mock.onGet('/api/marathons').reply(200, {
            results: [
                marathon1
            ]
           })
           global.wrapper = mount(<MemoryRouter><Schedule /></MemoryRouter>).find(Schedule)
        })
        it('gets movies', () => {
            assert.isNotNull(wrapper.state('movies'))
        })
        
    })

    describe('Show component', () => {
        before(() => {
            global.wrapper = mount(<MemoryRouter><Show show={movie} /></MemoryRouter>)
        })
        it('renders name', () => {
            assert.isTrue(wrapper.find('h3').contains('Test'), true)
        })
        it('renders thumbnail', () => {
            assert.equal(wrapper.find('img').prop('src'), '/test.img')
        })
        it('renders good 2D/3D information with 3D', () => {
            assert.isTrue(wrapper.find('p').contains('2D/3D'), true)
        })
        it('renders good 2D/3D information with 2D only', () => {
            movie['has_3D'] = false
            const wrapper = mount(<MemoryRouter><Show show={movie} /></MemoryRouter>)
            assert.isTrue(wrapper.find('p').contains('2D'), true)
        })
        it('renders screening informations with 1 day', () => {
            assert.lengthOf(wrapper.find(Screening), 1)
        })
        it('renders screening informations with 2 days', () => {
            movie['screenings'] = [{id: 1, date: '2200-02-26T12:09:43Z'}, {id: 2, date: '2200-02-27T12:09:43Z'}]
            const wrapper = mount(<MemoryRouter><Show show={movie} /></MemoryRouter>)
            assert.lengthOf(wrapper.find(Screening), 2)
        })
    })

    describe('Screenings component', () => {
        before(() => {
            global.day ={
                date: '01.01.2200',
                screenings: [{id: 1, hour: '9:10'}, {id: 2, hour: '10:15'}, {id: 3, hour: '16:30'}]
            }
            global.wrapper = shallow(<Screening day={global.day} />)
        })
        it('shows date', () => {
            assert.equal(wrapper.find('h4').text(), '01.01.2200')
        })
        it('renders screenings hours', () => {
            assert.lengthOf(wrapper.find('li'), 3)
            assert.equal(wrapper.find('li').at(0).text(), '9:10')
        })
    })
})
