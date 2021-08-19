import React, { useState, useContext, useRef, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import { Col, Container, Row } from 'reactstrap'
import { useRouter, withRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import { useForm } from 'react-hook-form'
import { FormContext } from '../../context/FormContext'
import { useAuth } from '../../context/AuthProvider'
import vehicleTypes from '../../business/vehicleTypes.js'
import announceTypes from '../../business/announceTypes.js'
import ValidationErrors from '../../components/Form/Validations/ValidationErrors'

import AnnounceService from '../../services/AnnounceService'
import UserModel from '../../models/user.model'
import Loading from '../../components/Loading'
import Error from '../_error'

import customColors from '../../theme/palette'

const path = require('path')

const useStyles = makeStyles(() => ({
    gradientbox: {  
		display: "flex",
		alignItems: "center",
		//width: 50vw;
		width: "90%",
		backgroundClip: 'padding-box', /* !importanté */
		border: 'solid 3px transparent', /* !importanté */
		borderRadius: 20,
		'&:before': {
				content: '',
				position: "absolute",
				top: 0, right: 0, bottom: 0, left: 0,
				zIndex: -1,
				margin: -3, /* !importanté */
				borderRadius: "inherit", /* !importanté */
				background: customColors.gradient.main
		}
	},
	button: {
		border: "none !important",
		padding: '6px 2rem',
		borderRadius: '20px',
		color: 'white',
		fontSize: '14px',
		fontWeight: 'bold',
		background: customColors.gradient.main
	},
}))

const Page = () => {
    const router = useRouter()
    const classes = useStyles()
    const formRef = useRef()
    const { t } = useTranslation()
    const { authenticatedUser, isAuthenticated } = useAuth()
    const [vehicleType, setVehicleType ] = useState()
    const { errors, register, handleSubmit, formState } = useForm({
        mode: "onChange"
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
        dispatchFormClear();
        const { adType, vehicleType} = data
        const route = `${vehicleType.toLowerCase()}`
        dispatchFormUpdate({ adType, vehicleType })
        router.push(path.resolve(router.route, route))
    }

    const fetchAnnounces = useCallback(async () => {
        try{
            const result = await AnnounceService.getProfileAnnounces()
            setState(state => ({
                ...state,
                loading: false,
                profile: new UserModel({
                    ...profile.getRaw,
                    garage : result.rows
                })
            }))
        } catch (err) {
            setState(state => ({ ...state, err}))
        }
    },[])

    useEffect(() => {
        setState(state => ({...state, loading: true}))
        console.log('fetch announces')
        fetchAnnounces()
    }, [fetchAnnounces])

    if (state.loading) return <Loading/>
    if (state.err) return <Error statusCode={state.err?.statusCode}/>
    if (state.profile.getCountGarage >= 2 && isAuthenticated && state.profile.getCountGarage >= authenticatedUser.getSubscriptionOfferMaxAnnounces) {
        const userName = authenticatedUser.getUsername
        router.push(`/profile/${userName}/edit?offer=true`)
    }

    return (
        <Container className="annonce1-wrapper-container">
            <form className="form_wizard my-4" ref={formRef} onSubmit={handleSubmit(onSubmit)}>

                <Typography style={{fontSize:"20px"}} component="h3" variant="h3" gutterBottom className="text-center">{t('vehicles:choose-vehicle-type')}</Typography>
                <Row className="justify-content-center" style={{marginTop:"20px"}}>
                    {vehicleTypes() && vehicleTypes().map((tab, index) => {
                        return (
                            <Col key={index} xs={6} sm={6} md={3} lg={3}>
                                <div className="form-check form-check-vehicle m-0" style={{ minHeight: '5rem' }}>
                                    <input id={`vehicle_type${index}`}
                                          
                                        type="radio"
                                        name="vehicleType"
                                        value={tab.value}
                                        ref={register({required : t('form_validations:field-is-required')})}
                                        onChange={() => handleSelectVehicleType(index)}
                                    />
                                    <label htmlFor={`vehicle_type${index}`} style={{ minHeight: '5rem' }}>
                                        <img src={vehicleType === tab.value ? `/images/${tab.imgSelected}` : `/images/${tab.img}`}
                                            alt={tab.label}
                                            title={tab.label}
                                            style={{maxWidth:'80px', objectFit: 'contain' }}
                                        />
                                    </label>
                                </div>
                            </Col>
                        )
                    })}
                </Row>

                <Typography style={{fontSize:"20px", fontWeight:"500" }} component="h3" variant="h3" gutterBottom className="text-center">{t('vehicles:announce-type')}</Typography>
                <Row className="justify-content-center" style={{fontSize:"14px"}}>
                    {announceTypes() && announceTypes()
                        .filter(type => {
                            if(!authenticatedUser.getIsPro) return type.value !== "sale-pro"
                            return true
                        })
                        .map((tab, index) => {
                            return (
                                <Col key={index} xs={12} sm={4} md={3} lg={4}>
                                    <div className="form-check-transparent"
                                        style={{ minHeight: '5rem' }}>
                                        <input id={`ad_type${index}`}
                                            type="radio"
                                            name="adType"
                                            value={tab.value}
                                            ref={register({required : t('form_validations:field-is-required')})}
                                        />
                                        <label htmlFor={`ad_type${index}`}>{tab.label}</label>
                                    </div>
                                </Col>
                            )
                        })}
                </Row>

                <Row className="justify-content-center">
                    <button className={clsx('btn', classes.button)}
                        className={clsx("btn"), classes.button}
                        type="submit"
                        disabled={!formState.isValid}>
                        {t('vehicles:next')}
                    </button>
                </Row>

                {errors && <ValidationErrors errors={errors}/>}
            </form>
        </Container>
    )
}

export default withRouter(Page)
