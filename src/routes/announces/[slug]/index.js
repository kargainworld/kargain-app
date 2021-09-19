import React, { useCallback, useContext, useEffect,  useState } from 'react'
import clsx from 'clsx'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'reactstrap'
import Alert from '@material-ui/lab/Alert'
import { useWeb3React } from "@web3-react/core"
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTranslation from 'next-translate/useTranslation'
import TagsList from '../../../components/Tags/TagsList'
import AnnounceService from '../../../services/AnnounceService'
import AnnounceModel from '../../../models/announce.model'
import { MessageContext } from '../../../context/MessageContext'
import { ModalContext } from '../../../context/ModalContext'
import { useAuth } from '../../../context/AuthProvider'
import { getTimeAgo } from '../../../libs/utils'
import Error from '../../_error'
import useKargainContract from 'hooks/useKargainContract'
import TextField from '@material-ui/core/TextField'
import usePriceTracker from 'hooks/usePriceTracker'
import Box from '@material-ui/core/Box'
import { injected } from "../../../connectors"
import UsersService from '../../../services/UsersService'
import MakeOffer from "../../../components/Blockchain/MakeOffer"
import HandleOffer from "../../../components/Blockchain/HandleOffer"
import Web3 from "web3"
import TransactionsService from '../../../services/TransactionsService'
import CarInformation from "../../../components/AnnounceCard/CarInformation"
import EditLikeAndComments from "../../../components/AnnounceCard/EditLikeAndComments"
import VehicleEquipments from "../../../components/AnnounceCard/VehicleEquipments"


const useStyles = makeStyles(() => ({
    priceStarsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: '15px 0',
        borderBottom: '1px solid #999999'
    },
    textfield:{
        '& .MuiInputBase-root':{
            height:'40px'
        },
        '& input:disabled': {
            backgroundColor: '#d5d8db',
            height: '5px'
        }
    }
}))

