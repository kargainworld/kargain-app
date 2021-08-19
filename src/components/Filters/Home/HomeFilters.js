import React, { useState, useContext, useRef, useCallback, useEffect } from 'react'
import { Col, Container, Row } from 'reactstrap'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { FormContext } from '../../../context/FormContext'
import { useRouter, withRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import makeStyles from '@material-ui/core/styles/makeStyles'
import customColors, { themeColors } from '../../../theme/palette'
import Alert from '@material-ui/lab/Alert'
import filterProps from '../../../libs/filterProps'
import vehicleTypes from '../../../business/vehicleTypes.js'
import announceTypes from '../../../business/announceTypes.js'
import { useAuth } from '../../../context/AuthProvider'
import CTAButton from '../../CTAButton'
import CTALink from '../../CTALink'
import AnnounceTypeRadioButton from "../../AnnounceTypeRadioButton";
import VehicleTypeSelect from "../../VehicleTypeSelect";

const path = require('path')

const useStyles = makeStyles(() => ({
    button: {
        width: 100, 
        height: 33,
        padding: '6px 2rem',
        borderRadius: '20px',
        background: customColors.gradient.main
    }
}))

const HomeFilters = ({ updateFilters, totalResult }) => {
    const router = useRouter()
    const classes = useStyles()
    const formRef = useRef()
    const { t } = useTranslation()
    const { authenticatedUser } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    const [vehicleType, setVehicleType] = useState(vehicleTypes()[0]?.value)
    const methods = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues: {
            adType: "sale"
        }
    })

    const { dispatchFormUpdate, dispatchFormClear } = useContext(FormContext)

    const { errors, register, handleSubmit } = methods

    const onSubmit = (data) => {
        dispatchFormClear();
        const { adType} = data
        const route = `advanced-search` 
        dispatchFormUpdate({ adType, vehicleType })
        router.push({
            pathname: route,
            query: {
                adType: adType,
                vehicleType: vehicleType
            },
        })
    }

    return (
        <>
            {isMobile ? (
                <Row>
                    <Col md={12}>
                        <img src="/images/MainCar-mobile.png" width="100%" height="100%"/>
                    </Col>
                    
                    <Col md={12}>
                        <form className="form_wizard my-4" onSubmit={handleSubmit(onSubmit)}>
                            <div
                                style={{
                                    maxWidth: 720,
                                    width: '100%',
                                    margin: '0 auto',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {announceTypes() && announceTypes()
                                    .filter(type => type.value !== "sale-pro" && type.value !== 'deal')
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
                                    name="vehicleType"
                                    items={vehicleTypes()}
                                    onChange={setVehicleType}
                                    style={{ maxWidth: 720, width: '100%' }}
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
                                    marginTop: 45
                                }}
                            >
                                <div className="submit mx-2" style={{ marginTop: 0 }}>                    
                                    <button className={clsx('btn', classes.button)}
                                        type="submit">
                                        {<span style={{ color: 'white' }}>GO</span>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
                ) : (
                <Row>
                    <Col md={4}>
                        <img src="/images/MainCar.png" width="100%" height="100%" />
                    </Col>
                    
                    <Col md={8}>
                        <form className="form_wizard my-4" onSubmit={handleSubmit(onSubmit)} style={{ paddingTop: '9%' }}>
                            <div
                                style={{
                                    maxWidth: 720,
                                    width: '100%',
                                    margin: '0 auto',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                {announceTypes() && announceTypes()
                                    .filter(type => type.value !== "sale-pro" && type.value !== 'deal')
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
                                    name="vehicleType"
                                    items={vehicleTypes()}
                                    onChange={setVehicleType}
                                    style={{ maxWidth: 720, width: "100%" }}
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
                                    marginTop: 45
                                }}
                            >
                                <div className="submit mx-2" style={{ marginTop: 0 }}>                    
                                    <button className={clsx('btn', classes.button)}
                                        type="submit">
                                        {<span style={{ color: 'white' }}>GO</span>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
                )
            }
        </>
    )
}

export default HomeFilters
