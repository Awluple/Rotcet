import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import sinon from 'sinon'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { MemoryRouter, Route } from 'react-router-dom'
import LoadingGif from 'media/gifs/loading.jsx'
import YouTube from 'utilities/youtube/youtube.jsx'

import Movie from './movie.jsx'
import Details from './details.jsx'
import Trailers from './trailers.jsx'
import Tickets from './tickets.jsx'
import Screenings from './screenings.jsx'
import Images from './images/images.jsx'
import Gallery from './images/gallery.jsx'

configure({ adapter: new Adapter() });

const movie1 = {
    "id": 1,
    "screenings": [
        {id: 1, date: "2200-08-04T15:44:31Z"}
    ],
    "trailers": [
        {
            "id": 1,
            "trailer": "abcdTest1",
            "trailer_thumbnail": "/test/trailers/trailer_thumb1.jpg",
            "movie": 1
        },
        {
            "id": 2,
            "trailer": "abcdTest2",
            "trailer_thumbnail": "/test/trailers/trailer_thumb2.jpg",
            "movie": 1
        }
    ],
    "images": [
        {
            "id": 1,
            "image": "/test/images/image1.jpg",
            "thumbnail": "/test/image_thumb1.jpg",
            "movie": 1
        },
        {
            "id": 2,
            "image": "/test/images/image2.jpg",
            "thumbnail": "/test/image_thumb2.jpg",
            "movie": 1
        }],
    "name": "Test",
    "short_description": "Test short description",
    "description": 'Test description',
    "main_image": "/test/img.jpg",
    "main_trailer": "abcdtest",
    "trailer_thumbnail": '/test/trailer_thumb.jpg',
    "thumbnail": "/test/img_thumb.jpg",
    "relese_date": "2000-04-28",
    "tickets_sale_date": "2200-07-23",
}

const movie2 = {
    "id": 2,
    "screenings": [],
    "trailers": [],
    "images": [],
    "name": "Test",
    "short_description": "Test short description",
    "description": null,
    "main_image": "/test/img.jpg",
    "main_trailer": null,
    "trailer_thumbnail": null,
    "thumbnail": "/test/img_thumb.jpg",
    "relese_date": "2000-04-28",
    "tickets_sale_date": null,
}

const trailers = [
    {id: 1,
    trailer_thumbnail: '/test/img1.jpg',
    trailer: 'test1'
    },
    {id: 2,
    trailer_thumbnail: '/test/img2.jpg',
    trailer: 'test2'
    }
]

const images = [
    {
        "id": 1,
        "image": "/test/img1.jpg",
        "thumbnail": "/test/img1_thumb.jpg",
    },
    {
        "id": 2,
        "image": "/test/img2.jpg",
        "thumbnail": "/test/img1_thumb.jpg",
    },
]

const screenings = {
    '10.10.2200': [{id: 1, hour: '12:00'}],
    '11.10.2200': [{id: 2, hour: '13:00'}],
    '12.10.2200': [{id: 3, hour: '14:00'}],
    days: ['10.10.2200','11.10.2200','12.10.2200']
}

