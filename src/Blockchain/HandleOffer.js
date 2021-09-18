import { useWeb3React } from "@web3-react/core"
import makeStyles from '@material-ui/core/styles/makeStyles'

import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import { useAuth } from "../context/AuthProvider"
import { MessageContext } from "../context/MessageContext"
import usePriceTracker from "../hooks/usePriceTracker"
import useKargainContract from "../hooks/useKargainContract"
import TransactionsService from "../services/TransactionsService"
import AnnounceService from "../services/AnnounceService"
import UsersService from "../services/UsersService"
import AnnounceModel from "../models/announce.model"
import { Col, Row } from "reactstrap"
import clsx from "clsx"
import Web3 from "web3"


const useStyles = makeStyles(() => ({

    buttonblue:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6px 50px',
        background: '#2C65F6',
        borderRadius: '25px',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '150%',
        color:'white',
        marginTop:'20px'
    }
}))

const web3 = new Web3(Web3.givenProvider)

const HandleOffer = () => {

    const { library, chainId, account, activate, active } = useWeb3React()
    const [bnbBalance, setBalance] = useState()
    const [bnbBalanceWei, setBalanceWei] = useState()
    const refImg = useRef()
    const classes = useStyles()
    const router = useRouter()
    const { slug } = router.query
    const { t, lang } = useTranslation()
    const { isAuthenticated, authenticatedUser, setForceLoginModal } = useAuth()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { getPriceTracker } = usePriceTracker()
    const [priceBNB, setPrice] = useState(0)
    const [walletPayer, setWalletPayer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tokenPrice, setTokenPrice] = useState(null)
    const [error, setError] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const [isMinted, setIsMinted] = useState(false)

    const {
        fetchTokenPrice,
        isContractReady,
        watchOfferEvent,
        acceptOffer,
        rejectOffer,
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

    const handleAcceptOffer = useCallback( async (offerHashTx) => {
        try {
            if (!isContractReady || !state?.announce || !tokenPrice || !authenticatedUser.getWallet)
                return

            const announceId = state?.announce?.getID
            setIsConfirmed(false)
            setError(null)
            const task = acceptOffer(state?.announce?.getTokenId)
            const hashTx = await task
            await TransactionsService.addTransaction({ announceId, hashTx, data: offerHashTx, action: "OfferAccepted" })
            await waitTransactionToBeConfirmed(hashTx)

            AnnounceService.updateAnnounce(state?.announce.getSlug, { user: newOfferCreated?.user }).then(() =>
                window.location.reload()
            )

            setIsConfirmed(true)
            dispatchModal({ msg: t('vehicles:offerAcceptedConfirmed') })
        }
        catch(error) {
            console.error(error)
            setError(error)
            setIsConfirmed(true)
        }

    }, [isContractReady, state?.announce, tokenPrice, authenticatedUser.getWallet, acceptOffer, waitTransactionToBeConfirmed, newOfferCreated?.user, dispatchModal, t])

    const handleRejectOffer = async (offerHashTx) => {
        try {
            if (!isContractReady || !state?.announce || !tokenPrice || !authenticatedUser.getWallet)
                return

            const announceId = state?.announce?.getID
            const tokenId = state?.announce.getTokenId
            setIsConfirmed(false)
            setError(null)
            const task = rejectOffer(tokenId)
            const hashTx = await task
            await TransactionsService.addTransaction({ announceId, hashTx, data: offerHashTx, action: "OfferRejected" })
            await waitTransactionToBeConfirmed(hashTx)
            setIsConfirmed(true)
            dispatchModal({ msg: t('vehicles:rejectedOffer') })
        } catch (error) {
            console.error(error)
            setError(error)
            setIsConfirmed(true)
        }

    }

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
                        setBalanceWei(balance)
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

    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }

    }, [tried, active])


    const [transactions, setTransactions] = useState([])

    const transactionsOrdered = transactions.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())


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

    return (
        <Row>
            <Col sm={5}>
                <button className={clsx(classes.buttonblue)} disabled={!isContractReady || !isConfirmed || tokenPrice === null } onClick={handleAcceptOffer}>
                    {t('vehicles:acceptOffer')}
                </button>
            </Col>
            <Col sm={5}>
                <button  className={clsx(classes.buttonblue)} disabled={!isContractReady || !isConfirmed || tokenPrice === null } onClick={handleRejectOffer}>
                    {t('vehicles:rejectOffer')}
                </button>
            </Col>
        </Row>
    )
}

export default HandleOffer
