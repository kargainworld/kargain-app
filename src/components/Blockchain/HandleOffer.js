import { Col, Row } from "reactstrap"
import clsx from "clsx"
import React, { useCallback, useContext, useState } from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import useKargainContract from "../../hooks/useKargainContract"
import TransactionsService from "../../services/TransactionsService"
import AnnounceService from "../../services/AnnounceService"
import { useAuth } from "../../context/AuthProvider"
import { MessageContext } from "../../context/MessageContext"
import useTranslation from "next-translate/useTranslation"

const useStyles = makeStyles(() => ({
    bordergradientbtn: {
        height: '39px',
        borderRadius: '100rem',
        padding: '1rem',
        fontSize: '14px',
        padding: '8px 30px 2px',
        boxShadow: '0 0 6px 0 rgba(157, 96, 212, 0.5)',
        border: 'solid 2px transparent',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(176deg, #0046f9, #ff08fa);',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '2px 1000px 1px #fff inset',
        '&:hover': {
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #0244ea, #e81ae5)',
        },
    
        '& label': {
          background:
            '-webkit-linear-gradient(#2C65F6, #ED80EB); -webkit-background-clip: text; -webkit-text-fill-color: transparent',
          backgroundImage: 'linear-gradient(91deg, #084dff, #ff0afb)',
          backgroundClip: 'text',
          color: 'transparent',
        },
      },
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
            <div style={{ marginRight: '15px' }}>
                <button
                className={clsx(classes.bordergradientbtn)}
                disabled={!isContractReady || !isConfirmed || props.tokenPrice === null}
                onClick={handleAcceptOffer}
                >
                <label>{t('vehicles:acceptOffer')}</label>
                </button>
            </div>
            <div>
                <button
                className={clsx(classes.bordergradientbtn)}
                disabled={!isContractReady || !isConfirmed || props.tokenPrice === null}
                onClick={handleRejectOffer}
                >
                <label>{t('vehicles:rejectOffer')}</label>
                </button>
            </div>
        </Row>
    )
}

export default HandleOffer
