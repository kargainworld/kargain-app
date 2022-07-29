import React, {  useState } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import FormWizard from '../../components/Form/FormWizard'
import AnnounceService from '../../services/AnnounceService'
// import { MessageContext } from '../../context/MessageContext'
import Step0_Manufacturer from '../../components/Products/Step0_Manufacturer'
import Step1CarDetails from '../../components/Products/car/Step1_CarDetails'
import Step2CarStatus from '../../components/Products/car/Step2_CarStatus'
import Step3PublishAnnounce from '../../components/Products/Step3_Publish'
import { vehicleTypes } from '../../business/vehicleTypes.js'
import useKargainContract from '../../hooks/useKargainContract'
import TransactionsService from 'services/TransactionsService'
import ObjectID from 'bson-objectid'
import Web3 from 'web3'
import { useMessage } from '../../context/MessageContext'
import { useBackdrop } from '../../context/BackdropContext'
import ConfirmDialog from './confirm'

const toBN = Web3.utils.toBN

const CarForm = (props) => {
    /*Mint Section*/
    const [tokenPrice, setTokenPrice] = useState(null)
    const [error, setError] = useState(null)
    const [confirmModal, setConfirmModal] = useState(false)
    const [form, setFormData] = useState(null)

    const { mintToken, waitTransactionToBeConfirmed } = useKargainContract()
    /*Mint Section*/
    const router = useRouter()
    const { t } = useTranslation()
    const { dispatchModal, dispatchModalError } = useMessage()

    const backdrop = useBackdrop()
    const onFinalSubmit = (form, err) => {
        console.log(form, err)
        setFormData(form)

        if (form.chassisNumber) setConfirmModal(form.chassisNumber)
        else dispatchModalError('No VIN code')
    // return
    }

    const handleConfirm = () => {
        const { images, ...body } = form
        let formData = new FormData()

        if (images && Array.isArray(images)) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i])
            }
        }
        setConfirmModal(false)
        startPost(body, formData, images)
    }

    const startPost = async (body, formData, images) => {
        try {
            if (+tokenPrice <= 0) {
                setError(new Error(`Price must be grater than zero.`))
                return
            }
            dispatchModal({ msg: 'Creating...' })
            backdrop.fetch(true)

            const announce = await AnnounceService.createAnnounce({
                ...body,
                vinNumber: body.chassisNumber
            })
            const link = `/announces/${announce?.slug}`
            try {
                const hashTx = await mintToken(toBN(ObjectID(announce._id).toHexString()), +tokenPrice)
                await TransactionsService.addTransaction({
                    announceId: announce._id.toString(),
                    hashTx,
                    data: +tokenPrice,
                    action: 'TokenMinted'
                })

                await waitTransactionToBeConfirmed(hashTx)
                await TransactionsService.updateTransaction(announce._id.toString(), { hashTx: hashTx, status: 'Approved' })
            } catch (err) {
                backdrop.fetch(true)
                dispatchModalError({
                    err,
                    persist: true
                })
                return
            }

            if (announce && images) {
                await AnnounceService.uploadImages(announce.slug, formData)
            }

            dispatchModal({
                msg: t('vehicles:announce_created_successfully'),
                persist: true,
                link
            })
            backdrop.fetch(false)
            router.push(link)
        } catch (err) {
            dispatchModalError({
                err,
                persist: true
            })
            backdrop.fetch(false)
        }
    }

    return (
        <>
            <FormWizard formKey={props.formKey} prevRoute="/deposer-une-annonce" onFinalSubmit={onFinalSubmit}>
                <Step0_Manufacturer vehicleType={vehicleTypes.car} title={t('vehicles:vehicle-selection')} />
                <Step1CarDetails title={t('vehicles:vehicle-description')} />
                <Step2CarStatus title={t('vehicles:vehicle-state')} />
                <Step3PublishAnnounce
                    title={t('vehicles:your-announce')}
                    setTokenPrice={setTokenPrice}
                    tokenPrice={tokenPrice}
                    error={error}
                />
            </FormWizard>
            <ConfirmDialog
                open={!!confirmModal}
                setOpen={setConfirmModal}
                handleConfirm={handleConfirm}
                code={confirmModal}
            />
        </>
    )
}

CarForm.getInitialProps = () => {
    return {
        requiredAuth: true,
        formKey: 'car'
    }
}

export default CarForm
