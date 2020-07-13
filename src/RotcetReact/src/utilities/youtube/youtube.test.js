import React from 'react';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import YoutubeApi from './youtube_api.js'
import YouTube from './youtube.jsx'

configure({ adapter: new Adapter() });

describe('YouTube Iframe tests', () => {
    describe('YouTube Api controller', () => {
        before(() => {
            let root = document.createElement("div");
            root.id = 'root'
            document.body.appendChild(root)
            global.youtube = new YoutubeApi()

            global.toBeCalled = sinon.fake()
            youtube.registerIframe(toBeCalled)
            youtube.registerIframe(toBeCalled)
        })
        it('adds iframes functions to toCall array', () => {
            assert.lengthOf(youtube.toCall, 2)
        });
        it('calls getApi', () => {
            assert.isTrue(youtube.apiCalled)
        })
        it('gets api', () => {
            assert.isNotNull(document.getElementById('youtube'))
        })
        it('calls iframes functions', () => {
            youtube._getApi()
            window.onYouTubeIframeAPIReady()
            assert.isTrue(youtube.isReady)
            assert.isTrue(toBeCalled.calledTwice)
        })
        it('calls iframes functions if api is ready', () => {
            youtube.isReady = true
            const toCall = sinon.fake()
            youtube.registerIframe(toCall)
            assert.isTrue(toCall.calledOnce)
        })
    });
    describe('YouTube component', () => {
        before(() => {
            global.fakeRegisterIframe = sinon.fake()
            window.YoutubeApi = {
                registerIframe: fakeRegisterIframe
            }
            global.wrapper = mount(<YouTube videoId='test' />)
        })
        it('registers iframe' , () => {
            assert.isTrue(fakeRegisterIframe.calledOnce)
        })
    })
});