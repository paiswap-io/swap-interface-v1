import Web3 from 'web3'
import { ABI, PNFT_CONTRACT_ADDRESS, PISTAKING_CONTRACT_ADDRESS, gas, gasPrice } from '../constants/home'

const { ethereum }: any = window;

class HomeTool {

    private web3 = new Web3(typeof window.web3 !== 'undefined' ? window.web3.currentProvider : '')

    private PIContract = new this.web3.eth.Contract(ABI as any, PISTAKING_CONTRACT_ADDRESS)

    private NFTContract = new this.web3.eth.Contract(ABI as any, PNFT_CONTRACT_ADDRESS)
   
    /**
     * 获取全网质押PI的总数量
     * @returns {*} 全网质押PI的总数，根据精度换算之后的数值 amount
     */
    totalSupply = () => {
        return new Promise((resolve, reject) => {
            this.PIContract.methods.getTotalSupply()
                .call()
                .then(result => {
                    resolve(this.web3.utils.fromWei(result))
                }).catch(error => {
                    resolve('')
                })
        })
    }

    /**
     * 获取全网待挖取PI的总数量
     * @returns {*} 全网待挖取PI的总数，根据精度换算之后的数值 amount
     */
    totalBalance = () => {
        return new Promise((resolve, reject) => {
            this.NFTContract.methods.balanceOf(PISTAKING_CONTRACT_ADDRESS)
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
    stakein = (_address: string) => {
        return new Promise((resolve, reject) => {
            this.PIContract.methods.getStaking(_address)
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
    pendingReward = (_address: string) => {
        return new Promise((resolve, reject) => {
            this.PIContract.methods.pendingReward(_address)
                .call()
                .then(result => {
                    resolve(this.web3.utils.fromWei(result))
                    console.log(this.web3.utils.fromWei(result))
                }).catch(error => {
                    resolve('')
                })
        })
    }
}

export default new HomeTool();