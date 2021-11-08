import { Col, Row } from "reactstrap"
import clsx from "clsx"
import React, { useCallback, useContext, useState } from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import useKargainContract from "../../hooks/useKargainContract"
import TransactionsService from "../../services/TransactionsService"
import AnnounceService from "../../services/AnnounceService"
import { useAuth } from "context/AuthProvider"
import { MessageContext } from "context/MessageContext"
import useTranslation from "next-translate/useTranslation"

const useStyles = makeStyles(() => ({
    buttonBlue:{
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

const HandleOffer = (props) => {
    const classes = useStyles()
    const [isConfirmed, setIsConfirmed] = useState(true)
    const { authenticatedUser } = useAuth()
    const [error, setError] = useState(null)
    const { dispatchModal } = useContext(MessageContext)
    const { t } = useTranslation()

    const {
        isContractReady,
        acceptOffer,
        rejectOffer,
        waitTransactionToBeConfirmed
    } = useKargainContract()

    const handleRejectOffer = async (offerHashTx) => {
        try {
            if (!isContractReady || !props?.announce || !props.tokenPrice || !authenticatedUser.getWallet)
                return

            const announceId = props?.announce?.getID
            const tokenId = props?.announce.getTokenId
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

    const handleAcceptOffer = useCallback( async (offerHashTx) => {
        try {
            if (!isContractReady || !props?.announce || !props.tokenPrice || !authenticatedUser.getWallet)
                return

            const announceId = props?.announce?.getID
            setIsConfirmed(false)
            setError(null)
            const task = acceptOffer(props?.announce?.getTokenId)
            const hashTx = await task
            await TransactionsService.addTransaction({ announceId, hashTx, data: offerHashTx, action: "OfferAccepted" })
            await waitTransactionToBeConfirmed(hashTx)
            AnnounceService.updateAnnounce(props?.announce.getSlug, { user: props.newOfferCreated?.user }).then(() =>
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

    }, [isContractReady, props?.announce, props.tokenPrice, authenticatedUser.getWallet, acceptOffer, waitTransactionToBeConfirmed, props.newOfferCreated?.user, dispatchModal, t])

    return (
        <Row>
            <Col sm={5}>
                <button className={clsx(classes.buttonBlue)} disabled={!isContractReady || !isConfirmed || props.tokenPrice === null } onClick={handleAcceptOffer}>
                    {t('vehicles:acceptOffer')}
                </button>
            </Col>
            <Col sm={5}>
                <button  className={clsx(classes.buttonBlue)} disabled={!isContractReady || !isConfirmed || props.tokenPrice === null } onClick={handleRejectOffer}>
                    {t('vehicles:rejectOffer')}
                </button>
            </Col>
        </Row>
    )
}

export default HandleOffer
