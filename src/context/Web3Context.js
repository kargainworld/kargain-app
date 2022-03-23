import React, { useReducer, createContext, useContext, useEffect, useState } from 'react'

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Portis from '@portis/web3'
import Fortmatic from 'fortmatic'
import Web3 from 'web3'

import ModalNetwork from '../components/ModalNetwork'
import { getNetwork } from 'libs/utils'


import { useAuth } from './AuthProvider'

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: 'de98845889164596b64d51908b361ce2' // required
        }
    },
    fortmatic: {
        package: Fortmatic, // required
        options: {
            key: 'pk_live_BD5D4B8351A4F63A' // required
        }
    },
    portis: {
        package: Portis, // required
        options: {
            id: 'd29d2427-0c9b-4b6e-bcde-799f6fd0e833' // required
        }
    }
}

const initialState = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
    balance: null,
    web3: null
}

const Web3Context = createContext(initialState)

function reducer(state, action) {
    switch (action.type) {
    case 'SET_WEB3_PROVIDER':
        return {
            ...state,
            web3: action.web3,
            chainId: action.chainId,
            provider: action.provider,
            address: action.address,
            balance: action.balance,
            networkId: action.networkId
        }
    case 'SET_ADDRESS':
        return {
            ...state,
            address: action.address
        }
    case 'SET_CHAIN_ID':
        return {
            ...state,
            chainId: action.chainId
        }
    case 'RESET_WEB3_PROVIDER':
        return initialState
    case 'SET_CONNECT':
        return {
            ...state,
            active: action.active
        }
    default:
        throw new Error()
    }
}

function initWeb3(provider) {
    const web3 = new Web3(provider)

    web3.eth.extend({
        methods: [
            {
                name: 'chainId',
                call: 'eth_chainId',
                outputFormatter: web3.utils.hexToNumber
            }
        ]
    })

    return web3
}

export const Web3ContextProvider = ({ children }) => {
    let web3Modal
    if (typeof window !== 'undefined') {
        web3Modal = new Web3Modal({
            network: getNetwork(), // optional
            cacheProvider: true,
            providerOptions // required
        })
    }

    const [open, setOpen] = useState(false)
    const { logout } = useAuth()
    const [state, dispatch] = useReducer(reducer, initialState)

    const { provider, address, chainId, active, balance, web3 } = state
    
    const connect = async function () {
        console.log('Connecting...')
        const provider = await web3Modal.connect()
        await provider.enable()

        const web3 = initWeb3(provider)
        const accounts = await web3.eth.getAccounts()
        const address = accounts[0]

        const networkId = await web3.eth.net.getId()
        const chainId = await web3.eth.getChainId()

        dispatch({
            type: 'SET_WEB3_PROVIDER',
            provider: provider,
            chainId: chainId,
            address: address,
            balance: '0.00',
            web3: web3,
            networkId
        })

        return { chainId, wallet: address }
    }

    useEffect(() => {
        if (chainId && chainId !== Number(process.env.NEXT_PUBLIC_MAIN_CHAIN_ID)) {
            setOpen(true)
        }
    }, [chainId])

    const handleDisconnect = async () => {
        setOpen(false)
        logout()
        disconnect()
    }

    const disconnect = async function () {
        await web3Modal.clearCachedProvider()
        if (provider?.disconnect && typeof provider.disconnect === 'function') {
            await provider.disconnect()
        }
        dispatch({
            type: 'RESET_WEB3_PROVIDER'
        })
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connect()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts) => {
                // eslint-disable-next-line no-console
                console.log('accountsChanged', accounts)
                dispatch({
                    type: 'SET_ADDRESS',
                    address: accounts[0]
                })
            }

            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = (_hexChainId) => {
                if (_hexChainId !== process.env.MAIN_CHAIN_ID) {
                    setOpen(true)
                }
            }

            const handleDisconnect = (error) => {
                // eslint-disable-next-line no-console
                console.log('disconnect', error)
                handleDisconnect()
            }

            const handleConnect = () => {
                console.log('Connected')
                dispatch({
                    type: 'SET_CONNECT',
                    active: true
                })
            }

            provider.on('accountsChanged', handleAccountsChanged)
            provider.on('chainChanged', handleChainChanged)
            provider.on('disconnect', handleDisconnect)
            provider.on('connected', handleConnect)

            // Subscription Cleanup
            return () => {
                if (provider.removeListener) {
                    provider.removeListener('accountsChanged', handleAccountsChanged)
                    provider.removeListener('chainChanged', handleChainChanged)
                    provider.removeListener('disconnect', handleDisconnect)
                    provider.removeListener('connected', handleConnect)
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider])

    return (
        <Web3Context.Provider
            value={{
                address,
                provider,
                chainId,
                connect,
                disconnect,
                active,
                web3,
                balance
            }}
        >
            <ModalNetwork open={open} handleClose={handleDisconnect} />
            {children}
        </Web3Context.Provider>
    )
}

export const useWeb3Modal = () => {
    const context = useContext(Web3Context)
    if (context === undefined) {
        throw new Error('web3Context must be used within an Web3Provider')
    }
    return context
}
