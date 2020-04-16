import React, {useState} from 'react'
import {Link} from 'react-router-dom'

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
                    <ul className='slider_ul'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/programme">Programme</Link></li>
                        <li><Link to="/membershio">Membership</Link></li>
                        <li><Link to="/news">News</Link></li>
                    </ul>
                </Slider>
            }
        </React.Fragment>
    )
}

export default NavSlider
