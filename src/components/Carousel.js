'use client'
import React from 'react'
import Carousel from 'react-multi-carousel';

const CarouselC = ({containerClassName, itemClass, responsive, children, arrowsDesktop}) => {
    return (
        <>
            {children && <Carousel
                swipeable={false}
                draggable={false}
                responsive={responsive}
                infinite={true}
                autoPlay={false}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                transitionDuration={500}
                containerClass={containerClassName ? containerClassName : "carousel-container"}
                removeArrowOnDeviceType={arrowsDesktop ? "" : ["tablet", "mobile"]}
                arrows={arrowsDesktop}
                dotListClass="custom-dot-list-style"
                itemClass={itemClass ? itemClass : "carousel-item-padding-40-px"}
            >
                {children}
            </Carousel>}
        </>
    )
}
export default CarouselC;
