import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import { MemoryRouter, Routes, createMemoryRouter, RouterProvider } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import News from './news.jsx'
import Article from './article.jsx'
import FullArticle from './fullArticle/fullArticle.jsx'

import LoadingGif from 'media/gifs/loading.jsx'

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
    thumbnail: '/test/thumbnail_test.jpg',
    day_posted: '2200-04-03',
    short_description: 'Test desc 2',
    full_description: null,
}

describe('News Page components tests', () => {
    describe('News component', () => {
        before(() => {
            let mock = new MockAdapter(axios)
            mock.onGet('/api/news/?page_size=10&page=1&fields=id,day_posted,thumbnail,short_description,title').reply(200, {
                next: "/api/news/?page_size=10&page=2&fields=id,day_posted,thumbnail,short_description,title",
                results: [
                    article1
                 ]
            }).onGet('/api/news/?page_size=10&page=2&fields=id,day_posted,thumbnail,short_description,title').reply(200, {
                next: null,
                results: [
                    article2
                ]
            })
            global.wrapper = mount(<MemoryRouter><News /></MemoryRouter>)
        })
        it('gets articles', () => {
            wrapper.update()
            assert.lengthOf(wrapper.find(News).find(Article), 1)
        });
        it('shows load more button', () => {
            assert.lengthOf(wrapper.find(News).find('.button'), 1)
        });
        it('loads more articles', async () => {
            const waitForPromises = () => new Promise(setImmediate);
            wrapper.find('.button').at(0).invoke('onClick')();
            await waitForPromises()
            wrapper.update();
            assert.lengthOf(wrapper.find(News).find(Article), 2)
            
        });
    })

    describe('Article component', () => {
        before(() => {
            global.dependencyModule  = require("../../../utilities/hooks/hooks.js");
            sinon.stub(dependencyModule, "useScreenWidth").returns(true);
            global.wrapper = mount(<MemoryRouter><Article article={article2} /></MemoryRouter>)
        })
        it('correctly formats depending on the screen width', () => {
            assert.lengthOf(wrapper.find(".article__image--small"), 1)
            sinon.restore();
            wrapper.unmount();

            sinon.stub(dependencyModule, "useScreenWidth").returns(false);
            wrapper.mount();
            assert.lengthOf(wrapper.find(".article__image--full"), 1)
        });
        it('shows all info', () => {
            assert.equal(wrapper.find('h4').at(0).text(), article2.title)
            assert.equal(wrapper.find('h6').at(0).text(), article2.day_posted)
            assert.equal(wrapper.find('img').at(0).prop('src'), article2.thumbnail)
        });
    })

    describe('FullArticle component', () => {
        before(() => {
            const router = createMemoryRouter(
                [
                  {
                    path: '/news/:articleId',
                    element: <FullArticle />
                  }
                ],
                {
                  initialEntries: ['/news/1'],
                  initialIndex: 0,
                }
              )
            let mock = new MockAdapter(axios)
            mock.onGet('/api/news/1').reply(200, {
                ...article2
            })
            global.wrapper = mount(<RouterProvider router={router} />)
        })
        it('shows loading gif', () => {
            assert.lengthOf(wrapper.find(FullArticle).find(LoadingGif), 1)
        });
        it('shows all info', () => {
            wrapper.update();
            assert.equal(wrapper.find('img').at(0).prop('src'), article2.image)
            assert.equal(wrapper.find('h2').at(0).text(), article2.title)
            assert.equal(wrapper.find('h6').at(0).text(), article2.day_posted)
            assert.equal(wrapper.find('p').at(0).text(), article2.short_description)
        });
    })
});