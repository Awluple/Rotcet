import React from 'react';
import { configure, mount } from 'enzyme';
import { assert } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import { MemoryRouter, Link } from 'react-router-dom'

import MenuSlider from './menuSlider.jsx'
import Slider from './slider.jsx'
import SliderInfo from './sliderInfo.jsx';

configure({ adapter: new Adapter() });

const TestNode = () => {
  return (
    <div>
      <Link to='/test'>Test</Link>
    </div>
  );
}

const TestNode2 = () => {
  return (
    <React.Fragment>
        <li>1</li>
        <li>2</li>
    </React.Fragment>
  );
}


describe('Sliders components tests', () => {
    describe('MenuSlider component', () => {
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
  describe('Slder component', () =>{
      before(() => {
        global.wrapper = mount(<Slider elementsNumber={2} containerClassName='test1' listClassName='test2' sliderInfoClassName='test3'>
          <TestNode2 />
        </Slider>)
      })
      it('renders children node', () => {
        assert.lengthOf(wrapper.find(TestNode2), 1)
      })
      it('sets class names', () => {
        assert.lengthOf(wrapper.find('div').find('.test1'), 1)
        assert.lengthOf(wrapper.find('ul').find('.test2'), 1)
      })
  })
  describe('SliderInfo component', () =>{
    before(() => {
        global.fake = sinon.spy();
        global.fake2 = sinon.spy();
        global.fake3 = sinon.spy();
        global.wrapper = mount(<SliderInfo position={0} elementsNumber={5} elementsOnScreen={1} mouseMove={fake} mouseStart={fake2} mouseEnd={fake3}
        sliderInfoClassName='test' />)
      })
      it('sets class name', () => {
        assert.lengthOf(wrapper.find('.test'), 1)
      })
      it('calls mousedown', () => {
        wrapper.find('.slider_info').simulate('mousemove')
        assert.isTrue(fake.calledOnce)
      })
      it('calls mouseup', () => {
        wrapper.find('.slider_info').simulate('mouseDown')
        assert.isTrue(fake2.calledOnce)
      })
      it('calls mousemove', () => {
        wrapper.find('.slider_info').simulate('mouseup')
        assert.isTrue(fake3.calledOnce)
      })
      it('has correct svg for the first element', () => {
        assert.propertyVal(wrapper.find('path').props(), 'd', 'M 11,6 H 7 l 5,-6 5,6 h -4 v 3 h -2 z m 8,5 H 5 v 2 h 14 z')
      })
      it('has correct svg for an element in the middle', () => {
        const wrapper = mount(<SliderInfo position={200} elementsNumber={5} elementsOnScreen={1} mouseMove={function(){}} mouseStart={function(){}} mouseEnd={function(){}} />)
        assert.propertyVal(wrapper.find('path').props(), 'd', 'M11 6h-4l5-6 5 6h-4v3h-2v-3zm2 9h-2v3h-4l5 6 5-6h-4v-3zm6-4h-14v2h14v-2z')
      })
      it('has correct svg for the last element', () => {
        const wrapper = mount(<SliderInfo position={400} elementsNumber={5} elementsOnScreen={1} mouseMove={function(){}} mouseStart={function(){}} mouseEnd={function(){}} />)
        assert.propertyVal(wrapper.find('path').props(), 'd', 'M 11,6 H 7 l 5,-6 5,6 h -4 v 3 h -2 z m 8,5 H 5 v 2 h 14 z')
      })
  })
})
