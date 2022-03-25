import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'reactstrap'
import Alert from '@material-ui/lab/Alert'

import makeStyles from '@material-ui/core/styles/makeStyles'
import useTranslation from 'next-translate/useTranslation'
import TagsList from 'components/Tags/TagsList'
import AnnounceService from 'services/AnnounceService'
import AnnounceModel from 'models/announce.model'
// import { MessageContext } from 'context/MessageContext'
import { useAuth } from 'context/AuthProvider'
import ErrorPage from '../../_error'
import useKargainContract from 'hooks/useKargainContract'
import TextField from '@material-ui/core/TextField'
import usePriceTracker from 'hooks/usePriceTracker'
import Box from '@material-ui/core/Box'
// import { injected } from "connectors"
import UsersService from 'services/UsersService'
import MakeOffer from 'components/Blockchain/MakeOffer'
import HandleOffer from 'components/Blockchain/HandleOffer'

import TransactionsService from 'services/TransactionsService'
import CarInformation from 'components/AnnounceCard/CarInformation'
import EditLikeAndComments from 'components/AnnounceCard/EditLikeAndComments'
import VehicleEquipments from 'components/AnnounceCard/VehicleEquipments'
import SharedURL from 'components/AnnounceCard/SharedURL'
import { useWeb3Modal } from 'context/Web3Context'
import { useMessage } from '../../../context/MessageContext'

const useStyles = makeStyles(() => ({
    mintButton: {
        display: 'flex !important',
        height: '50px',
        width: '100%',
        marginLeft: '10px',
        justifyContent: 'center !important',
        alignItems: 'center !important',
        padding: '6px 50px !important',
        background: '#2C65F6 !important',
        borderRadius: '25px !important',
        fontWeight: 'bold !important',
        fontSize: '14px !important',
        lineHeight: '150% !important',
        color: 'white !important'
    },
    textFieldMint: {
    }
}))

