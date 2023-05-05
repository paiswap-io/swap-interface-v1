import { ChainId } from '@alex_7/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET_CHILD_0]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb', // TODO
  [ChainId.MAINNET_CHILD_1]: '0x2Fd73792247bFA04FCAb258C3eF27c0a3cB446Be', // TODO
  [ChainId.TESTNET_CHILD_0]: '0x83e404923c11b51c1cd1154f76ef9fe51dc69d0c'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
