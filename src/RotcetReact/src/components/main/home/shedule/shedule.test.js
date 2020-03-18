import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Shedule from './shedule.jsx'
import Movie from './movie.jsx'
import MoviesList from './moviesList.jsx'
import Screening from './screenings.jsx'

import LoadingGif from 'media/gifs/loading.jsx'

configure({ adapter: new Adapter() });


const movie = {
    'id': 1,
    'name': 'Test',
    'thumbnail': '/test.img',
    'has_3D': true,
    'screenings': ['2200-02-26T12:09:43Z']
}

const movie2 = {
    'id': 2,
    'name': 'Test2',
    'thumbnail': '/test.img',
    'has_3D': true,
    'screenings': ['2200-02-26T12:09:43Z']
}

describe('Shedule components tests', () => {
    
    describe('Shedule component', () => {
        before(() => {
           const mock = new MockAdapter(axios)
           mock.onGet('/api/movies').reply(200, {
            results: [
                movie, movie2
            ]
           })
           global.wrapper = mount(<MemoryRouter><Shedule /></MemoryRouter>).find(Shedule)
        })
        it('gets movies', () => {
            assert.isNotNull(wrapper.state('movies'))
        })
        
    })

    describe('Movie component', () => {
        before(() => {
            global.wrapper = mount(<Movie movie={movie} />)
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
            const wrapper = mount(<Movie movie={movie}/>)
            assert.isTrue(wrapper.find('p').contains('2D'), true)
        })
        it('renders screening informations with 1 day', () => {
            assert.lengthOf(wrapper.find(Screening), 1)
        })
        it('renders screening informations with 2 days', () => {
            movie['screenings'] = ['2200-02-26T12:09:43Z', '2200-02-27T12:09:43Z']
            const wrapper = mount(<Movie movie={movie}/>)
            assert.lengthOf(wrapper.find(Screening), 2)
        })
    })

    describe('Screenings component', () => {
        before(() => {
            global.day ={
                date: '01.01.2200',
                screenings: ['9:10', '10:15', '16:30']
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

    describe('MoviesList component', () => {
        it('renders loading when no movies yet', () => {
            wrapper = shallow(<MoviesList movies={null} />)
            assert.lengthOf(wrapper.find(LoadingGif), 1)
        })
        it('renders info when no movies', () => {
            wrapper = mount(<MoviesList movies={[]} />)
            assert.equal(wrapper.find('.shedule__movies').find('h2').text(), 'Sorry, there are no screenings for now')
        })
        it('renders movies', () => {
            wrapper = mount(<MoviesList movies={[movie, movie2]} />)
            assert.lengthOf(wrapper.find(Movie), 2)
        })
    })
})
