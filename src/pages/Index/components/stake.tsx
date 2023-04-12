import React, { ReactElement, ReactNode, useEffect } from 'react';
import Web3 from 'web3'
import { ABI, PNFT_CONTRACT_ADDRESS, PISTAKING_CONTRACT_ADDRESS, gas, gasPrice } from '../../../constants/home'
// import { useHome } from 'hooks';

let web3: any
if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider)
}

const IndexStake = (): ReactElement<ReactNode> => {
    // const { totalSupply } = useHome();
    const totalSupply = () => {
        const MyContract = new web3.eth.Contract(ABI, PISTAKING_CONTRACT_ADDRESS)
        MyContract.methods
            .getTotalSupply()
            .call()
            .then((result: unknown) => {
                console.log(web3.utils.fromWei(result))
            })
    }
    useEffect(() => {
        totalSupply()
    }, [])
    return (
        <div className='index-stake'>
            <ul>
                <li>
                    <p className='total-title'>Total staked</p>
                    <p className='amount-public'>123&nbsp;PI</p>
                    <p className='total-title title-bg'>PNFT mining reward (Total undistributed)</p>
                    <p className='amount-public'>456</p>
                </li>
                <li>
                    <p className='total-title'>PI staked</p>
                    <p className='amount-public'>0</p>
                    <p>
                        <button type="button">Stake</button>
                    </p>
                    <p className='total-title'>PNFT earned</p>
                    <p className='amount-public'>0</p>
                    <p>
                        <button type="button">Harvest</button>
                    </p>
                </li>
            </ul>
        </div>
    )
};

export default IndexStake;