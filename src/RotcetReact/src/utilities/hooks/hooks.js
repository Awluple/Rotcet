import {useState, useEffect} from 'react'

export function useScreenWidth(width) {
    const [smallDevice, setSmallDevice] = useState(false);

    const changeSize = (size) => {
        if(size.matches) {
            setSmallDevice(true)
        }else {
            setSmallDevice(false)
        }
    }

    useEffect(() => {
        const small = window.matchMedia(`(max-width: ${width}px)`)
        changeSize(small)
        small.addListener(changeSize)
        return () => {
            small.removeListener(changeSize)
        }
    });
    return smallDevice;
  }