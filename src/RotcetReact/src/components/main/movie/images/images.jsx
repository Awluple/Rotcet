import React from 'react'
import PropTypes from 'prop-types'
import { Link  } from "react-router-dom";
import Slider from 'utilities/sliders/slider.jsx'

const Images = props => {
    return (
        <div className='movie__images'>
            <Slider elementsNumber={props.images.length}
            elementsOnScreen={2}
            sliderInfoClassName='movie__slider-info'
            containerClassName='movie__slider'
            listClassName='movie__list'
            >
                { 
                    <React.Fragment>
                        {props.images.map(image => {
                            return <li key={image.id}><Link to={`images-${image.id}`}><img src={image.thumbnail} alt="image"/></Link></li>
                        })}
                    </React.Fragment>
                }
            </Slider>
        </div>
    )
}
Images.propTypes = {
    images: PropTypes.array.isRequired
}

export default Images
