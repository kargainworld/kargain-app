import React, { useState } from 'react'
import { Container } from 'reactstrap'
import useTranslation from 'next-translate/useTranslation'
import { useAuth } from '../../context/AuthProvider'
import StripePurchase from './StripePurchase'
import OffersSelect from './OffersSelect'
import CTAButton from '../CTAButton'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const OffersPurchaseForm = ({ offer: defaultOffer }) => {
    const { t } = useTranslation()
    const { authenticatedUser } = useAuth()
    const [selectedOffer, setSelectedOffer] = useState(null)
    const [isSelectedOffer, setIsSelectedOffer] = useState(false)
    const [enableSubscribe, setEnableSubscribe] = useState(true)
    const isMobile = useMediaQuery('(max-width:768px)')

    return (
        <Container>
            <div className="row">
                <div className="col-12">
                    <div style={{ fontSize:'24px', margintLeft:'15px' }}>                       
                        {enableSubscribe && (
                            <div style={{ marginLeft:'-15px' }}>
                                <h4 className="step-title" style={{ fontSize:'20px', color:'black' }}>Souscrire à une offre</h4>
                                <p className="concept-name">Vous ne disposez d'aucune offre.</p>
                                <p>Vous n'avez le droit d'avoir que 2 annonces publiées en simultanée.</p>
                                <p>Vous pouvez souscrire à une des offres ci dessous : </p>

                                {isMobile ? (
                                    <div style={{ marginTop:'15px' }}>
                                        <OffersSelect {...{
                                            defaultOffer,
                                            setSelectedOffer,
                                            setIsSelectedOffer
                                        }} />

                                        {isSelectedOffer && (
                                            <StripePurchase
                                                disabled={!isSelectedOffer}
                                                offer={selectedOffer}
                                            />
                                        )}
                                    </div>
			
                                ):(
                                    <div style={{ marginTop:'15px', width:"60%" }}>
                                        <OffersSelect {...{
                                            defaultOffer,
                                            setSelectedOffer,
                                            setIsSelectedOffer
                                        }} />

                                        {isSelectedOffer && (
                                            <StripePurchase
                                                disabled={!isSelectedOffer}
                                                offer={selectedOffer}
                                            />
                                        )}
                                    </div>			
                                )}				
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default OffersPurchaseForm
