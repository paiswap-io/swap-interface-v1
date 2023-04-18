import { message } from 'antd';
import Web3 from 'web3';
import currentProvider from 'web3'
import { ABI, PISTAKING_CONTRACT_ADDRESS, gas, gasPrice } from '../constants/home'

const { ethereum }: any = window;
interface Chain {
    chain_id: number,
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[]
}

class HomeTool {
    public web3 = new Web3(typeof window.web3 !== 'undefined' ? window.web3.currentProvider : currentProvider)
    public chainId  : number = this.web3.utils.hexToNumber(ethereum.chainId);
    /**
     * 获取全网质押PI的总数量
     * @returns {*} 全网质押PI的总数，根据精度换算之后的数值 amount
     */
    totalSupply = (pAddress: string) => {
        const PIContract = new this.web3.eth.Contract(ABI as any, pAddress);
        return new Promise((resolve, reject) => {
            PIContract.methods.getTotalSupply()
                .call()
                .then(result => {
                    resolve(this.web3.utils.fromWei(result))
                }).catch(error => {
                    console.log(error)
                    resolve('')
                })
        })
    }
    /**
     * 获取全网待挖取PI的总数量
     * @returns {*} 全网待挖取PI的总数，根据精度换算之后的数值 amount
     */
    totalBalance = (nAddress: string) => {
        const NFTContract = new this.web3.eth.Contract(ABI as any, '0x10401b9A7E93E10aC92E7bB55Ae87433B9E01e08');
        return new Promise((resolve, reject) => {
            NFTContract.methods.balanceOf(PISTAKING_CONTRACT_ADDRESS)
                .call()
                .then(result => {
                    resolve(this.web3.utils.fromWei(result))
                }).catch(error => {
                    console.log(error)
                    resolve('')
                })
        })
    }
    /**
     * 当前地址已质押总量
     * @returns {*} 当前地址已质押PI的总数，根据精度换算之后的数值 amount
     */
    stakein = (_p_address: string, _address: string) => {
        const PIContract = new this.web3.eth.Contract(ABI as any, _p_address);
        return new Promise((resolve, reject) => {
            PIContract.methods.getStaking(_address)
                .call()
                .then(result => {
                    resolve(this.web3.utils.fromWei(result))
                    console.log(this.web3.utils.fromWei(result))
                }).catch(error => {
                    resolve('')
                })
        })
    }
    /**
     * 当前地址待领取奖励总量
     * @returns {*} 当前地址待领取奖励总数，根据精度换算之后的数值 amount
     */
    pendingReward = (_p_address: string, _address: string) => {
        const PIContract = new this.web3.eth.Contract(ABI as any, _p_address);
        return new Promise((resolve, reject) => {
            PIContract.methods.pendingReward(_address)
                .call()
                .then(result => {
                    resolve(this.web3.utils.fromWei(result))
                    console.log(this.web3.utils.fromWei(result))
                }).catch(error => {
                    resolve('')
                })
        })
    }
    /**
     * 切换公链
    */
    switchChain = async (_chain_id: number) => {
        const chain_list: Chain[] = [
            //主链
            {
                chain_id: 2099156,
                chainName: 'Plian Mainnet Main',
                nativeCurrency: {
                    name: 'PI',
                    symbol: 'PI',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.plian.io/pchain'],
                blockExplorerUrls: ['https://piscan.plian.org/index.html']
            },
            //子链
            {
                chain_id: 8007736,
                chainName: 'Plian Mainnet Subchain 1',
                nativeCurrency: {
                    name: 'PI',
                    symbol: 'PI',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.plian.io/child_0'],
                blockExplorerUrls: ['https://piscan.plian.org/index.html']
            },
            //子链测试网
            {
                chain_id: 10067275,
                chainName: 'Plian-subchain1test',
                rpcUrls: ['https://testnet.plian.io/child_test'],
                blockExplorerUrls: ['https://testnet.plian.org/child_test'],
                nativeCurrency: {
                    name: 'PI',
                    symbol: 'PI',
                    decimals: 18
                }
            }
        ];
        const withChainID: any = chain_list.filter((item: Chain) => {
            return item.chain_id === _chain_id
        });
        try {
            const result = await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: this.web3.utils.toHex(_chain_id) }],
            });
            return result
        } catch (error: any) {
            const add = async () => {
                const params = [
                    {
                        chainId: this.web3.utils.toHex(_chain_id), // A 0x-prefixed hexadecimal string
                        chainName: withChainID[0].chainName,
                        nativeCurrency: {
                            name: 'PI',
                            symbol: 'PI', // 2-6 characters long
                            decimals: 18,
                        },
                        rpcUrls: withChainID[0].rpcUrls,
                        blockExplorerUrls: withChainID[0].blockExplorerUrls
                    }
                ];
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: params,
                    });
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: this.web3.utils.toHex(_chain_id) }],
                    });
                } catch (addError) {
                    // handle "add" error
                }
            }
            switch (error.code) {
                case 4902:
                    add();
                    break;
                case -32603:
                    add();
                    break;
                case -32002:
                    message.error('You have pending wallet operations');
                    break;
                case 4001:
                    message.error('You have canceled');
                    break;
                default:
                    console.log(error)
            }
            return error
        }
    }
    /**
     * 余额查询
    */
    getBalance = async (_address: string) => {
        const bal = await ethereum.request({
            method: 'eth_getBalance',
            params: [_address, 'latest']
        });
        return this.web3.utils.fromWei(bal.toString(), 'ether')
    }
    /**
     * 
     * @param _address 发送地址
     * @param _amount  质押金额
     * @returns 质押
     */
    stakin = async (_p_address:string,_address: string, _amount: number | string): Promise<number> => {
        const PIContract = new this.web3.eth.Contract(ABI as any, _p_address);
        return new Promise((resolve, reject) => {
            PIContract.methods.deposit()
                .send({
                    from: _address,
                    gas: gas,
                    gasPrice: gasPrice,
                    value: this.web3.utils.toWei(String(_amount), 'ether')
                }).then(receipt => {
                    resolve(1)
                }).catch(error => {
                    if (error.message.indexOf('50 blocks') > -1) {
                        resolve(1)
                    } else {
                        resolve(0)
                        message.error(error.message)
                    }
                })
        })
    }
    stakeOut = async (_p_address:string,_address: string, _amount: number | string): Promise<number> => {
        const PIContract = new this.web3.eth.Contract(ABI as any, _p_address);
        return new Promise((resolve, reject) => {
            PIContract.methods.withdraw(this.web3.utils.toWei(String(_amount), 'ether'))
                .send({
                    from: _address,
                    gas: gas,
                    gasPrice: gasPrice
                }).then(receipt => {
                    resolve(1)
                }).catch(error => {
                    if (error.message.indexOf('50 blocks') > -1) {
                        resolve(1)
                    } else {
                        resolve(0)
                        message.error(error.message)
                    }
                })
        })
    }
}
export default new HomeTool();