const Announce = () => {
    const { library, chainId, account, activate, active } = useWeb3React()
    const classes = useStyles()
    const router = useRouter()
    const { slug } = router.query
    const { t, lang } = useTranslation()
    const { isAuthenticated, authenticatedUser } = useAuth()
    const { dispatchModal } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const { getPriceTracker } = usePriceTracker()
    const [priceBNB, setPrice] = useState(0)
    const [bnbBalance, setBalance] = useState()
    const [walletPayer, setWalletPayer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tokenPrice, setTokenPrice] = useState(null)
    const [error, setError] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const [isMinted, setIsMinted] = useState(false)
    const tokenPriceInEuros = (+tokenPrice * priceBNB).toFixed(2)


    const web3 = new Web3(Web3.givenProvider)
    const {
        fetchTokenPrice,
        mintToken,
        updateTokenPrince,
        isContractReady,
        watchOfferEvent,
        waitTransactionToBeConfirmed
    } = useKargainContract()

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).then(() =>{
                }).catch((err) => {
                    console.log("err", err)
                    setTried(true)
                })
            } else {
                setTried(true)
            }
        })
    }, [])

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
            const transactionsPending = transactions.filter(x=>x.status === "Pending")
            console.log("transactionsPending", transactionsPending)

            for (const tx of transactionsPending) {
                try {
                    await waitTransactionToBeConfirmed(tx.hashTx)
                    const newTx = await TransactionsService.updateTransaction(state?.announce?.getID, { hashTx:tx.hashTx, status: "Approved" })

                    setTransactions(prev => {
                        const result = prev.filter(x=>x.hashTx === tx.hashTx)
                        result.push(newTx)
                        return result
                    })

                } catch (error) {
                    const newTx = await TransactionsService.updateTransaction(state?.announce?.getID, { hashTx:tx.hashTx, status: "Rejected" })
                    setTransactions(prev => {
                        const result = prev.filter(x=>x.hashTx === tx.hashTx)
                        result.push(newTx)
                        return result
                    })
                }
            }
        }
        action()

    }, [state, transactions, waitTransactionToBeConfirmed])


    const fetchProfile = useCallback(async () => {
        if (!isContractReady || !walletPayer)
            return

        try {
            const result = await UsersService.getUsernameByWallet(walletPayer)
            return result
        }
        catch (e) {
            console.log(e)
        }

    },[walletPayer, isContractReady, isContractReady])


    const [state, setState] = useState({
        err: null,
        stateReady: false,
        isSelf: false,
        isAdmin: false,
        announce: new AnnounceModel()
    })

    const [tried, setTried] = useState(false)

    const fetchAnnounce = useCallback(async () => {
        try {
            const result = await AnnounceService.getAnnounceBySlug(slug)
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
        if (!isContractReady || !state?.announce.getTokenId)
            return

        const handleOfferReceived = async () => {
            try {
                const data = await watchOfferEvent(state?.announce.getTokenId)
                setWalletPayer(data)
            } catch (error) {
                setError(error)
            }
        }

        handleOfferReceived()
    }, [isContractReady, state?.announce, watchOfferEvent])

    useEffect(() => {
        if (!isContractReady || !state?.announce.getTokenId)
            return

        fetchAnnounce()
        if (walletPayer) {
            fetchProfile()
        }
    }, [fetchAnnounce, fetchProfile])



    useEffect(() => {
        if (!state.stateReady) return

        setIsLoading(true)

        const tokenId = state.announce.getTokenId
        getPriceTracker().then((price) => {
            setPrice(price.quotes.EUR.price)
        })

        fetchTokenPrice(tokenId)
            .then((price) => {
                setTokenPrice(price)
                setIsLoading(false)
                setIsMinted(price ? true : false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }, [state, fetchTokenPrice])

    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }

    }, [tried, active])

    const [transactions, setTransactions] = useState([])

    const transactionsOrdered = transactions.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const tokenMinted = transactionsOrdered
        .find(x => x.action === "TokenMinted")

    const offerAccepted = transactionsOrdered
        .filter(x => x.action === "OfferAccepted")
    const offerRejected = transactionsOrdered
        .filter(x => x.action === "OfferRejected")

    const newOfferCreated = transactionsOrdered
        .find(x =>
            x.action === "OfferCreated" &&
            !offerAccepted.some(y=>y.data === x.hashTx && ['Approved', 'Pending'].includes(y.status)) &&
            !offerRejected.some(y=>y.data === x.hashTx && ['Approved', 'Pending'].includes(y.status))
        )

    console.log({
        tokenMinted,
        newOfferCreated,
        offerAccepted,
        offerRejected,
        transactions
    })

    const handleApplyPriceChange = async () => {
        const tokenId = state?.announce?.getTokenId
        const announceId = state?.announce?.getID

        setIsConfirmed(false)
        setError(null)

        try {
            const task = !isMinted ?
                mintToken(tokenId, +tokenPrice) :
                updateTokenPrince(tokenId, +tokenPrice)

            const hashTx = await task
            const result = await TransactionsService.addTransaction({ announceId, hashTx, data: tokenPrice, action: "TokenMinted" })
            setTransactions(prev => [...prev, result])
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
        if (!isContractReady)
            return

        if (!!account && !!library) {
            let stale = false

            web3.eth
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        let ethBalance = web3.utils.fromWei(balance, 'ether')
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

    const isOwn = authenticatedUser?.raw?._id === state?.announce?.raw?.user?._id

    if (!state.stateReady) return null
    if (state.err) return <Error statusCode={state.err?.statusCode} />

    console.log("pererere", !isOwn && isMinted && !newOfferCreated && authenticatedUser.getWallet)

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
                        <div style={{ marginTop:'25px' }}>
                            <Typography as="h2" variant="h2" style={{ fontWeight: '500', fontSize: '24px', lineHeight: '150%' }}>
                                {state?.announce?.getAnnounceTitle}
                            </Typography>
                            <div  style={{ width: '100%',marginTop:'10px' }}>
                                <Box mb={2} display="flex" flexDirection="row-reverse">
                                    <Col sm={3}
                                        className="icons-star-prof"
                                        onClick={() =>
                                            dispatchModalState({
                                                openModalShare: true,
                                                modalShareAnnounce: state?.announce
                                            })
                                        }
                                        style={{ display:'flex', justifyContent: 'flex-end' }}
                                    >
                                        <small className="mx-3" style={{ fontSize:'16px' }}> {getTimeAgo(state?.announce?.getCreationDate.raw, lang)}</small>
                                        <img src="/images/share.png" alt="" />
                                    </Col>
                                </Box>
                            </div>
                            <div  style={{ width: '100%',marginTop:'10px' }}>
                                <Box mb={2} display="flex" flexDirection="row">

                                    <Col sm={3}>
                                        <Row style={{ marginTop:'10px' }}>
                                            <h4 key={`price-${tokenPriceInEuros}`}>€ {tokenPriceInEuros}</h4>
                                        </Row>
                                    </Col>
                                    {isOwn && isMinted && newOfferCreated && newOfferCreated.status === "Pending" && <div>offer pending, wait a few minutes to be confirmed.</div>}
                                    
                                    {isOwn && isMinted && newOfferCreated && newOfferCreated.status === "Approved" && (
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


                        {(isOwn) && (
                            <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)} style={{ borderBottom: '1px solid #ffffff' }}>
                                <div className="icons-profile-wrapper">

                                    {!isLoading && (
                                        <div style={{ display: "flex", gap: 5 }}>
                                            <TextField
                                                label={t('vehicles:tokenPrice')}
                                                onChange={(event) => setTokenPrice(event.target.value)}
                                                value={tokenPrice}
                                                type="number"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!error}
                                                helperText={error ? error.message : (!isConfirmed && t('vehicles:waitingConfirmation'))}
                                                disabled={!isConfirmed || !active}
                                                variant="outlined"
                                            />
                                            <button style={{ height:'55px' }} disabled={!isConfirmed || !tokenPrice || !active} onClick={handleApplyPriceChange}>
                                                {isMinted ? t('vehicles:save') : t('vehicles:mint')}
                                            </button>
                                        </div>
                                    )}

                                </div>
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
