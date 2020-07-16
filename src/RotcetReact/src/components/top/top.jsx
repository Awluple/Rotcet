import React, {useState, useEffect} from 'react'

import Nav from './nav.jsx'
import NavSlider from './navSlider.jsx'
import UserSlider from './userSlider.jsx'

const Top = () => {

    const [smallDevice, setSmallDevice] = useState(false)

    const changeSize = (size) => {
        if(size.matches) {
            setSmallDevice(true)
        }else {
            setSmallDevice(false)
        }
    }

    useEffect(() => {
        const size = window.matchMedia("(max-width: 1024px)")
        changeSize(size)
        size.addListener(changeSize)
        return () => {
            size.removeListener(changeSize)
        }
    }, [])

    
    if(!smallDevice) {
        return (
            <div className='top'>
                <div className='logo'>
                    <img src="" alt=""/>
                    <img src="/static/images/logo.png" alt="Logo"/>
                </div>
                <Nav />
            </div>
        )
    }else {
        return (
            <div className='top'>
                <NavSlider />
                <div className='logo'>
                    <img src="/static/images/logo.png" alt="Logo"/>
                </div>
                <UserSlider />
            </div>
        )
    }
}

export default Top;