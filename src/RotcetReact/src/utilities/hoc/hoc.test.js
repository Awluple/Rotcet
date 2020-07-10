import React from 'react';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import { MemoryRouter, Link } from 'react-router-dom'

import Slider from './slider.jsx'

configure({ adapter: new Adapter() });

const TestNode = () => {
    return (
      <div>
        <Link to='/test'>Test</Link>
      </div>
    );
  }

describe('HOCs tests', () => {
    describe('Slider component tests', () => {
        before(() => {
            global.fake = sinon.spy();
            global.wrapper = mount(<MemoryRouter><Slider close={function(){}} ><TestNode/></Slider></MemoryRouter>)
            global.wrapper2 = mount(<MemoryRouter><Slider from={'right'} close={fake} ><TestNode/></Slider></MemoryRouter>)
        })
        it('has appropriate position class name', () => {
            assert.isTrue(wrapper.find('.slider--left').exists())
            assert.isTrue(wrapper2.find('.slider--right').exists())
        });
        it('renders children node', () => {
            assert.lengthOf(wrapper.find(TestNode), 1)
        });
        it('calls close function on X svg click', function(done) {
            wrapper2.find('svg').simulate('click')
            setTimeout(function () {
                assert.propertyVal(wrapper2.find('div').get(0).props.style, 'left', '100%')
                assert.isTrue(fake.calledOnce)
                done()
              }, 120);
        });
        it('hides after path change', () => {
          wrapper.find(Link).simulate('click', { button: 0 })
          assert.propertyVal(wrapper.find('div').get(0).props.style, 'left', '-100%')
        })
    });
});