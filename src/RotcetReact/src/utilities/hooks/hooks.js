import {useState, useEffect} from 'react'

export function useScreenWidth(width, functionsToCallOnResize) {
    const [smallDevice, setSmallDevice] = useState(false);
  
    const changeSize = (size) => {
        if (functionsToCallOnResize) {
            functionsToCallOnResize.map(func => {
                func()
            })
        }
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