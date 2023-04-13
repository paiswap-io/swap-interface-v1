import { useWeb3React } from '@web3-react/core';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { numFormat } from '../../../util/index'
import HomeTool from '../../../utils/index_c';
import OperModal from './modal';

interface Total {
    total_supply: string,
    total_balance: string,
    total_stake: string,
    total_reward: string
}


const IndexStake = (): ReactElement<ReactNode> => {
    const { account } = useWeb3React();
    const [total, setToal] = useState<Total>({
        total_supply: '',
        total_balance: '',
        total_stake: '',
        total_reward: ''
    });
    const test = async () => {
        const result = await HomeTool.totalSupply()
        console.log(result, '12312312321');
        const balance = await HomeTool.totalBalance();
        console.log(balance, '456456456');
    };
    const getTotalSupply = async () => {
        const result = await HomeTool.totalSupply()
        console.log(result, '12312312321');
        setToal({
            ...total,
            total_supply: result as string
        })
    }
    const getStaking = async (_address: string) => {
        const result = await HomeTool.stakein(_address);
        console.log(result)
    }
    useEffect(() => {
        // getTotalSupply()
    }, []);
    useEffect(() => {
        getStaking(account as string)
    }, [account]);
    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<number>(1);
    return (
        <div className='index-stake'>
            <ul>
                <li>
                    <p className='total-title'>Total staked</p>
                    <p className='amount-public' color='red'>{!total.total_supply ? <Spin /> : numFormat(total.total_supply)}&nbsp;PI</p>
                    <p className='total-title title-bg'>PNFT mining reward (Total undistributed)</p>
                    <p className='amount-public'>{!total.total_balance ? <Spin /> : total.total_balance}</p>
                </li>
                <li>
                    <p className='total-title'>PI staked</p>
                    <p className='amount-public'>{!total.total_stake ? <Spin /> : total.total_stake}</p>
                    <p>
                        <button type="button" onClick={() => {
                            setVisible(true);
                            setModalType(1);
                        }}>Stake</button>
                    </p>
                    <p className='total-title'>PNFT earned</p>
                    <p className='amount-public'>{!total.total_reward ? <Spin /> : total.total_reward}</p>
                    <p>
                        <button type="button" onClick={() => {
                            setVisible(true)
                            setModalType(1);
                        }}>Harvest</button>
                    </p>
                </li>
            </ul>
            <OperModal/>
        </div>
    )
};

export default IndexStake;