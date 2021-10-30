import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/router"
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTranslation from 'next-translate/useTranslation'
import filterProps from 'libs/filterProps'
import { useAuth } from 'context/AuthProvider'
import { MessageContext } from 'context/MessageContext'
import vehicleTypesDefault, { vehicleTypes, vehicleTypeRefModels } from 'business/vehicleTypes.js'
import AnnounceTypes from 'business/announceTypes.js'
import VehiclesService from 'services/VehiclesService'
import SwitchFiltersVehicleType from './SwitchFiltersVehicleType'
import useAddress from 'hooks/useAddress'
import customColors from 'theme/palette'
import { NewIcons } from 'assets/icons'
import { Col } from 'reactstrap'
import ClearAndFeed from "./Components/ClearAndNews"
import VehicleType from "./Components/VehicleType"
import AnnounceType from "./Components/AnnounceType"
import Brand from "./Components/Brand"
import Model from "./Components/Model"
import Year from "./Components/Year"
import { Price } from "../../AnnounceCard/components"
import Cylinder from "./Components/Cylinder"


const useStyles = makeStyles(() => ({

    filtersContainer: {
        padding: '.5rem'
    },
    filtersHidden: {
        display: 'none !important'
    },
    buttondropdown:{
        '& button':{
            borderRadius: '26.8293px !important',
            borderColor:'#dcd7d7 !important',
            backgroundColor: '#c4c4c400 !important',
            color: 'black !important',
            cursor: 'pointer',
            fontSize:"17.1707px",
            marginRight: '6px !important',
            marginTop: '5px !important',
            '& button:clicked': {
                borderRadius: '25px !important',
                backgroundColor: '#c4c4c447 !important',
                color: 'black !important',
                fontSize:"17.1707px !important"
            },
            '&::after': {
                display: 'none !important'
            },
            '& .propTypes':{
                disabled: 'PropTypes.bool',
                direction: 'PropTypes.oneOf([`up`, `down`, `left`, `right`])',
                group: 'PropTypes.bool',
                isOpen: 'PropTypes.bool',
                tag: 'PropTypes.string',
                toggle: 'PropTypes.func'
            }
        }
    },
    dropdowntoggle:{
        '& .propTypes':{
            caret: 'PropTypes.bool',
            color: 'PropTypes.string',
            disabled: 'PropTypes.bool',
            onClick: 'PropTypes.func',
            dataToggle: 'PropTypes.string',
            ariaHaspopup: 'PropTypes.bool'
        }
    },
    rowbuttons:{
        position: 'relative',
        backgroundColor: '#fff',
        marginTop:'20px'
    },
    overflow:{
        overflowX:'auto'
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        height: '39px',
        background: customColors.gradient.main
    },
    filterbutton:{
        backgroundColor: 'white', /* Green */
        color: 'black',
        padding: '8px 15px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '26.8293px',
        border: 'solid #dcd7d7',
        borderWidth: '1px'
    },
    dropdownmenu: {
        position: 'absolute',
        width: '250px',
        right: '220px',
        top: '225.49px',
        padding: '5px 5px'
    },
    label:{
        textAlign:'left',
        fontSize:'14px',
        fontWeight: 'normal',
        lineHeight: '150%',
        color: 'black',
        marginLeft:'5px',
        marginBottom: '-10px'
    },
    dropdownmenuslide:{
        position: 'absolute',
        width: '250px',
        // height: 105px;
        right: '220px',
        top: '225.49px',
        padding: '15px 10px 20px'
    },
    btnfontsize:{
        '& button':{
            fontSize:'15.15px !important'
        },
        '& img':{
            width:'11px'
        }
    }
}))


