import React, {useState} from 'react'
import {NavLink} from 'react-router-dom'

import MenuSlider from 'utilities/sliders/menuSlider.jsx'

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
                <MenuSlider close={setClicked}>
                    <ul className='menu-slider__ul'>
                        <li className='shadow-tiny'><NavLink className={({ isActive }) => isActive ? 'selected' : ''} to="/">Home</NavLink></li>
                        <li className='shadow-tiny'><NavLink className={({ isActive }) => isActive ? 'selected' : ''} to="/calendar">Programme</NavLink></li>
                        <li className='shadow-tiny'><NavLink className={({ isActive }) => isActive ? 'selected' : ''} to="/membership">Membership</NavLink></li>
                        <li className='shadow-tiny'><NavLink className={({ isActive }) => isActive ? 'selected' : ''} to="/news">News</NavLink></li>
                    </ul>
                </MenuSlider>
            }
        </React.Fragment>
    )
}

export default NavSlider
