import React from 'react';
import ReactDOM from 'react-dom';
import { configure, shallow } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

import Movie from './movie.jsx'

configure({ adapter: new Adapter() });

describe('Shedule movie tests', () => {
    describe('', () => {
        beforeEach(() => {
            global.wrapper = shallow(<Movie movie={{}}/>)
        })
        it('', () => {

        });
    });
});