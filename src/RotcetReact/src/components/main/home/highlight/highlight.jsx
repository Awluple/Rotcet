import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Highlight = () => {

    const [highlights, setHighlights] = useState(null)

    useEffect(() => {
        axios.get('/api/movies', {
            params: {
                
            }
        })
    }, [])

    return (
        <div>
            
        </div>
    )
}

export default Highlight
