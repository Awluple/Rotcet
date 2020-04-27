import React from 'react';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import Slider from './slider.jsx'

configure({ adapter: new Adapter() });

const TestNode = () => {
    return (
      <div>
        <h1>Test</h1>
      </div>
    );
  }

describe('HOCs tests', () => {
    describe('Slider component tests', () => {
        before(() => {
            global.fake = sinon.spy();
            global.wrapper = mount(<Slider close={function(){}} ><TestNode/></Slider>)
            global.wrapper2 = mount(<Slider from={'right'} close={fake} ><TestNode/></Slider>)
        })
        it('Has appropriate position class name', () => {
            assert.isTrue(wrapper.find('.slider--left').exists())
            assert.isTrue(wrapper2.find('.slider--right').exists())
        });
        it('Renders children node', () => {
            assert.lengthOf(wrapper.find(TestNode), 1)
        });
        it('Calls close function on X svg click', function(done) {
            wrapper2.find('svg').simulate('click')
            setTimeout(function () {
                assert.propertyVal(wrapper2.find('div').get(0).props.style, 'left', '100%')
                assert.isTrue(fake.calledOnce)
                done()
              }, 120);
        });
    });
});