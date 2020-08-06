import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch, Link } from "react-router-dom";

import Slider from 'utilities/hoc/slider.jsx'

const Gallery = props => {
    const match = useRouteMatch();
    const [image, setImage] = useState(null)

    const changeImage = (id) => {
        let image = props.images.filter(image => {
            return image.id == id
        })[0]
        setImage(image)
    }
    
    useEffect(() => {
        let image = props.images.filter(image => {
            return image.id == match.params.imageId
        })[0]
        setImage(image)
    }, [])

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    return (
        <div className='gallery'>
            <div className="close-button">
                <Link to={props.url}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"></path>
                </svg>
                </Link>
            </div>
            <div className='gallery__main-image'>
            { image ? 
                <img src={image.image} alt="movie image"/>
            :
                <h2>Cannot load the image</h2>
            }
            </div>



            
            <Slider elementsNumber={props.images.length}
            elementsOnScreen={2}
            sliderInfoClassName='movie__slider-info'
            containerClassName='movie__slider'
            listClassName='movie__list'
            >
                { 
                    <React.Fragment>
                        {props.images.map(image => {
                            return <li onClick={() => {changeImage(image.id)}} key={image.id}><img src={image.thumbnail} alt="image"/></li>
                        })}
                    </React.Fragment>
                }
            </Slider>
        </div>
    )
}

Gallery.propTypes = {
    images: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired
}

export default Gallery
