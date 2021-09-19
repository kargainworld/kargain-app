import clsx from "clsx"
import Comments from "../Comments/Comments"
import React, { useCallback, useContext,  useState } from "react"
import useKargainContract from "../../hooks/useKargainContract"
import makeStyles from "@material-ui/core/styles/makeStyles"
import TransactionsService from "../../services/TransactionsService"
import { useAuth } from "../../context/AuthProvider"
import { MessageContext } from "../../context/MessageContext"
import useTranslation from "next-translate/useTranslation"
import Web3 from "web3"



const web3 = new Web3(Web3.givenProvider)

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
    },
    filtersHidden: {
        display: 'none'
    }
}))

const MakeOffer = (props) => {
    const classes = useStyles()
    const { dispatchModal } = useContext(MessageContext)
    const { t } = useTranslation()
    const [hiddenForm, hideForm] = useState(true)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const { authenticatedUser } = useAuth()
    const [error, setError] = useState(null)
    

    const {
        makeOffer,
        isContractReady,
        waitTransactionToBeConfirmed
    } = useKargainContract()

    const handleMakeOffer = useCallback(async () => {
        if (!isContractReady || !props?.announce || !props.tokenPrice || !authenticatedUser.getWallet)
            return
        setIsConfirmed(false)
        setError(null)
        const announceId = props?.announce?.getID
        try {
            setIsConfirmed(false)
            setError(null)

            const task = makeOffer(props?.announce?.getTokenId, props.tokenPrice)
            const hashTx = await task

            await TransactionsService.addTransaction({ announceId, hashTx, data: authenticatedUser.getWallet, action: "OfferCreated" })

            await waitTransactionToBeConfirmed(hashTx)

            setIsConfirmed(true)
            dispatchModal({ msg: t('vehicles:tokenPriceConfirmed') })
        }
        catch(error) {
            console.error(error)
            setError(error)
            setIsConfirmed(true)
        }

    }, [props?.announce?.getTokenId, isContractReady, props.tokenPrice, makeOffer])
    return(
        <>
            <button className={clsx(classes.buttonBlue)}
                disabled={!isContractReady || !isConfirmed || props.tokenPrice === null || +props.bnbBalance < +props.tokenPrice}
                onClick={handleMakeOffer}> {t('vehicles:makeOffer')} </button>
            <div className={clsx(hiddenForm && classes.filtersHidden)}>
                <Comments announceRaw={props?.announce?.getRaw} />
            </div>
        </>
    )
}

export default MakeOffer
