import React, {useRef, useCallback, useEffect} from 'react'
import { useLocation } from 'react-router-dom'

const About = () => {

    const { hash } = useLocation()

    const refs = {
        "about": useRef(null),
        "location": useRef(null),
        "contact": useRef(null),
        "hours": useRef(null),
    }
    
      useEffect(() => {
        if(Object.keys(refs).includes(hash.slice(1))) {
            refs[hash.slice(1)].current.scrollIntoView();
        }
      }, []);

  return (
    <div className='information'>
        <div className='misc-header'>
            <img src="/static/images/logo.png" alt="Logo"/>
            <h1>Information</h1>
        </div>
        <div ref={refs['about']} className='information__section information__about'>
            <h2>About Us</h2>
            <p>Etiam commodo wisi. Sed orci dui, eget felis. Vestibulum cursus non, ipsum. Nam nunc pede quis dui. Aliquam sit amet, consectetuer adipiscing mauris.Vestibulum pulvinar. Nulla interdum dapibus tellus. Curabitur sed eros porttitor dui. Ut a felis. Cum sociis natoque penatibus et interdum at, porttitor interdum. Donec erat vel neque lorem, ornare velit eleifend vitae, vestibulum in, augue. Nam rhoncus, dui sed augue eu felis adipiscing elit.</p>
        </div>
        <div ref={refs['location']} className='information__section information__section-right information__location'>
            <h2>Location</h2>
            <p>Our cinema address is <span>Westminster, London SW1A 0AA. </span>
            We have massive parking lot and place for your bikes!</p>
        </div>
        <div id="contact" ref={refs['contact']} className='information__section information__contact'>
            <h2>Contact</h2>
            <div>
                <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z"/>
                </svg>
                <p>+44 7911 123456</p>
            </div>
            <div>
                <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                </svg>
                <p>rotcet@cinema.co.uk</p>
            </div>
            <div>
                <a href="https://www.facebook.com" target='_blank'>
                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                    </svg>
                </a>
                <a href="https://www.twitter.com" target='_blank'>
                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                    </svg>
                </a>
            </div>
        </div>
        <div ref={refs['hours']} className='information__section information__section-right information__hours'>
            <h2>Hours</h2>
            <p>Standard open hours are <span>10am - 11pm</span> every day, but it can be
            diffrent on holidays and special events</p>
        </div>
    </div>
    
  )
}

export default About