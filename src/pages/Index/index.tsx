import React, { ReactElement, ReactNode } from "react";
import IndexBanner from './components/banner';
import IndexStake from './components/stake';
import './index.scss'

const IndexView = (): ReactElement<ReactNode> => {
    return (
        <div className="index-view">
            <IndexBanner />
            <IndexStake />
        </div>
    )
};

export default IndexView;