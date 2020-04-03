import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import LoadingGif from 'media/gifs/loading.jsx'

import News from './news.jsx'
import Article from './article.jsx'

configure({ adapter: new Adapter() });

const article1 = {
    id: 1,
    title: 'Test 1',
    image: '/test/test.jpg',
    day_posted: '2200-01-02',
    short_description: 'Test desc 1'
}
const article2 = {
    id: 2,
    title: 'Test 2',
    image: '/test/test.jpg',
    day_posted: '2200-04-03',
    short_description: 'Test desc 2'
}

describe('News components tests', () => {
    describe('News component', () => {
        before(() => {
            let mock = new MockAdapter(axios)
            mock.onGet('/api/news').reply(200, {
             results: [
                article1, article2
             ]
            })
            global.wrapper = mount(<MemoryRouter><News /></MemoryRouter>)
        })
        it('gets articles', () => {
            wrapper.update()
            assert.lengthOf(wrapper.find(News).find(Article), 2)
        });
        it('passes data to artiles', () => {
            wrapper.update()
            assert.equal(wrapper.find(News).find(Article).first().find('h4').text(), 'Test 1')
        });
        it('renders loading gif', () => {
            let mock = new MockAdapter(axios)
            mock.onGet('/api/news').reply(200, {
             results: [
                article1, article2
             ]
            })
            const wrapper2 = mount(<MemoryRouter><News /></MemoryRouter>)
            assert.lengthOf(wrapper2.find(News).find(LoadingGif), 1)
        });
    });
    describe('Article component', () => {
        before(() => {
            global.wrapper = shallow(<Article article={article1} />)
        })
        it('displays all data', () => {
            assert.lengthOf(wrapper.find('img'), 1)
            assert.lengthOf(wrapper.find('h4'), 1)
            assert.lengthOf(wrapper.find('h6'), 1)
            assert.lengthOf(wrapper.find('p'), 1)
        })
    })
});