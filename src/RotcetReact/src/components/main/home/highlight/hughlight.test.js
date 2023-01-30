import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import YouTube from 'utilities/youtube/youtube.jsx';
import LoadingGif from 'media/gifs/loading.jsx'
import {Link} from 'react-router-dom'

import Highlight from './highlight.jsx'
import Movie from './movie.jsx'

configure({ adapter: new Adapter() });

const movie1 = {
    id: 1,
    name: 'Test 1',
    main_trailer: '748321',
    trailer_thumbnail: '/trailer_thumb',
    thumbnail: '/test1.jpg',
    short_description: 'Test desc 1',
    screenings: [1,2,3]
}
const movie2 = {
    id: 2,
    name: 'Test 2',
    main_trailer: null,
    thumbnail: '/test2.jpg',
    short_description: 'Test desc 2',
    screenings: []
}
const movie3 = {
    id: 3,
    name: 'Test 3',
    main_trailer: '748321',
    thumbnail: '/test3.jpg',
    short_description: 'Test desc 3',
    screenings: [1,2,3]
}


describe('Highlight components tests', () => {
    describe('Highlight component', () => {
        before(() => {
            let mock = new MockAdapter(axios)
            mock.onGet('/api/movies').reply(200, {
             results: [
                 movie1, movie2, movie3
             ]
            })
            global.wrapper = mount(<MemoryRouter><Highlight /></MemoryRouter>)
            mock = new MockAdapter(axios)
            mock.onGet('/api/movies').reply(200, {
             results: []
            })
            global.wrapper2 = mount(<MemoryRouter><Highlight /></MemoryRouter>)
        })
        it('renders loading gif', () => {
            assert.lengthOf(wrapper.find(LoadingGif), 1)
        });
        it('gets and renders movies', () => {
            wrapper.update()
            assert.lengthOf(wrapper.find(Highlight).find(Movie), 3)
        });
        it('renders null if no highlights', () => {
            wrapper2.update()   
            assert.equal(wrapper2.find(Highlight).html(), null)
        });
        it('passes data to movies', () => {
            wrapper.update()
            assert.equal(wrapper.find(Movie).first().find('h3').text(), 'Test 1')
        });
    });

    describe('Movie component', () => {
        before(() => {
            global.wrapper = shallow(<Movie index={0} movie={movie1} />)
            global.wrapper2 = shallow(<Movie index={1} movie={movie2} />)
        })
        it('displays all data', () => {
            assert.lengthOf(wrapper.find('img'), 1)
            assert.equal(wrapper.find('h3').text(), 'Test 1')
            assert.equal(wrapper.find('p').text(), 'Test desc 1')
        })
        it('gives --left className for second element', () => {
            assert.isTrue(wrapper2.find('.highlight_movie--left').exists())
        })
        it('displays main image if no trailer', () => {
            assert.isTrue(wrapper2.find('img').exists())
        })
        it('does not display both main image and trailer', () => {
            assert.isFalse(wrapper.find(YouTube).exists())
            assert.equal(wrapper.find('img').first().prop('src'), '/trailer_thumb')
        })
        it('renders YouTube component', () => {
            wrapper.find('.movie__trailer_thumbnail').simulate('click')
            wrapper.update()
            assert.isTrue(wrapper.find(YouTube).exists())
        })
        it('displays correct link to movie', () => {
            assert.equal(wrapper.find(Link).last().props().to, '/movie/Test-1-MV-1#tickets')
            assert.equal(wrapper2.find(Link).last().props().to, '/movie/Test-2-MV-2')
        })
    })
});