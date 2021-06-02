import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import Alert from '@material-ui/lab/Alert'
import filterProps from '../../../libs/filterProps'
import vehicleTypes from '../../../business/vehicleTypes.js'
import announceTypes from '../../../business/announceTypes.js'
import { useAuth } from '../../../context/AuthProvider'
import CTAButton from '../../CTAButton'
import CTALink from '../../CTALink'
import AnnounceTypeRadioButton from "../../AnnounceTypeRadioButton";
import VehicleTypeSelect from "../../VehicleTypeSelect";



const HomeFilters = ({ updateFilters, totalResult }) => {
    const { t } = useTranslation()
    const { authenticatedUser } = useAuth()
    const [vehicleType, setVehicleType] = useState(vehicleTypes()[0]?.value)
    const methods = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues : {
            adType : "sale"
        }
    })

    const { errors, register, handleSubmit } = methods

    const onSubmit = (form, e) => {
        const { coordinates, radius } = form
        const filtersFlat = filterProps(form)
        const data = { ...filtersFlat }

        if (coordinates && radius) {
            data.radius = radius
            data.coordinates = coordinates
            data.enableGeocoding = true
        }

        e.preventDefault()
        updateFilters(data)
    }

    return(
        <form className="form_wizard my-4" onSubmit={handleSubmit(onSubmit)}>
            <div
                style={{
                    maxWidth: 532,
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                {announceTypes() && announceTypes()
                    .filter(type => {
                        if(!authenticatedUser.getIsPro) return type.value !== "sale-pro"
                        return true
                    })
                    .map((tab, index) => (
                        <AnnounceTypeRadioButton
                            key={index}
                            id={`ad_type${index}`}
                            register={register}
                            name="adType"
                            value={tab.value}
                            label={tab.label}
                        />
                    ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <VehicleTypeSelect
                    value={vehicleType}
                    items={vehicleTypes()}
                    onChange={setVehicleType}
                    style={{ maxWidth: 532, width: '100%' }}
                />
            </div>

            {Object.keys(errors).length !== 0 && (
                <Alert severity="warning" className="mb-2">
                    {t('vehicles:correct-errors')}
                </Alert>
            )}

            <div
                style={{
                    width: "fitContent",
                    margin: "0 auto",
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: "center",
                    marginTop: 40
                }}
            >
                <div className="submit mx-2" style={{ marginTop: 0 }}>
                    <CTALink
                      href="/advanced-search"
                      color="primary"
                      variant="contained"
                      style={{ paddingLeft: 40, paddingRight: 40 }}
                      title={<span style={{color: 'white'}}>GO</span>}
                    />
                </div>
            </div>
        </form>
    )
}

export default HomeFilters
