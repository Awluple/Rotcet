import React from 'react'

const LoadingGif = () => {
    return (
        <svg className='loading_gif' xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" version="1.0" viewBox="0 0 128 128" 
        xmlSpace="preserve">
            <g transform="rotate(45 64 64)">
                <circle cx="16" cy="64" r="16" fill="#151d23" fillOpacity="1"/>
                <circle cx="16" cy="64" r="16" fill="#63686c" fillOpacity="0.67" transform="rotate(45,64,64)"/>
                <circle cx="16" cy="64" r="16" fill="#9da0a3" fillOpacity="0.42" transform="rotate(90,64,64)"/>
                <circle cx="16" cy="64" r="16" fill="#d0d2d3" fillOpacity="0.2" transform="rotate(135,64,64)"/>
                <circle cx="16" cy="64" r="16" fill="#e3e4e5" fillOpacity="0.12" transform="rotate(180,64,64)"/>
                <circle cx="16" cy="64" r="16" fill="#e3e4e5" fillOpacity="0.12" transform="rotate(225,64,64)"/>
                <circle cx="16" cy="64" r="16" fill="#e3e4e5" fillOpacity="0.12" transform="rotate(270,64,64)"/>
                <circle cx="16" cy="64" r="16" fill="#e3e4e5" fillOpacity="0.12" transform="rotate(315,64,64)"/>
                <animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" 
                calcMode="discrete" dur="720ms" repeatCount="indefinite"/>
            </g>
        </svg>
    )
}

export default LoadingGif
