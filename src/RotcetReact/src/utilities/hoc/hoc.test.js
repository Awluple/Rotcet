import React from 'react';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import { MemoryRouter, Link } from 'react-router-dom'

import MenuSlider from './menuSlider.jsx'

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
            global.wrapper = mount(<MemoryRouter><MenuSlider close={function(){}} ><TestNode/></MenuSlider></MemoryRouter>)
            global.wrapper2 = mount(<MemoryRouter><MenuSlider from={'right'} close={fake} ><TestNode/></MenuSlider></MemoryRouter>)
        })
        it('has appropriate position class name', () => {
            assert.isTrue(wrapper.find('.menu-slider--left').exists())
            assert.isTrue(wrapper2.find('.menu-slider--right').exists())
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