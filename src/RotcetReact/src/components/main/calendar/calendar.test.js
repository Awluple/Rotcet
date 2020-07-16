import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Calendar from './calendar.jsx'
import Dates from './dates.jsx'
import Screenings from './screenings.jsx'

import LoadingGif from 'media/gifs/loading.jsx'

configure({ adapter: new Adapter() });

const movie = {
    id: 1,
    show_id: 1,
    show_type: 'MV',
    name: 'Test',
    image: '/test.img',
    date: '2200-02-26T12:09:43'
}
const movie2 = {
    id: 2,
    show_id: 2,
    show_type: 'MR',
    name: 'Test 2',
    image: null,
    date: '2200-02-26T13:09:43'
}

describe('Calendar components tests', () => {
    describe('Calendar component', () => {
        before(() => {
            const clock = sinon.useFakeTimers(new Date(2200,9,1,12).getTime());
            const mock = new MockAdapter(axios)
            mock.onGet('/api/screenings').reply(200, {
             results: [
                 movie
             ]
            })
            global.wrapper = mount(<MemoryRouter><Calendar /></MemoryRouter>)
            clock.restore();

            const mock2 = new MockAdapter(axios)
            mock2.onGet('/api/screenings').reply(200, {
             results: [
                 
             ]
            })
            global.wrapper2 = mount(<MemoryRouter><Calendar /></MemoryRouter>)
         })
        it('renders loading gif', () => {
            assert.lengthOf(wrapper.find(LoadingGif), 1)
        });
        it('renders screenings', () => {
            wrapper.update()
            assert.lengthOf(wrapper.find(Screenings), 1)
        });
        it('show info when no screenings', () => {
            wrapper2.update()
            assert.lengthOf(wrapper2.find('.no_screenings'), 1)
        });
        it('shows correct date', () => {
            assert.equal(wrapper.find('h2').text(), 'Schedule for 01.10.2200')
        })
    });
    describe('Screenings component', () => {
        before(() => {
            global.wrapper = mount(<MemoryRouter><Screenings screenings={[movie, movie2]} /></MemoryRouter>)
        })
        it('shows correct date', () => {
            wrapper.update()
            assert.equal(wrapper.find('h4').first().text(), '12:09')
        })
        it('shows all data', () => {
            assert.equal(wrapper.find('h3').first().text(), 'Test')
            assert.equal(wrapper.find('img').first().prop('src'), '/test.img')
            assert.equal(wrapper.find('img').last().prop('src'), '/static/images/logo.png')
        })
    })
    describe('Dates component', () => {
        before(() => {
            const clock = sinon.useFakeTimers(new Date(2200,9,1,12).getTime());
            global.fake = sinon.spy();
            global.wrapper = shallow(<Dates getScreenings={fake} />)
            clock.restore();
        })
        it('shows appropriate dates', () => {
            assert.equal(wrapper.find('li').first().text(), '01.10.2200')
            assert.equal(wrapper.find('li').last().text(), '14.10.2200')
        })
        it('calls getScreenings funtion', () => {
            wrapper.find('li').last().simulate('click')
            assert.isTrue(fake.calledOnce)
        })
    })
});