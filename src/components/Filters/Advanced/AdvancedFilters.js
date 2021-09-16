import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/router"
import clsx from 'clsx'

import Button from '@material-ui/core/Button'



import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTranslation from 'next-translate/useTranslation'
import filterProps from '../../../libs/filterProps'
import SelectInput from '../../Form/Inputs/SelectInput'
import SliderInput from '../../Form/Inputs/SliderInputUI'
import FieldWrapper from '../../Form/FieldWrapper'
import { useAuth } from '../../../context/AuthProvider'
import { MessageContext } from '../../../context/MessageContext'
import vehicleTypesDefault, { vehicleTypes, vehicleTypeRefModels } from '../../../business/vehicleTypes.js'
import AnnounceTypes from '../../../business/announceTypes.js'
import VehiclesService from '../../../services/VehiclesService'
import SwitchFiltersVehicleType from './SwitchFiltersVehicleType'
import useAddress from '../../../hooks/useAddress'


import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { Emoji } from 'react-apple-emojis'
import customColors from '../../../theme/palette'
import { NewIcons } from '../../../assets/icons'
// import Link from 'next/dist/client/link'
import Link from 'next-translate/Link'

const useStyles = makeStyles(() => ({

    filtersContainer: {
        padding: '.5rem'
    },

    filtersTop: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid gainsboro',

        '& h4': {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'pointer'
        }
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
            fontSize:"17.1707px !important",
            marginRight: '6px !important',
            '& button:clicked': {
                borderRadius: '25px !important',
                backgroundColor: '#c4c4c447 !important',
                color: 'black !important',
                fontSize:"17.1707px !important"
            },
            '&::after': {
                display: 'none !important'
                // FONTVARIANT: 'JIS83 !important',
                // display: 'inline-block !important',
                // marginLeft: '0.355em !important',
                // verticalAlign: '0.255em !important',
                // // content: "1 !important",
                // borderTop: '0.4em solid !important',
                // borderRight: '0.4em solid transparent !important',
                // borderBottom: '0 !important',
                // borderLeft:' 0.4em solid transparent !important',
                // marginLeft:'5px !important',
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
        // padding: '10px',
        position: 'relative',
        backgroundColor: '#fff',
        marginTop:'20px'
        // margin: '10px',

        // background-color: lightblue;
        // width: 40px;
        // overflowX: 'auto',
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
        //border: 'none',
        color: 'black',
        padding: '8px 15px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        // cursor: 'pointer',
        borderRadius: '26.8293px',
        border: 'solid #dcd7d7',
        borderWidth: '1px'
    },
    dropdownmenu: {
        position: 'absolute',
        width: '250px',
        // height: 105px;
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
    bordergradientbtn:{
        height:'39px',
        borderRadius: '100rem',
        //padding: '1rem',
        fontSize: '14px',        
        padding: '8px 30px 2px',
        //boxShadow: '0 0 6px 0 rgba(157, 96, 212, 0.5)',
        border: 'solid 2px transparent',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #2C65F6, #ED80EB)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '2px 1000px 1px #fff inset', 
        '&:hover': {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #0244ea, #e81ae5)'
        },
        
        '& label':{
        
            background: '-webkit-linear-gradient(#2C65F6, #ED80EB); -webkit-background-clip: text; -webkit-text-fill-color: transparent',
            backgroundImage: 'linear-gradient(60deg, #2C65F6, #ED80EB)',
            backgroundClip: 'text',
            color: 'transparent'
            
        }        
    }
}))


const AdvancedFilters = ({ defaultFilters, updateFilters, vehicleType: vehicleTypeProp, setVehicleType, className }) => {
    
    // const [dropdownOpen, setOpen] = new Array();
  
    const [dropdownOpen, setOpen] = useState(false)
    const toggle = () => setOpen(!dropdownOpen)

    const [dropdownOpen1, setOpen1] = useState(false)
    const toggle1 = () => setOpen1(!dropdownOpen1)

    const [dropdownOpen2, setOpen2] = useState(false)
    const toggle2 = () => setOpen2(!dropdownOpen2)

    const [dropdownOpen3, setOpen3] = useState(false)
    const toggle3 = () => setOpen3(!dropdownOpen3)

    const [dropdownOpen4, setOpen4] = useState(false)
    const toggle4 = () => setOpen4(!dropdownOpen4)

    const [dropdownOpen5, setOpen5] = useState(false)
    const toggle5 = () => setOpen5(!dropdownOpen5)

    const [dropdownOpen6, setOpen6] = useState(false)
    const toggle6 = () => setOpen6(!dropdownOpen6)

    const cache = useRef({})
    const classes = useStyles()
    const { t } = useTranslation()
    const router = useRouter()
    
    const [_vehicleType, _setVehicleType] = useState(router.query? router.query.vehicleType: vehicleTypes.car)

    const vehicleType = typeof setVehicleType === "function" ? vehicleTypeProp : _vehicleType

    //const onVehicleTypeChange = (...args) => {
    //    if (typeof setVehicleType === 'function') {
    //        return setVehicleType(...args)
    //    }

    //    return _setVehicleType(...args)
    //}

    const isCar = (vehicleType? vehicleType: vehicleTypes.car) === vehicleTypes.car
    const [, , coordinates] = useAddress()
    const vehicleTypeModel = vehicleTypeRefModels[(vehicleType? vehicleType: vehicleTypes.car)]
    const { isAuthReady, authenticatedUser } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    const { dispatchModalError } = useContext(MessageContext)
    const [hiddenForm, hideForm] = useState(false)
    const DynamicFiltersComponent = SwitchFiltersVehicleType(vehicleType)
    const [announceTypesFiltered, setAnnouncesTypesFiltered] = useState(AnnounceTypes())
    const defaultValues = {
        ...defaultFilters
    }
    const { watch, register, control, setValue, getValues, errors, handleSubmit, reset } = useForm({
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

    // useEffect(() => {
    //     reset(defaultValues);
    // }, [reset])

    // useEffect(() => {
    //     register(defaultValues);
    // }, [register])

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

    const [formData, setFormData] = useState({
        vehicleType: [],
        year: []
    })

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
    

    const onResetFilter = (form, e) => {
        const filters = getValues()
        for(let key in filters){
            setValue(key, "")
        }
        router.push({
            pathname: router.pathname
        })
    }

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
                <div id="new_feed" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom:'30px' }}>
                    
                    <ControlButtons 
                        resetFilter={onResetFilter}
                        dynamicHandleSubmit={handleSubmit}
                    />
                    <Link href="/advanced-search">
                        <a className={clsx(classes.bordergradientbtn)} style={{ textTransform: 'uppercase' }}>
                            <NewIcons.home_color style={{ marginRight:'10px', marginBottom:'5px' }}/>
                            <label> {t('layout:news_feed')} </label>   
                        </a>
                    </Link>
                    {/* <CTALink
                        className={clsx(classes.bordergradientbtn)}
                        // icon={{<NewIcons.home_color />}}
                        title={t('layout:news_feed')}
                        href="/advanced-search">
                        
                    </CTALink> */}
                </div>
                
                <div className={clsx(classes.rowbuttons)}>
                    <ButtonDropdown  id="button_1" isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                        <DropdownToggle caret id="button_1">
                            <Emoji name="automobile" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:vehicle-type')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenu)} >
                            <FieldWrapper>
                                <SelectInput
                                    name="vehicleType"
                                    control={control}
                                    errors={errors}
                                    options={vehicleTypesDefault()}
                                    selected={router.query.vehicleType}
                                    onChange={(e, name) =>{
                                        // onVehicleTypeChange(selected.value)
                                        setTimeout(handleSubmit((data) => onSubmit(data, e, name)), 100)
                                        return e
                                    }}

                                />
                            </FieldWrapper>
                        
                        </DropdownMenu>
                    </ButtonDropdown>

                    <ButtonDropdown id="buuton_2" isOpen={dropdownOpen1} toggle={toggle1} className={clsx(classes.buttondropdown)}  >
                        <DropdownToggle caret id="button_2">
                            <Emoji name="page-facing-up" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:announce-type')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenu)} id="buuton_2">
                            <FieldWrapper >
                                <SelectInput
                                    name="adType"
                                    control={control}
                                    errors={errors}
                                    options={announceTypesFiltered}
                                    selected={router.query.adType}
                                    onChange={(selected, name) =>{
                                        // setVehicleType(selected.value) // TODO: think it should be smth like "setAdType()"
                                        setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                        return selected
                                    }}
                                />
                            </FieldWrapper>
                        </DropdownMenu>
                    </ButtonDropdown>

                    <ButtonDropdown id="button_3" isOpen={dropdownOpen2} toggle={toggle2} className={clsx(classes.buttondropdown)} >
                        <DropdownToggle caret id="button_3">
                            <Emoji name="wrench" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:make')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenu)} id="button_3">
                            <FieldWrapper >
                                <SelectInput
                                    name="manufacturer.make"
                                    control={control}
                                    errors={errors}
                                    options={manufacturersData.makes}
                                    onChange={(selected, name) =>{
                                        setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                        return selected
                                    }}
                                />
                            </FieldWrapper>
                        </DropdownMenu>
                    </ButtonDropdown>
                    
                    <ButtonDropdown id="button_4" isOpen={dropdownOpen3} toggle={toggle3} className={clsx(classes.buttondropdown)} >
                        <DropdownToggle caret id="button_4">
                            <Emoji name="two-oclock" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:model')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenu)} id="button_4">
                            <FieldWrapper >
                                <SelectInput
                                    name="manufacturer.model"
                                    options={manufacturersData.models}
                                    control={control}
                                    errors={errors}
                                    disabled={!watch('manufacturer.make')}
                                    onChange={(selected, name) =>{
                                        setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                        return selected
                                    }}
                                />
                            </FieldWrapper>
                        </DropdownMenu>
                    </ButtonDropdown>
                    
                    <ButtonDropdown  id="button_5" isOpen={dropdownOpen4} toggle={toggle4} className={clsx(classes.buttondropdown)} >
                        <DropdownToggle caret id="button_5">
                            <Emoji name="calendar" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:year')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenuslide)} id="button_5">
                            <label className={clsx(classes.label)}>
                                {t('vehicles:year')}
                            </label>
                            <FieldWrapper >
                                <SliderInput
                                    name="year"
                                    defaultValue={[1900, 2021]}
                                    min={1900}
                                    max={2100}
                                    step={10}
                                    errors={errors}
                                    control={control}
                                    suffix=""
                                    onChange={e =>{
                                        setTimeout(handleSubmit((data) => onSubmit(data, e)), 100)
                                        return e
                                    }}
                                />
                            </FieldWrapper>
                            <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>1900</label>
                            <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>2100</label>
                    
                        </DropdownMenu>
                    </ButtonDropdown>
                     
                    <ButtonDropdown isOpen={dropdownOpen5} toggle={toggle5} className={clsx(classes.buttondropdown)} >
                        <DropdownToggle caret>
                            <Emoji name="dollar-banknote" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:price')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenuslide)}>
                            
                            <label className={clsx(classes.label)}>
                                {t('vehicles:price')}
                            </label>
                            <FieldWrapper >
                                <SliderInput
                                    name="price"
                                    defaultValue={[1000, 50000]}
                                    min={0}
                                    max={200000}
                                    step={1000}
                                    errors={errors}
                                    control={control}
                                    suffix="€"
                                    onChange={e =>{
                                        setTimeout(handleSubmit((data) => onSubmit(data, e)), 100)
                                        return e
                                    }}
                                />
                            </FieldWrapper>
                            
                            <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>0 €</label>
                            <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>200000 €</label>
                        </DropdownMenu>
                    </ButtonDropdown>

                    <ButtonDropdown isOpen={dropdownOpen6} toggle={toggle6} className={clsx(classes.buttondropdown)} >
                        <DropdownToggle caret>
                            <Emoji name="nut-and-bolt" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                            {t('vehicles:cylinder')}
                            <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                        </DropdownToggle>
                        <DropdownMenu className={clsx(classes.dropdownmenuslide)}>
                            <label className={clsx(classes.label)}>
                                {t('vehicles:cylinder')}
                            </label>
                            <FieldWrapper>
                                <SliderInput
                                    name="vehicleEngineCylinder"
                                    suffix="cm3"
                                    min={10}
                                    max={1000}
                                    step={10}
                                    defaultValue={[1, 1000]}
                                    errors={errors}
                                    control={control}
                                    onChange={e =>{
                                        setTimeout(handleSubmit((data) => onSubmit(data, e)), 100)
                                        return e
                                    }}
                                />
                            </FieldWrapper>
                            <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>10 cm3</label>
                            <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>1000 cm3</label>
                            
                        </DropdownMenu>
                    </ButtonDropdown>
 
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
                            <div className={clsx(!hiddenForm && classes.filtersHidden)} style={{ backgroundColor:'#ffffffeb', width:'40px' }}></div>
                            <div className={clsx(!hiddenForm && classes.filtersHidden, classes.filterbutton)} onClick={() => toggleFilters()} style={{ transform: 'translate(-25px, 0px)' }}>
                                
                                <NewIcons.filter alt='filter' style={{ marginRight:'10px' }} />
                                {/* <Typography variant="h4"> */}
                                {t('filters:select-filters')}
                                <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')}/>
                                {/* <i className={clsx('ml-2', 'arrow_nav', hiddenForm ? 'is-top' : 'is-bottom')}/> */}
                                {/* </Typography> */}
                            </div>
                        </div>  
                    </div>

                    <div className={clsx(hiddenForm && classes.filtersHidden)}>
                        <div  onClick={() => toggleFilters()} style={{ height:'20px' }}>
                            {/* <i className={clsx('ml-2', 'arrow_nav', 'is-top' )}/> */}
                            <label> ... </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

const ControlButtons = ({ ...props }) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
       
        <Button
            className={ clsx(classes.button)}
            variant="contained"
            color="primary"
            startIcon={<NewIcons.recycle_white style={{ marginBottom:'3px' }}/>}
            type="button"
            onClick={e =>{ props.resetFilter(e)}}
        >
            {t('vehicles:clear-filters')}
        </Button>
        
    )
}

AdvancedFilters.defaultProps = {
    vehicleType : vehicleTypesDefault[0]?.value
}

export default memo(AdvancedFilters)
