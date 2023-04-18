import { useWeb3React } from '@web3-react/core';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { numFormat } from '../../../util/index'
import HomeTool from '../../../utils/index_c';
import OperModal from './modal';

interface Total {
    total_supply: string,
    total_balance: string,
}
interface Stake {
    total_stake: string,
    total_reward: string
}

interface Props {
    pAddress: string,
    nAddress: string,
    hot: number,
    real: number,
    staked:number
}

const IndexStake = (props: Props): ReactElement<ReactNode> => {
    //Main
    const { account } = useWeb3React();
    const [total, setToal] = useState<Total>({
        total_supply: '',
        total_balance: '',
    });
    const [stake, setStake] = useState<Stake>({
        total_stake: '',
        total_reward: ''
    });
    //质押总量
    const getTotalSupply = async () => {
        const result = await HomeTool.totalSupply(props.pAddress)
        const balance = await HomeTool.totalBalance(props.nAddress);
        setToal({
            total_supply: result as string,
            total_balance: balance as string
        })
    };
    const getStaking = async (_address: string) => {
        const result = await HomeTool.stakein(props.pAddress, _address);
        const pending = await HomeTool.pendingReward(props.pAddress, _address);
        setStake({
            total_stake: result as string,
            total_reward: pending as string
        })
    }
    useEffect(() => {
        props.real === 1 && getTotalSupply();
        return () => {
            // getTotalSupply()
        }
    }, []);
    useEffect(() => {
        props.real === 1 && account != undefined && getStaking(account as string)
        return () => {
            // getStaking(account as string)
        }
    }, [account]);
    const is = () : boolean => {
        if(props.staked === 1){
            return +stake.total_stake > 0 ? false : true
        }else{
            return false
        }
    }
    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<number>(1);
    return (
        <div className='index-stake'>
            <div className='pool-inner'>
                <ul>
                    <li>
                        <p className='total-title'>Total staked</p>
                        <div className='amount-public'>{props.real === 0 ? 'xxx' : !total.total_supply ? <Spin /> : numFormat(total.total_supply)}&nbsp;PI</div>
                    </li>
                    <li>
                        <p className='total-title'>PNFT mining reward (Total undistributed)</p>
                        <div className='amount-public'>{props.real === 0 ? 'xxx' : !total.total_balance ? <Spin /> : numFormat(total.total_balance)}</div>
                    </li>
                    <li>
                        <p className='total-title'>PI staked</p>
                        <div className='amount-public'>{props.real === 0 ? 'xxx' : !stake.total_stake ? <Spin /> : numFormat(stake.total_stake)}</div>
                    </li>
                    <li>
                        <p className='total-title'>PNFT earned</p>
                        <div className='amount-public'>{props.real === 0 ? 'xxx' : !stake.total_reward ? <Spin /> : numFormat(stake.total_reward)}</div>
                    </li>
                    <li>
                        <button type="button" onClick={() => {
                            setVisible(true);
                            setModalType(1);
                        }}>Stake</button>
                        <button type="button" onClick={() => {
                            setVisible(true)
                            setModalType(2);
                        }}>Harvest</button>
                    </li>
                </ul>
                {props.hot === 1 && <div className='hot-pool'>HOT</div>}
                {(props.real === 0 || is()) && <div className='comming-box'>
                    <p>Coming soon</p>
                </div>}
            </div>
            <OperModal pAddress={props.pAddress} nAddress={props.nAddress} reload={() => {
                getStaking(account as string)
            }} staked={+stake.total_stake} earned={+stake.total_reward} type={modalType} visible={visible} onClose={(val: boolean) => {
                setVisible(val)
            }} />
        </div>
    )
};

export default IndexStake;