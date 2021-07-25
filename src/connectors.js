import { InjectedConnector } from "@web3-react/injected-connector"



export const injected = new InjectedConnector({
    supportedChainIds: process.env.NODE_ENV === 'production' ? [97] : [97]
    //supportedChainIds: process.env.NODE_ENV === 'production' ? [56] : [97]
})

