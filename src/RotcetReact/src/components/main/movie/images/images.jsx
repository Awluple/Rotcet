import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, useRouteMatch, Link, Redirect, useLocation } from "react-router-dom";

import Slider from 'utilities/sliders/slider.jsx'

import Gallery from './gallery.jsx'

const Images = props => {
    const match = useRouteMatch();
    const { pathname } = useLocation();

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
                            return <li key={image.id}><Link to={`${match.url}/images-${image.id}`}><img src={image.thumbnail} alt="image"/></Link></li>
                        })}
                    </React.Fragment>
                }
            </Slider>
            <Switch>
                <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} /> remove trailing slash which breaks gallery links  {/* delete trailing slash */}
                <Route path={`${match.url}/images-:imageId`} render={ () => <Gallery url={match.url} images={props.images} />} /> 
            </Switch>
            
        </div>
    )
}

Images.propTypes = {
    images: PropTypes.array.isRequired
}

export default Images
