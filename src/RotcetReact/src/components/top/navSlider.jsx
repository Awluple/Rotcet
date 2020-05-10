import React, {useState} from 'react'
import {Link, NavLink} from 'react-router-dom'

import Slider from 'utilities/hoc/slider.jsx'

const NavSlider = () => {

    const [clicked, setClicked] = useState(false)

    return (
        <React.Fragment >
            <div onClick={() => {setClicked(true)}} className='top__button'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/>
                </svg>
            </div>
            
            {clicked && 
                <Slider close={setClicked}>
                    <ul className='slider__ul'>
                        <li><NavLink exact activeClassName="selected" to="/">Home</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/calendar">Programme</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/membershio">Membership</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/news">News</NavLink></li>
                    </ul>
                </Slider>
            }
        </React.Fragment>
    )
}

export default NavSlider
