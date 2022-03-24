import React, { useState, useContext, useRef, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import { Col, Container, Row } from 'reactstrap'
import { useRouter, withRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useForm } from 'react-hook-form'
import { FormContext } from 'context/FormContext'
import { useAuth } from 'context/AuthProvider'
import vehicleTypes from 'business/vehicleTypes.js'
import announceTypes from 'business/announceTypes.js'
import ValidationErrors from 'components/Form/Validations/ValidationErrors'
import AnnounceService from 'services/AnnounceService'
import UserModel from 'models/user.model'
import Loading from 'components/Loading'

import ErrorPage from '../_error'
import customColors from '../../theme/palette'

const path = require('path')

const useStyles = makeStyles(() => ({
    button: {
        border: 'none !important',
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        background: customColors.gradient.main
    }
}))

const Page = () => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const router = useRouter()
    const classes = useStyles()
    const formRef = useRef()
    const { t } = useTranslation()
    const { authenticatedUser, isAuthenticated } = useAuth()
    const [vehicleType, setVehicleType] = useState()
    const { errors, register, handleSubmit, formState } = useForm({
        mode: 'onChange'
    })

    const [state, setState] = useState({
        err: null,
        loading: false,
        profile: new UserModel()
    })

    const { dispatchFormUpdate, dispatchFormClear } = useContext(FormContext)
    const profile = state.profile

    const handleSelectVehicleType = (index) => {
        const type = vehicleTypes[index]
        setVehicleType(type)
    }

    const onSubmit = (data) => {
        if (!isAuthenticated) {
            router.push({
                pathname: '/auth/login',
                query: { redirect: router.asPath }
            })
        }
        dispatchFormClear()
        const { adType, vehicleType } = data
        const route = `${vehicleType.toLowerCase()}`
        dispatchFormUpdate({ adType, vehicleType })
        router.push(path.resolve(router.route, route))
    }

    const fetchAnnounces = useCallback(async () => {
        try {
            const result = await AnnounceService.getProfileAnnounces()
            setState((state) => ({
                ...state,
                loading: false,
                profile: new UserModel({
                    ...profile.getRaw,
                    garage: result.rows
                })
            }))
        } catch (err) {
            setState((state) => ({ ...state, err }))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setState((state) => ({ ...state, loading: true }))
        console.log('fetch announces')
        fetchAnnounces()
    }, [fetchAnnounces])

    if (state.loading) return <Loading />
    if (state.err) return <ErrorPage statusCode={state.err?.statusCode} />

    return (
        <>
            <Container className="annonce1-wrapper-container">
                {isMobile ? (
                    <form className="form_wizard my-4" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            style={{ fontSize: '19.9429px', marginTop: '40px' }}
                            component="h3"
                            variant="h3"
                            gutterBottom
                            className="text-center"
                        >
                            {t('vehicles:choose-vehicle-type')}
                        </Typography>
                        <Row className="justify-content-center" style={{ marginTop: '30px' }}>
                            {vehicleTypes() &&
                vehicleTypes().map((tab, index) => {
                    return (
                        <Col key={index} xs={12} sm={12} md={12} lg={12}>
                            <div className="form-check form-check-vehicle m-0" style={{ height: '159px' }}>
                                <input
                                    id={`vehicle_type${index}`}
                                    type="radio"
                                    name="vehicleType"
                                    value={tab.value}
                                    ref={register({ required: t('form_validations:required') })}
                                    onChange={() => handleSelectVehicleType(index)}
                                />
                                <label
                                    htmlFor={`vehicle_type${index}`}
                                    style={{ minHeight: '5rem', height: '159px', marginTop: '25px' }}
                                >
                                    <img
                                        src={vehicleType === tab.value ? `/images/${tab.imgSelected}` : `/images/${tab.img}`}
                                        alt={tab.label}
                                        title={tab.label}
                                        style={{ maxWidth: '80px', objectFit: 'contain' }}
                                    />
                                </label>
                            </div>
                        </Col>
                    )
                })}
                        </Row>

                        <Typography
                            style={{ fontSize: '20px', marginTop: '50px' }}
                            component="h3"
                            variant="h3"
                            gutterBottom
                            className="text-center"
                        >
                            {t('vehicles:announce-type')}
                        </Typography>
                        <Row className="justify-content-center" style={{ fontSize: '14px' }}>
                            {announceTypes() &&
                announceTypes()
                    .filter((type) => {
                        if (!authenticatedUser.getIsPro) return type.value !== 'sale-pro'
                        return true
                    })
                    .map((tab, index) => {
                        return (
                            <Col key={index} xs={3} sm={3} md={3} lg={3}>
                                <div className="form-check-transparent" style={{ minHeight: '5rem' }}>
                                    <input
                                        id={`ad_type${index}`}
                                        type="radio"
                                        name="adType"
                                        value={tab.value}
                                        ref={register({ required: t('form_validations:required') })}
                                    />
                                    <label htmlFor={`ad_type${index}`}>{tab.label}</label>
                                </div>
                            </Col>
                        )
                    })}
                        </Row>

                        <Row className="justify-content-center" style={{ marginTop: '15px' }}>
                            <button className={clsx('btn', classes.button)} type="submit" disabled={!formState.isValid}>
                                {t('vehicles:next')}
                            </button>
                        </Row>

                        {errors && <ValidationErrors errors={errors} />}
                    </form>
                ) : (
                    <form className="form_wizard my-4" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            style={{ fontSize: '20px', marginTop: '40px' }}
                            component="h3"
                            variant="h3"
                            gutterBottom
                            className="text-center"
                        >
                            {t('vehicles:choose-vehicle-type')}
                        </Typography>
                        <Row className="justify-content-center" style={{ marginTop: '30px' }}>
                            {vehicleTypes() &&
                vehicleTypes().map((tab, index) => {
                    return (
                        <Col key={index} xs={6} sm={6} md={3} lg={3}>
                            <div className="form-check form-check-vehicle m-0" style={{ minHeight: '5rem' }}>
                                <input
                                    id={`vehicle_type${index}`}
                                    type="radio"
                                    name="vehicleType"
                                    value={tab.value}
                                    ref={register({ required: t('form_validations:required') })}
                                    onChange={() => handleSelectVehicleType(index)}
                                />
                                <label htmlFor={`vehicle_type${index}`} style={{ minHeight: '5rem' }}>
                                    <img
                                        src={vehicleType === tab.value ? `/images/${tab.imgSelected}` : `/images/${tab.img}`}
                                        alt={tab.label}
                                        title={tab.label}
                                        style={{ maxWidth: '80px', objectFit: 'contain' }}
                                    />
                                </label>
                            </div>
                        </Col>
                    )
                })}
                        </Row>

                        <Typography
                            style={{ fontSize: '20px', fontWeight: '500', marginTop: '30px' }}
                            component="h3"
                            variant="h3"
                            gutterBottom
                            className="text-center"
                        >
                            {t('vehicles:announce-type')}
                        </Typography>
                        <Row className="justify-content-center" style={{ fontSize: '14px' }}>
                            {announceTypes() &&
                announceTypes()
                    .filter((type) => {
                        if (!authenticatedUser.getIsPro) return type.value !== 'sale-pro'
                        return true
                    })
                    .map((tab, index) => {
                        return (
                            <Col key={index} xs={12} sm={4} md={3} lg={4}>
                                <div className="form-check-transparent" style={{ minHeight: '5rem' }}>
                                    <input
                                        id={`ad_type${index}`}
                                        type="radio"
                                        name="adType"
                                        value={tab.value}
                                        ref={register({ required: t('form_validations:required') })}
                                    />
                                    <label htmlFor={`ad_type${index}`}>{tab.label}</label>
                                </div>
                            </Col>
                        )
                    })}
                        </Row>

                        <Row className="justify-content-center">
                            <button className={clsx('btn', classes.button)} type="submit" disabled={!formState.isValid}>
                                {t('vehicles:next')}
                            </button>
                        </Row>

                        {errors && <ValidationErrors errors={errors} />}
                    </form>
                )}
            </Container>
        </>
    )
}

export default withRouter(Page)
