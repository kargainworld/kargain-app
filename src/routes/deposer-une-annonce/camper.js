import React, { useContext,useState } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import FormWizard from '../../components/Form/FormWizard'
import AnnounceService from '../../services/AnnounceService'
import { MessageContext } from '../../context/MessageContext'
import Step0_Manufacturer from '../../components/Products/Step0_Manufacturer'
import Step1CamperDetails from '../../components/Products/camper/Step1_CamperDetails'
import Step2CamperStatus from '../../components/Products/camper/Step2_CamperStatus'
import Step3PublishAnnounce from '../../components/Products/Step3_Publish'
import { vehicleTypes } from '../../business/vehicleTypes'
import useKargainContract from '../../hooks/useKargainContract'
import TransactionsService from 'services/TransactionsService'
import ObjectID from 'bson-objectid'
import Web3 from 'web3'

const toBN = Web3.utils.toBN

const CamperForm = (props) => {
    /*Mint Section*/
    const [tokenPrice, setTokenPrice] = useState(null)
    const [error, setError] = useState(null)   
    const { mintToken, waitTransactionToBeConfirmed }= useKargainContract()
    /*Mint Section*/
    const router = useRouter()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { t } = useTranslation()

    const onFinalSubmit = form => {
        const { images, ...body } = form
        let formData = new FormData()

        if (images && Array.isArray(images)) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i])
            }
        }

        startPost(body, formData, images)
    }

    const startPost = async (body, formData, images) => {
        try {
            if (+tokenPrice <= 0) {
                setError(new Error(`Price must be grater than zero.`))
                return
            }

            dispatchModal({ msg: 'Creating...' })
            const announce = await AnnounceService.createAnnounce(body)
            const link = `/announces/${announce?.slug}`
            try {           
                const hashTx = await mintToken(toBN(ObjectID(announce._id).toHexString()),+tokenPrice)             
                await TransactionsService.addTransaction({ announceId: announce._id.toString(), hashTx, data: +tokenPrice, action: "TokenMinted" })
                
                await waitTransactionToBeConfirmed(hashTx)
                await TransactionsService.updateTransaction(announce._id.toString(), { hashTx, status: "Approved" })
            }
            catch(err){
                dispatchModalError({
                    err,
                    persist : true
                })
                return
            }
            if (announce && images) {
                await AnnounceService.uploadImages(announce.slug, formData)
            }

            dispatchModal({
                msg: t('vehicles:announce_created_successfully'),
                persist : true,
                link
            })

            router.push(link)

        } catch (err) {
            dispatchModalError({
                err,
                persist : true
            })
        }
    }

    return (
        <FormWizard
            formKey={props.formKey}
            prevRoute="/deposer-une-annonce"
            onFinalSubmit={onFinalSubmit}>

            <Step0_Manufacturer
                vehicleType={vehicleTypes.camper}
                title={t('vehicles:vehicle-selection')}
            />
            <Step1CamperDetails title={t('vehicles:vehicle-description')}/>
            <Step2CamperStatus title={t('vehicles:vehicle-state')}/>
            <Step3PublishAnnounce title={t('vehicles:your-announce')} setTokenPrice = {setTokenPrice} tokenPrice = {tokenPrice}  error = {error} /> 
        </FormWizard>
    )
}

CamperForm.getInitialProps = () => {
    return {
        formKey: 'camper',
        requiredAuth: true
    }
}

export default CamperForm