describe('Movie page', () => {
    describe('Movie component', () => {
        before(() => {
            const mock = new MockAdapter(axios)
            mock.onGet('/api/movies/1').reply(200, {
                ...movie1
            })
            mock.onGet('/api/movies/2').reply(200, {
                ...movie2
            })
            global.wrapper = mount(<MemoryRouter ><Movie match={{params:{id:1}}} /></MemoryRouter>)
            global.wrapper2 = mount(<MemoryRouter ><Movie match={{params:{id:2}}} /></MemoryRouter>)
         })
        it('renders LoadingGif', () => {
            assert.lengthOf(wrapper.find(LoadingGif), 1)
        });
        it('renders Details', () => {
            wrapper.update()
            wrapper2.update()
            assert.lengthOf(wrapper.find(Details), 1)
        });
        it('renders or passes Trailers', () => {
            assert.lengthOf(wrapper.find(Trailers), 1)
            assert.lengthOf(wrapper2.find(Trailers), 0)
        });
        it('renders or passes Images', () => {
            assert.lengthOf(wrapper.find(Images), 1)
            assert.lengthOf(wrapper2.find(Images), 0)
        });
        it('renders or passes Tickets', () => {
            assert.lengthOf(wrapper.find(Tickets), 1)
            assert.lengthOf(wrapper2.find(Tickets), 0)
        });
    });
    describe('Details component', () => {
        before(() => {
            global.fake = sinon.spy();
            global.wrapper = mount(<Details name='Test' description='Test desc' 
            shortDescription="Test desc short" image='/test/img.jpg' tickets='abc' scrollToTickets={fake}/>)

            global.wrapper2 = mount(<Details name='Test' shortDescription="Test desc short" image='/test/img.jpg' scrollToTickets={function(){}}/>)
         })
        it('shows name and image', () => {
            assert.equal(wrapper.find('img').prop("src"), '/test/img.jpg')
            assert.equal(wrapper.find('h1').text(), 'Test')
        });
        it('shows tickets button', () => {
            assert.lengthOf(wrapper.find('.description__tickets'), 1)
            assert.lengthOf(wrapper2.find('.description__tickets'), 0)
        });
        it('calls scrollToTickets', () => {
            wrapper.find('button').simulate('click')
            assert.isTrue(fake.calledOnce)
        });
        it('shows description or short description', () => {
            assert.equal(wrapper.find('.description').text(), 'Test desc')
            assert.equal(wrapper2.find('.description').text(), 'Test desc short')
        });
    });
    describe('Trailers component', () => {
        before(() => {
            global.wrapper = shallow(<Trailers trailers={trailers} />)
         })
        it('shows primary trailer thumbnail', () => {
            assert.equal(wrapper.find('.youtube-thumbnail').find('img').prop("src"), '/test/img1.jpg')
        });
        it('shows other trailers thumbnails', () => {
            assert.equal(wrapper.find('li').find('img').prop("src"), '/test/img2.jpg')
        });
        it('runs trailer', () => {
            wrapper.find('.youtube-thumbnail').simulate('click')
            assert.lengthOf(wrapper.find(YouTube), 1)
        });
        it('exchange primary trailer', () => {
            wrapper.find('li').simulate('click')
            assert.equal(wrapper.find('.youtube-thumbnail').find('img').prop("src"), '/test/img2.jpg')
        });
    });
    describe('Tickets component', () => {
        before(() => {
            const clock = sinon.useFakeTimers(new Date(2200,9,10,12).getTime());
            global.wrapper = mount(<MemoryRouter><Tickets screenings={screenings} /></MemoryRouter>)
            clock.restore();
         })
        it('shows dates', () => {
            assert.lengthOf(wrapper.find('.tickets__date'), 7)
            assert.lengthOf(wrapper.find(Screenings), 7)
        });
        it('shows dates info', () => {
            assert.equal(wrapper.find('.tickets__date').first().find('h4').text(), 'Today')
            assert.equal(wrapper.find('.tickets__date').first().find('p').text(), '10.10.2200')
            
            assert.equal(wrapper.find('.tickets__date').last().find('h4').text(), 'Thursday')
            assert.equal(wrapper.find('.tickets__date').last().find('p').text(), '16.10.2200')
        });
        it('loads more dates', () => {
            wrapper.find('button').simulate('click')
            assert.lengthOf(wrapper.find('.tickets__date'), 10)
        });
    });
    describe('Screenings component', () => {
        before(() => {
            global.wrapper = shallow(<Screenings screenings={[{id: 1, hour: '12:00'}, {id: 2, hour: '13:00'}]} />)
            global.wrapper2 = shallow(<Screenings />)
         })
        it('has a length of 6', () => {
            assert.lengthOf(wrapper.find('li'), 6)
            assert.lengthOf(wrapper2.find('li'), 6)
        });
        it('fills cells', () => {
            assert.equal(wrapper.find('li').at(0).text(), '12:00')
            assert.equal(wrapper.find('li').at(1).text(), '13:00')
        });
    });

    describe('Images component', () => {
        before(() => {
            global.wrapper = mount(<MemoryRouter><Images images={images} /></MemoryRouter>)
         })
        it('shows images', () => {
            assert.lengthOf(wrapper.find('img'), 2)
        });
    });
    describe('Gallery component', () => {
        before(() => {
            global.wrapper = mount(<MemoryRouter initialEntries={['/galleryTest-1']}>
                                        <Route path={`/galleryTest-:imageId`} render={ () => <Gallery images={images} url='/' />} />
                                    </MemoryRouter>)
         })
        it('shows main image', () => {
            assert.equal(wrapper.find('.gallery__main-image').find('img').prop('src'), '/test/img1.jpg')
        });
        it('shows slider images', () => {
            assert.lengthOf(wrapper.find('.movie__list').find('img'), 2)
        });
        it('exchange main image', () => {
            wrapper.find('.movie__list').find('li').at(1).simulate('click')
            assert.equal(wrapper.find('.gallery__main-image').find('img').prop('src'), '/test/img2.jpg')
        });
    });
});