const Announce = () => {
    const { web3: library, chainId, account  } = useWeb3Modal()
    const classes = useStyles()
    const router = useRouter()
    const { slug } = router.query
    const { t } = useTranslation()
    const { authenticatedUser } = useAuth()
    const { dispatchModal } = useMessage()
    const { getPriceTracker } = usePriceTracker()
    const [priceBNB, setPrice] = useState(0)
    const [bnbBalance, setBalance] = useState()
    const [walletPayer, setWalletPayer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tokenPrice, setTokenPrice] = useState('')
    const [error, setError] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const [isMinted, setIsMinted] = useState(false)
    const [state, setState] = useState({
        err: null,
        stateReady: false,
        isSelf: false,
        isAdmin: false,
        announce: new AnnounceModel()
    })
    const [tried, setTried] = useState(false)

    const tokenPriceInEuros = useMemo(() => {
        return (+tokenPrice * priceBNB).toFixed(2)
    }, [tokenPrice, priceBNB])

    const {
        fetchTokenPrice,
        mintToken,
        updateTokenPrince,
        isContractReady,
        watchOfferEvent,
        waitTransactionToBeConfirmed
    } = useKargainContract()

    useEffect(() => {
        if (!state.stateReady) return
        if (!state?.announce?.getID) return

        const action = async () => {
            const transactions = await TransactionsService.getTransactionsByAnnounceId(state?.announce?.getID)
            setTransactions(transactions)
        }

        action()
    }, [state, transactions?.length])

    useEffect(() => {
        if (!state?.announce?.getID) return

        const action = async () => {
            const transactionsPending = transactions.filter((x) => x.status === 'Pending')
            console.log('transactionsPending', transactionsPending)

            for (const tx of transactionsPending) {
                try {
                    await waitTransactionToBeConfirmed(tx.hashTx)
                    const newTx = await TransactionsService.updateTransaction(state?.announce?.getID, {
                        hashTx: tx.hashTx,
                        status: 'Approved'
                    })

                    setTransactions((prev) => {
                        const result = prev.filter((x) => x.hashTx === tx.hashTx)
                        result.push(newTx)
                        return result
                    })
                } catch (error) {
                    const newTx = await TransactionsService.updateTransaction(state?.announce?.getID, {
                        hashTx: tx.hashTx,
                        status: 'Rejected'
                    })
                    setTransactions((prev) => {
                        const result = prev.filter((x) => x.hashTx === tx.hashTx)
                        result.push(newTx)
                        return result
                    })
                }
            }
        }
        action()
    }, [state, transactions, waitTransactionToBeConfirmed])

    const fetchProfile = useCallback(async () => {
        if (!isContractReady || !walletPayer) return

        try {
            return await UsersService.getUsernameByWallet(walletPayer)
        } catch (e) {
            console.log(e)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletPayer, isContractReady, isContractReady])

    const fetchAnnounce = useCallback(async () => {
        try {
            const result = await AnnounceService.getAnnounceBySlug(slug)
            console.log(result)
            const { announce, isAdmin, isSelf } = result
            const newAnnounce = new AnnounceModel(announce)
            const transactions = await TransactionsService.getTransactionsByAnnounceId(newAnnounce.getID)

            setTransactions(transactions)
            setState((state) => ({
                ...state,
                stateReady: true,
                announce: newAnnounce,
                isAdmin,
                isSelf
            }))
        } catch (err) {
            setState((state) => ({
                ...state,
                stateReady: true,
                err
            }))
        }
    }, [slug])

    useEffect(() => {
        if (!isContractReady || !state?.announce.getTokenId) return

        const handleOfferReceived = async () => {
            try {
                const data = await watchOfferEvent(state?.announce.getTokenId)
                console.log(data)
                setWalletPayer(data)
            } catch (error) {
                setError(error)
            }
        }

        handleOfferReceived()
    }, [isContractReady, state?.announce, watchOfferEvent])

    useEffect(() => {
        console.log(walletPayer)
        if (!isContractReady) return

        fetchAnnounce()
        if (walletPayer) {
            fetchProfile()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAnnounce, fetchProfile])

    useEffect(() => {
        if (!state.stateReady) return

        setIsLoading(true)
        getPriceTracker().then((price) => {
            setPrice(price.quotes.EUR.price)
        })

        if (tokenMinted && offerAccepted.length === 0) {
            setTokenPrice(tokenMinted.data)
            setIsLoading(false)
            setIsMinted(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, fetchTokenPrice])

    useEffect(() => {
        if (!tried && !!account) {
            setTried(true)
        }
    }, [tried, account])

    const [transactions, setTransactions] = useState([])

    const transactionsOrdered = transactions.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const tokenMinted = transactionsOrdered.find((x) => x.action === 'TokenMinted')

    const offerAccepted = transactionsOrdered.filter((x) => x.action === 'OfferAccepted')
    const offerRejected = transactionsOrdered.filter((x) => x.action === 'OfferRejected')

    const newOfferCreated = transactionsOrdered.find(
        (x) =>
            x.action === 'OfferCreated' &&
      !offerAccepted.some((y) => y.data === x.hashTx && ['Approved', 'Pending'].includes(y.status)) &&
      !offerRejected.some((y) => y.data === x.hashTx && ['Approved', 'Pending'].includes(y.status))
    )

    const handleApplyPriceChange = async () => {
        const tokenId = state?.announce?.getTokenId
        const announceId = state?.announce?.getID

        setIsConfirmed(false)
        setError(null)

        try {
            const task = !isMinted ? mintToken(tokenId, +tokenPrice) : updateTokenPrince(tokenId, +tokenPrice)

            const hashTx = await task
            const result = await TransactionsService.addTransaction({
                announceId,
                hashTx,
                data: tokenPrice,
                action: 'TokenMinted'
            })
            setTransactions((prev) => [...prev, result])
            await waitTransactionToBeConfirmed(hashTx)
            setIsConfirmed(true)
            setIsMinted(true)
            dispatchModal({ msg: t('vehicles:tokenPriceConfirmed') })
        } catch (error) {
            console.error(error)
            setError(error)
            setIsConfirmed(true)
        }
    }

    useEffect(() => {
        if (!isContractReady) return

        if (!!account && !!library) {
            let stale = false

            library.eth
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        let ethBalance = library.utils.fromWei(balance, 'ether')
                        setBalance(ethBalance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(null)
                    }
                })

            return () => {
                stale = true
                setBalance(undefined)
            }
        }
    }, [account, library, chainId, isContractReady]) //

    const isOwn = useMemo(() => {
        return authenticatedUser?.raw?._id === state?.announce?.raw?.user?._id
    }, [authenticatedUser, state])
    
    if (!state.stateReady) return null
    if (state.err) {
        return ErrorPage({ statusCode: state.err?.statusCode })
    }

    return (
        <Container>
            <NextSeo title={`${state?.announce?.getTitle} - Kargain`} description={state?.announce?.getTheExcerpt()} />

            {state.isAdmin && (
                <Alert severity="info" className="mb-2">
                    Connected as Admin
                </Alert>
            )}

            <div className="objava-wrapper">
                <Row>
                    <CarInformation announce={state.announce} />
                    <Col sm={12} md={6}>
                        <div style={{ marginTop: '25px' }}>
                            <SharedURL announce={state.announce} />
                            <div style={{ width: '100%', marginTop: '10px' }}>
                                <Box mb={2} display="flex" flexDirection="row">
                                    <Col sm={3}>
                                        <Row style={{ marginTop: '10px' }}>
                                            <h4 key={`price-${tokenPriceInEuros}`}>€ {tokenPriceInEuros}</h4>
                                        </Row>
                                    </Col>
                                    {isOwn && isMinted && newOfferCreated && newOfferCreated.status === 'Pending' && (
                                        <div>offer pending, wait a few minutes to be confirmed.</div>
                                    )}

                                    {isOwn && isMinted && newOfferCreated && newOfferCreated.status === 'Approved' && (
                                        <HandleOffer newOfferCreated={newOfferCreated} announce={state.announce} tokenPrice={tokenPrice} />
                                    )}
                                </Box>
                                <div>
                                    <p style={{ fontStyle: 'normal', fontWeight: '500', fontSize: '14px', lineHeight: '150%' }}>#1212</p>
                                </div>
                            </div>
                        </div>

                        <TagsList tags={state?.announce?.getTags} />

                        <EditLikeAndComments announce={state.announce} />

                        {!isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet && (
                            <MakeOffer tokenPrice={tokenPrice} announce={state.announce} bnbBalance={bnbBalance} />
                        )}

                        {isOwn && (
                            <div className="icons-profile-wrapper">
                                {!isLoading && (
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                                            <div style={{ fontSize: '12px', color: '#999999', marginBottom: '5px' }}>
                                                {t('vehicles:tokenPrice')} :{' '}
                                            </div>
                                            <TextField
                                                className={clsx(classes.textFieldMint)}
                                                onChange={(event) => setTokenPrice(event.target.value)}
                                                value={tokenPrice}
                                                type="number"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!error}
                                                helperText={error ? error.message : !isConfirmed && t('vehicles:waitingConfirmation')}
                                                disabled={!isConfirmed || !account}
                                                variant="outlined"
                                            />
                                        </div>
                                        <div style={{ marginTop: '20px', alignSelf: 'center', width: '50%' }}>
                                            <button
                                                className={clsx(classes.mintButton)}
                                                disabled={!isConfirmed || !tokenPrice || !account}
                                                onClick={handleApplyPriceChange}
                                            >
                                                {isMinted ? t('vehicles:save') : t('vehicles:mint')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Col>
                </Row>
                <VehicleEquipments announce={state.announce} />
            </div>
        </Container>
    )
}

export default Announce
