import { InjectedConnector } from "@web3-react/injected-connector"


const rospten = 3
const mainnet = 1
const smartChainGanache = 1337

export const injected = new InjectedConnector({
    supportedChainIds: process.env.NODE_ENV === 'development' ? [rospten] : [mainnet, smartChainGanache]
    //supportedChainIds: process.env.NODE_ENV === 'production' ? [smartChain] : [smartChainTestnet]
})

