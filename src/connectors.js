import { InjectedConnector } from "@web3-react/injected-connector"

const smartChain = 56
const smartChainTestnet = 97

export const injected = new InjectedConnector({
    supportedChainIds: process.env.NODE_ENV === 'production' ? [smartChainTestnet] : [smartChainTestnet]
    //supportedChainIds: process.env.NODE_ENV === 'production' ? [smartChain] : [smartChainTestnet]
})

