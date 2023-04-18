import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "components/ConnectWallet";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import IndexBanner from './components/banner';
import IndexStake from './components/stake';
import HomeTool from '../../utils/index_c';
import './index.scss';
import { Switch } from "antd";

interface Pool {
    p_address: string,
    n_address: string,
    is_real: number,
    is_hot: number
}
//主网
const Main: Pool[] = [
    {
        p_address: '0xdcc437cc8F5f47809923e8636416A9CbabC6463d',
        n_address: '0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08',
        is_real: 1,
        is_hot: 1
    },
    {
        p_address: '',
        n_address: '',
        is_real: 0,
        is_hot: 0
    },
    {
        p_address: '',
        n_address: '',
        is_real: 0,
        is_hot: 0
    },
];
//测试网
const Dev: Pool[] = [
    {
        p_address: '0x44E4D91Cc9Cde45ff0b4c746edBf31F030F0B819',
        n_address: '0x6a2e954633B53b7b75eD10b35EaB10ec31cEb76C',
        is_real: 1,
        is_hot: 1
    },
    {
        p_address: '',
        n_address: '',
        is_real: 0,
        is_hot: 0
    },
    {
        p_address: '',
        n_address: '',
        is_real: 0,
        is_hot: 0
    },
]

const IndexView = (): ReactElement<ReactNode> => {
    const { account } = useWeb3React();
    useEffect(() => {
        const { ethereum }: any = window;
        const ChainId: number = HomeTool.web3.utils.hexToNumber(ethereum?.chainId)
        if (ChainId !== 8007736 && ChainId !== 10067275) {
            HomeTool.switchChain(8007736);
        }
    }, []);
    const [poolList, setPoolList] = useState<Pool[]>([]);
    //切换网络
    // const [netWork, setNetWork] = useState<number>(1);
    // const onChange = async (e: RadioChangeEvent) => {
    //     await HomeTool.switchChain(e.target.value === 1 ? 8007736 : 10067275);
    //     setPoolList(e.target.value === 1 ? Main : Dev)
    //     setNetWork(e.target.value);
    // };
    const changeNet = (_val: number) => {
        setPoolList(_val === 1 ? Main : Dev)
    };
    const win: any = window;
    win.changeNet = changeNet;
    useEffect(() => {
        setTimeout(() => {
            setPoolList(HomeTool.chainId === 8007736 ? Main : Dev)
        }, 500)
    }, []);
    //Staked
    const [staked, setStaked] = useState<boolean>(false);
    const [isStaked, setIsStaked] = useState<number>(0);
    const selectStaked = (checked: boolean) => {
        setStaked(checked)
        setIsStaked(checked ? 1 : 0)
    }
    const Pool = () => {
        return (
            <div className="pool-con">
                <div className="pool-options">
                    {/* Staked */}
                    <div className="staked-switch">
                        Staked&nbsp;:&nbsp;
                        <Switch checked={staked} size="small" onChange={selectStaked} />
                    </div>
                    {/* Dev */}
                    {/* <div className="">
                        Network&nbsp;:&nbsp;
                        <Radio.Group onChange={onChange} value={netWork}>
                            <Radio value={1}>Mainnet</Radio>
                            <Radio value={2}>Testnet</Radio>
                        </Radio.Group>
                    </div> */}
                </div>
                <div className="pool-list">
                    {
                        poolList.map((item: Pool, index: number) => {
                            return (
                                <IndexStake staked={isStaked} key={`${item.p_address}-${index}`} pAddress={item.p_address} nAddress={item.n_address} hot={item.is_hot} real={item.is_real} />
                            )
                        })
                    }
                </div>
            </div>

        )
    }
    return (
        <div className="index-view">
            <IndexBanner />
            {account ? <Pool /> : <div className="connect-wallet-box">
                <ConnectWallet>
                    <button className="connect-wallet-side">Connect Wallet</button>
                </ConnectWallet>
            </div>}
        </div>
    )
};

export default IndexView;