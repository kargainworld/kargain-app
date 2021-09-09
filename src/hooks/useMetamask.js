import { useState, useEffect, useContext } from "react"
import { useWeb3React } from "@web3-react/core"
import UsersService from '../services/UsersService'
import { injected } from "../connectors"
import { MessageContext } from "../context/MessageContext"
import { useAuth } from "../context/AuthProvider"

export function useEagerConnect() {
    const { activate, active, account } = useWeb3React()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const [tried, setTried] = useState(false)
    const { authenticatedUser } = useAuth()

    useEffect(() => {
        if (!authenticatedUser || !account)
            return
        console.log(account)

        injected.isAuthorized().then(isAuthorized => {
            if (isAuthorized) {
                let user = {}
                user.wallet = account
                user.email = authenticatedUser.raw.email
                UsersService.updateUser(user)
                    .then((response) => {
                    }).catch(err => {
                        dispatchModalError({ err })
                    })
                activate(injected, undefined, true).catch(() => {
                    setTried(true)
                })
            } else {
                setTried(true)
            }
        })
    }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }
    }, [tried, active])

    return tried
}

export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3React()

    useEffect(() => {
        const { ethereum } = window
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = chainId => {
                console.log("chainChanged", chainId)
                activate(injected)
            }

            const handleAccountsChanged = accounts => {
                console.log("accountsChanged", accounts)
                if (accounts.length > 0) {
                    activate(injected)
                }
            }

            const handleNetworkChanged = networkId => {
                console.log("networkChanged", networkId)
                activate(injected)
            }

            ethereum.on("chainChanged", handleChainChanged)
            ethereum.on("accountsChanged", handleAccountsChanged)
            ethereum.on("networkChanged", handleNetworkChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("chainChanged", handleChainChanged)
                    ethereum.removeListener("accountsChanged", handleAccountsChanged)
                    ethereum.removeListener("networkChanged", handleNetworkChanged)
                }
            }
        }

        return () => {}
    }, [active, error, suppress, activate])
}
