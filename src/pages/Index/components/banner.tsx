import React, { ReactElement, ReactNode } from "react";
import { Carousel } from 'antd';
import Banner from '../../../assets/images/banner.png'


const IndexBanner = (): ReactElement<ReactNode> => {
    return (
        <div className="index-banner">
            <Carousel autoplay effect="fade">
                <a href="https://pizzap.io/" target="_blank" rel="noopener noreferrer">
                    <img src={Banner} alt="" />
                </a>
            </Carousel>
        </div>
    )
};

export default IndexBanner;