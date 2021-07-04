import { useCallback, useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import useLocalStorage from './useLocalStorage'

const useWallet = () => {
    const [provider, setProvider] = useState(null)
    const [store, setAccount] = useLocalStorage("walletAccount", {})

    const handleAccountChange = useCallback((accounts) => {
        if (accounts.length > 0 && accounts[0] !== store.account) {
            setAccount({ account: accounts[0] })
        }
    }, [store.account, setAccount])

    useEffect(() => {
        const action = async () => {
            const provider = await detectEthereumProvider()
            if (provider && provider.isConnected()) {
                setProvider(provider)
            }
        }
        action()
    }, [setProvider])

    useEffect(() => {
        if (provider) {
            provider.on('accountsChanged', handleAccountChange)
            provider.on('chainChanged', () => {
                window.location.reload()
            })
        }

    }, [provider, handleAccountChange])

    const connect = async () => {
        try {
            const accounts = await provider
                .request({ method: 'eth_requestAccounts' })

            handleAccountChange(accounts)
        } catch (error) {
            // TODO: handle this error, we need to show a message to the user
            // 1. Must have a wallet installed
            // 2. Must accept the connection request
            console.error(error)
        }
    }

    return [provider, store.account, connect]
}

export default useWallet