const AdvancedFilters = ({ defaultFilters, updateFilters, vehicleType: vehicleTypeProp, setVehicleType, className }) => {

    const [hiddenFormMobile, hideFormMobile] = useState(true)
    const toggleFiltersMobile = () => {
        hideFormMobile((hiddenFormMobile) => !hiddenFormMobile)
    }

    const cache = useRef({})
    const classes = useStyles()
    const { t } = useTranslation()
    const router = useRouter()

    const [_vehicleType, _setVehicleType] = useState(router.query? router.query.vehicleType: vehicleTypes.car)

    const vehicleType = typeof setVehicleType === "function" ? vehicleTypeProp : _vehicleType

    const isCar = (vehicleType? vehicleType: vehicleTypes.car) === vehicleTypes.car
    const [, , coordinates] = useAddress()
    const vehicleTypeModel = vehicleTypeRefModels[(vehicleType? vehicleType: vehicleTypes.car)]
    const { isAuthReady, authenticatedUser } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    const limitwidth = useMediaQuery('(max-width:480px)')
    const { dispatchModalError } = useContext(MessageContext)
    const [hiddenForm, hideForm] = useState(false)
    const DynamicFiltersComponent = SwitchFiltersVehicleType(vehicleType)
    const [announceTypesFiltered, setAnnouncesTypesFiltered] = useState(AnnounceTypes())
    const defaultValues = {
        ...defaultFilters
    }
    const { watch, register, control, setValue, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })

    const [manufacturersData, setManufacturersData] = useState({
        makes: [],
        models: [],
        generations: [],
        years: []
    })

    const selectedMake = watch('manufacturer.make')
    const selectedModel = watch('manufacturer.model')

    useEffect(() => {
        _setVehicleType(vehicleType || vehicleTypes.car)
    }, [_vehicleType])

    useEffect(() => {
        setValue('manufacturer.model', null)
        setValue('year', null)
    }, [selectedMake])

    useEffect(() => {
        setValue('year', null)
    }, [selectedModel])


    const onSubmit = useCallback(async (form, e, name) => {

        var empty
        for(var key in form) {
            if(form[key] === null) form[key] = empty
        }

        if(e !== null && e?.type !== null)  if(typeof e?.type === "submit")   e.preventDefault()

        const { coordinates, radius } = form
        const filtersFlat = filterProps(form)
        const data = { ...filtersFlat }

        if (coordinates && radius) {
            data.radius = radius
            data.coordinates = coordinates
            data.enableGeocoding = true
        }

        updateFilters(data)
    })


    const toggleFilters = () => {
        hideForm((hiddenForm) => !hiddenForm)
    }

    const fetchMakes = useCallback(async () => {
        const cacheKey = `${vehicleType}_makes`

        if(!cache.current[cacheKey]) {
            await VehiclesService.getMakes(vehicleTypeModel)
                .then(makes => {
                    if(!Array.isArray(makes)) makes = [makes]
                    const makesOptions = makes.map(make => ({
                        value: make._id,
                        label: make.make
                    }))

                    const defaultOption = {
                        value: 'other',
                        label: 'Je ne sais pas/Autre'
                    }

                    const data = [...makesOptions, defaultOption]
                    cache.current[cacheKey] = data

                    setManufacturersData(manufacturersData => (
                        {
                            ...manufacturersData,
                            makes: data
                        })
                    )
                })
                .catch(err => {
                    dispatchModalError({ err })
                })
        } else{
            setManufacturersData(manufacturersData => (
                {
                    ...manufacturersData,
                    makes: cache.current[cacheKey]
                })
            )
        }

    },[vehicleTypeModel])

    const fetchModels = useCallback(async ()=> {
        const make = selectedMake?.label
        const cacheKey = `${vehicleType}_makes_${make}_models`

        if (!make) return
        if(!cache.current[cacheKey]) {
            console.log('fetch models')
            const modelsService = isCar ? VehiclesService.getCarsDistinctModels
                : VehiclesService.getMakeModels

            await modelsService(vehicleTypeModel, make)
                .then(models => {
                    if(!Array.isArray(models)) models = [models]
                    let modelsOptions = []

                    if(isCar){
                        modelsOptions = models.map(model => ({
                            value: model,
                            label: model
                        }))
                    }
                    else {
                        modelsOptions = models.map(model => ({
                            value: model._id,
                            label: model.model
                        }))
                    }

                    const defaultOption = {
                        value: 'other',
                        label: 'Je ne sais pas/Autre'
                    }

                    const data = [...modelsOptions, defaultOption]
                    cache.current[cacheKey] = data

                    setManufacturersData(manufacturersData => (
                        {
                            ...manufacturersData,
                            models: data
                        })
                    )
                })
                .catch(err => {
                    dispatchModalError({
                        err,
                        persist: true
                    })
                })
        } else {
            setManufacturersData(manufacturersData => (
                {
                    ...manufacturersData,
                    models: cache.current[cacheKey]
                })
            )
        }
    },[selectedMake])

    const fetchModelsYears = useCallback(async() => {
        const make = selectedMake?.label
        const model = selectedModel?.value
        const cacheKey = `${vehicleType}_makes_${make}_models_${model}`

        if (!make || !model) return
        if(!cache.current[cacheKey]) {
            console.log('fetch cars models years')
            await VehiclesService.getCarsMakeModelTrimYears(make, model)
                .then(years => {
                    if(!Array.isArray(years)) years = [years]

                    const yearsOptions = years.map(year => ({
                        value: year._id,
                        label: year.year
                    }))

                    const defaultOption = {
                        value: 'other',
                        label: 'Je ne sais pas/Autre'
                    }

                    const data = [...yearsOptions, defaultOption]
                    cache.current[cacheKey] = data

                    setManufacturersData(manufacturersData => (
                        {
                            ...manufacturersData,
                            years: data
                        })
                    )
                })
                .catch(err => {
                    dispatchModalError({ err })
                })
        } else {
            setManufacturersData(manufacturersData => (
                {
                    ...manufacturersData,
                    years: cache.current[cacheKey]
                })
            )
        }
    },[vehicleTypeModel, selectedMake?.value, selectedModel?.value])

    useEffect(()=>{
        toggleFilters()
    },[isMobile])

    useEffect(()=>{
        const isPro = authenticatedUser.getIsPro
        if(!isPro) setAnnouncesTypesFiltered(types => types.filter(type => type.value !== 'sale-pro'))
    },[authenticatedUser, isAuthReady])

    useEffect(() => {
        register({ name: 'coordinates' })
        setValue('coordinates', coordinates)
    }, [coordinates])

    useEffect(() => {
        fetchMakes()
    }, [fetchMakes])

    useEffect(() => {
        const make = selectedMake?.label
        if (!make) return
        fetchModels()
    }, [selectedMake, fetchModels])

    useEffect(() => {
        const model = selectedModel?.label
        if (!model) return
        fetchModelsYears()
    }, [selectedModel, fetchModelsYears])

    return (
        <div className={clsx(classes.filtersContainer, className)}>
            <form className="filters_form" onSubmit={handleSubmit(onSubmit)}>

                {isMobile ? (
                    <div>
                        <ClearAndFeed defaultFilters={defaultFilters} />
                        <div className={clsx(classes.rowbuttons)}>
                            <VehicleType defaultFilters={defaultFilters} submit={onSubmit} />
                            <AnnounceType submit={onSubmit} defaultFilters={defaultFilters} limitwidth={limitwidth} />

                            <div className={clsx(hiddenFormMobile && classes.filtersHidden)} >
                                <Brand defaultFilters={defaultFilters} submit={onSubmit} brands={manufacturersData.makes} />
                                <Model submit={onSubmit} defaultFilters={defaultFilters} models={manufacturersData.models}/>
                                <Year submit={onSubmit} defaultFilters={defaultFilters} />
                                <Price submit={onSubmit} defaultFilters={defaultFilters} />
                                <Cylinder defaultFilters={defaultFilters} submit={onSubmit} />
                                <div className={clsx(classes.btnfontsize)}>
                                    {DynamicFiltersComponent && (
                                        <DynamicFiltersComponent
                                            control={control}
                                            errors={errors}
                                            watch={watch}
                                            dynamicOnSubmit={onSubmit}
                                            dynamicHandleSubmit={handleSubmit}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className={clsx(!hiddenFormMobile && classes.filtersHidden)} style={{ width:'100%', display:'flex' }}>
                                <Col className={clsx(!hiddenFormMobile && classes.filtersHidden)}sm={5} xs={1}> </Col>
                                <Col
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        transform: 'translate(25px, -44px)'

                                    }}>
                                    <div className={clsx(!hiddenFormMobile && classes.filtersHidden)} style={{
                                        backgroundColor: '#ffffffeb',
                                        width: '40px'
                                    }}/>
                                    <div className={clsx(!hiddenFormMobile && classes.filtersHidden, classes.filterbutton)} onClick={() => toggleFiltersMobile()} style={{ transform: 'translate(-25px, 0px)', width: '232px' }}>
                                        <NewIcons.filter alt='filter' style={{ marginRight:'10px' }} />
                                        {t('filters:select-filters')}
                                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')}/>
                                    </div>
                                </Col>
                            </div>

                            <div className={clsx(hiddenFormMobile && classes.filtersHidden)}>
                                <div  onClick={() => toggleFiltersMobile()} style={{ height:'20px' }}>
                                    <label> ... </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <ClearAndFeed defaultFilters={defaultFilters} />
                        <div className={clsx(classes.rowbuttons)}>
                            <VehicleType defaultFilters={defaultFilters} submit={onSubmit} />
                            <AnnounceType submit={onSubmit} defaultFilters={defaultFilters} limitwidth={limitwidth} />
                            <Brand defaultFilters={defaultFilters} submit={onSubmit} brands={manufacturersData.makes} />
                            <Model submit={onSubmit} defaultFilters={defaultFilters} models={manufacturersData.models}/>
                            <Year submit={onSubmit} defaultFilters={defaultFilters} />
                            <Price submit={onSubmit} defaultFilters={defaultFilters} />
                            <Cylinder defaultFilters={defaultFilters} submit={onSubmit} />

                            <div className={clsx(hiddenForm && classes.filtersHidden)} >
                                {DynamicFiltersComponent && (
                                    <DynamicFiltersComponent
                                        control={control}
                                        errors={errors}
                                        watch={watch}
                                        dynamicOnSubmit={onSubmit}
                                        dynamicHandleSubmit={handleSubmit}
                                    />
                                )}
                            </div>

                            <div className={clsx(!hiddenForm && classes.filtersHidden)} style={{ width:'100%', display:'flex' }}>
                                <div className={clsx(!hiddenForm && classes.filtersHidden)} style={{ width:'70.5%' }}> </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        transform: 'translate(25px, -44px)',
                                        width:"29.5%"
                                    }}>
                                    <div className={clsx(!hiddenForm && classes.filtersHidden)} style={{ backgroundColor: '#ffffffeb', width: '40px' }}/>
                                    <div className={clsx(!hiddenForm && classes.filtersHidden, classes.filterbutton)} onClick={() => toggleFilters()} style={{ transform: 'translate(-25px, 0px)' }}>
                                        <NewIcons.filter alt='filter' style={{ marginRight:'10px' }} />
                                        {t('filters:select-filters')}
                                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')}/>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx(hiddenForm && classes.filtersHidden)}>
                                <div  onClick={() => toggleFilters()} style={{ height:'20px' }}>
                                    <label> ... </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}


AdvancedFilters.defaultProps = {
    vehicleType : vehicleTypesDefault[0]?.value
}

export default memo(AdvancedFilters)
