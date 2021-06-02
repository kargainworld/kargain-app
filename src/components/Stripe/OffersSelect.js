import React, { useEffect, useState } from 'react'
import NiceSelect from 'react-select'
import offers from '../../business/offers.json'

const OffersSelect = ({ defaultOffer, setSelectedOffer, setIsSelectedOffer }) => {
    const [defaultValue, setDefaultValue] = useState(null);
    useEffect(() => {
        if (defaultOffer) {
            const offer = offers.find(offer => offer.title === defaultOffer)
            if (offer) {
                setIsSelectedOffer(true)
                setDefaultValue({
                    value: offer.title,
                    label: `${offer.maxAnnounces} annonces | ${offer.nicePrice}`
                })
                setSelectedOffer(offer)
            }
        }
    }, [])
    
    return (
        <div className="offers">
            <div className="subrcribe">
                <NiceSelect
                    placeholder="Select an offer"
                    options={offers.map(offer => ({
                        value: offer.title,
                        label: `${offer.maxAnnounces} announces | ${offer.nicePrice}`
                    }))}
                    onChange={item => {console.log(item)
                        setIsSelectedOffer(true)
                        setDefaultValue(item)
                        setSelectedOffer(offers.find(offer => offer.title === item.value))
                    }}
                    value={defaultValue}
                />
            </div>
        </div>
    )
}

export default OffersSelect
