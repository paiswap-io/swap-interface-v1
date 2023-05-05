import React, { ReactElement, ReactNode } from "react";
import { Carousel } from 'antd';
import Banner from '../../../assets/images/banner.jpg'
import Banner2 from '../../../assets/images/banner1.jpg'
// import Banner3 from '../../../assets/images/banner3.jpg'


const IndexBanner = (): ReactElement<ReactNode> => {
    return (
        <div className="index-banner">
            <Carousel autoplay effect="fade">
                <a href="https://pizzap.io/" target="_blank" rel="noopener noreferrer">
                    <img src={Banner} alt="" />
                </a>
                <a href="https://pizzap.io/" target="_blank" rel="noopener noreferrer">
                    <img src={Banner2} alt="" />
                </a>
                {/* <a href="https://pizzap.io/" target="_blank" rel="noopener noreferrer">
                    <img src={Banner3} alt="" />
                </a> */}
            </Carousel>
        </div>
    )
};

export default IndexBanner;