import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import FormWizard from '../../components/Form/FormWizard'
import AnnounceService from '../../services/AnnounceService'
import { MessageContext } from '../../context/MessageContext'
import Step0_Manufacturer from '../../components/Products/Step0_Manufacturer'
import Step1CamperDetails from '../../components/Products/camper/Step1_CamperDetails'
import Step2CamperStatus from '../../components/Products/camper/Step2_CamperStatus'
import Step3PublishAnnounce from '../../components/Products/Step3_Publish'
import {vehicleTypes} from '../../business/vehicleTypes'

const CamperForm = (props) => {

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
        dispatchModal({ msg: 'Creating...' })
        try {
            const announce = await AnnounceService.createAnnounce(body)
            const link = `/announces/${announce?.slug}`

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
            <Step3PublishAnnounce title={t('vehicles:your-announce')}/>
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
