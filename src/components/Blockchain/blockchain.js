/* eslint-disable semi */
import * as React from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Button } from '@material-ui/core'

import { injected } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks/useBlockchain'
import { Spinner } from '../Spinner'

const connectorsByName = {
    Metamask: injected
}

function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network."
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
    ) {
        return 'Please authorize this website to access your Ethereum account.'
    } else {
        console.error(error)
        return 'An unknown error occurred. Check the console for more details.'
    }
}

const Blockchain = () => {
    const context = useWeb3React()
    const { connector, library, chainId, account, activate, deactivate, active, error } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = React.useState()
    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div
                style={error ? {
                    display: 'grid',
                    gridGap: '1rem',
                    gridTemplateColumns: '1fr 1fr',
                    maxWidth: '20rem',
                    margin: 'auto'
                } : undefined}
            >
                {Object.keys(connectorsByName).map((name) => {
                    const currentConnector = connectorsByName[name]
                    const activating = currentConnector === activatingConnector
                    const connected = currentConnector === connector
                    const disabled = !triedEager || !!activatingConnector || connected || !!error

                    return (
                        <Button
                            variant="contained"
                            key={name}
                            onClick={() => {
                                if (!connected) {
                                    setActivatingConnector(currentConnector)
                                    activate(connectorsByName[name])
                                } else {
                                    deactivate()
                                }
                            }}
                        >
                            {activating ? (
                                <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />
                            ) : (
                                <>
                                    <img
                                        src={'/images/svg/MetaMask_Fox.svg'}
                                        style={{ width: '24px', marginRight: '5px' }}
                                        alt="metamask"
                                    />

                                    {name}
                                    <div style={{ marginLeft: '10px' }}>
                                        <span role="img" aria-label="check">
                                            {connected && active ? '🟢' : error ? '🔴' : '🟠'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </Button>
                    )
                })}
                {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
            </div>
        </div>
    )
};

export default Blockchain
