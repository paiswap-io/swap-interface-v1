import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { message, Modal, Spin } from 'antd'
import { useWeb3React } from "@web3-react/core";
import HomeTool from '../../../utils/index_c'

interface Props {
    visible: boolean,
    onClose: (val: boolean) => void,
    type: number,
    staked: number,
    earned: number,
    pAddress:string,
    nAddress:string,
    reload: () => void
}

const OperModal = (props: Props): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(false);
    const [active, setActive] = useState<number>(1);
    const { account } = useWeb3React();
    const [balance, setBalance] = useState<number | string>('');
    const [take, setTake] = useState<number | string>('');
    const [wait, setWait] = useState<{ oper: boolean, balance: boolean }>({
        oper: false,
        balance: false
    })
    const getBalance = async () => {
        setWait({
            ...wait,
            balance: true
        })
        const result = await HomeTool.getBalance(account as string);
        setBalance(result)
        setWait({
            ...wait,
            balance: false
        })
    };
    useEffect(() => {
        props.visible && getBalance()
        setVisible(props.visible);
        setTake(props.visible ? props.staked : 0)
    }, [props.visible]);
    const [stakeInp, setStakeInp] = useState<number | string>('');
    const closeModal = () => {
        setVisible(false);
        props.onClose(false);
        setTake(0);
        setStakeInp('')
    };
    //质押
    const submitStake = async () => {
        if (!stakeInp) {
            message.error('Please enter the amount');
            return
        };
        if (+stakeInp > +balance) {
            message.error('Insufficient balance');
            return
        };
        setWait({
            ...wait,
            oper: true
        });
        const result = await HomeTool.stakin(props.pAddress,account as string, stakeInp);
        const success = () => {
            message.success('Pledge successful');
            props.reload();
            closeModal();
        }
        result === 1 && success();
        setWait({
            ...wait,
            oper: false
        });
    };
    const Stake = (): ReactElement => {
        return (
            <div className="stake-modal">
                <div className="inp-box">
                    <p className="inp-lable">Stake amount</p>
                    <div className="inp-content">
                        <div className="max-btn" onClick={() => {
                            setStakeInp(balance)
                        }}>MAX</div>
                        <input type="number" value={stakeInp} onChange={(e) => {
                            setStakeInp(e.target.value)
                        }} placeholder="Please enter the amount" />
                        <p className="inp-uint">PI</p>
                    </div>
                </div>
                <div className="balance-text">
                    <p>Balance available</p>
                    <div className="balance-i">{!wait.balance ? balance : <Spin size="small" />}&nbsp;PI</div>
                </div>
                <div className="submit-btn">
                    <button disabled={wait.oper} onClick={() => {
                        submitStake()
                    }}>{wait.oper ? <Spin /> : 'Stake'}</button>
                </div>
            </div>
        )
    };
    //领取奖励 & 取消质押
    const submitUnStake = async () => {
        if(!take){
            message.error('Please enter the amount');
            return
        };
        if(+take > props.staked){
            message.error('Insufficient pledge proficiency');
            return
        };
        setWait({
            ...wait,
            oper: true
        });
        const result = await HomeTool.stakeOut(props.pAddress,account as string, take);
        const success = () => {
            message.success('Pledge successful');
            props.reload();
            closeModal();
        }
        result === 1 && success();
        setWait({
            ...wait,
            oper: false
        });
    }
    const Harvest = (): ReactElement => {
        return (
            <div className="harvest-modal">
                <div className="public-inp">
                    <p className="inp-lable">Staked</p>
                    <div className="inp-box">
                        <input type="number" value={take} onChange={(e) => {
                            setTake(+e.target.value)
                        }} placeholder={`Max:${props.staked}`} />
                        <p>PI</p>
                    </div>
                </div>
                <div className="public-inp">
                    <p className="inp-lable">Earned</p>
                    <div className="inp-box">
                        <input type="number" value={props.earned} onChange={() => {

                        }} readOnly placeholder="Max:0" />
                        <p>PNFT</p>
                    </div>
                </div>
                <p className="submit-btn">
                    <button disabled={wait.oper} onClick={() => {
                        submitUnStake()
                    }}>{wait.oper ? <Spin size="small"/> : 'Unstake & harvest'}</button>
                </p>
            </div>
        )
    };
    return (
        <div className="oper-modal">
            <Modal visible={visible} confirmLoading={false} width={600} onCancel={() => {
                closeModal()
            }} maskClosable title={null} closable={false} footer={null}>
                <div className="stake-inner">
                    <div className="modal-tab">
                        <ul>
                            {
                                ['Stake', 'Harvest'].map((item: string, index: number) => {
                                    return (
                                        <li key={index} onClick={() => {
                                            setActive(item === 'Stake' ? 1 : 2)
                                        }} className={`${active === (index + 1) ? 'active-tab' : ''}`}>
                                            {item}
                                            <span className="active-line"></span>
                                        </li>
                                    )
                                })
                            }
                            <li onClick={() => {
                                closeModal()
                            }}><CloseOutlined /></li>
                        </ul>
                    </div>
                    <div className="modal-content-mine">
                        {
                            active === 1 ? Stake() : Harvest()
                        }
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default OperModal;