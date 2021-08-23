import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/router";
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FilterListIcon from '@material-ui/icons/FilterList'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import StorefrontIcon from '@material-ui/icons/Storefront';
import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTranslation from 'next-translate/useTranslation'
import filterProps from '../../../libs/filterProps'
import SelectInput from '../../Form/Inputs/SelectInput'
import SliderInput from '../../Form/Inputs/SliderInputUI'
import FieldWrapper from '../../Form/FieldWrapper'
import { useAuth } from '../../../context/AuthProvider'
import { MessageContext } from '../../../context/MessageContext'
import vehicleTypesDefault, {vehicleTypes, vehicleTypeRefModels } from '../../../business/vehicleTypes.js'
import AnnounceTypes from '../../../business/announceTypes.js'
import VehiclesService from '../../../services/VehiclesService'
import SwitchFiltersVehicleType from './SwitchFiltersVehicleType'
import useAddress from '../../../hooks/useAddress'
import CTALink from '../../CTALink'

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Row } from 'reactstrap'
import { Emoji } from 'react-apple-emojis'
import { ListGroup, ListGroupItem } from 'reactstrap';
import customColors from '../../../theme/palette'

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
        display: 'none'
    },
    buttondropdown:{
        '& button':{
                borderRadius: '26.8293px !important',
                borderColor:'#dcd7d7 !important',
                backgroundColor: '#c4c4c400 !important',
                color: 'black !important',
                cursor: 'pointer',
                fontSize:"17.1707px !important",
                '& button:clicked': {
                    borderRadius: '25px !important',
                    backgroundColor: '#c4c4c447 !important',
                    color: 'black !important',
                    fontSize:"17.1707px !important",
                },
                '& button:after': {
                    FONTVARIANT: 'JIS83 !important',
                    display: 'inline-block !important',
                    marginLeft: '0.355em !important',
                    verticalAlign: '0.255em !important',
                    content: " !important",
                    borderTop: '0.4em solid !important',
                    borderRight: '0.4em solid transparent !important',
                    borderBottom: '0 !important',
                    borderLeft:' 0.4em solid transparent !important',
                    marginLeft:'5px !important',
                }
            }
        },
    rowbuttons:{
        padding: '10px',
        position: 'relative',
        backgroundColor: '#fff',
        margin: '10px',

        // background-color: lightblue;
        // width: 40px;
        // overflowX: 'auto',
    },   
    overflow:{
        overflowX:'auto',
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        background: customColors.gradient.main
    },
}))

const AdvancedFilters = ({ defaultFilters, updateFilters, vehicleType: vehicleTypeProp, setVehicleType, className }) => {

    const cache = useRef({})
    const classes = useStyles()
    const { t } = useTranslation()
    const router = useRouter();
    
    const [_vehicleType, _setVehicleType] = useState(router.query? router.query.vehicleType: vehicleTypes.car)

    const vehicleType = typeof setVehicleType === "function" ? vehicleTypeProp : _vehicleType

    const onVehicleTypeChange = (...args) => {
        if (typeof setVehicleType === 'function') {
            return setVehicleType(...args)
        }

        return _setVehicleType(...args)
    }

    const isCar = (vehicleType? vehicleType: vehicleTypes.car) === vehicleTypes.car
    const [, , coordinates] = useAddress()
    const vehicleTypeModel = vehicleTypeRefModels[(vehicleType? vehicleType: vehicleTypes.car)]
    const { isAuthReady, authenticatedUser } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    const { dispatchModalError } = useContext(MessageContext)
    const [hiddenForm, hideForm] = useState(true)
    const DynamicFiltersComponent = SwitchFiltersVehicleType(vehicleType)
    const [announceTypesFiltered, setAnnouncesTypesFiltered] = useState(AnnounceTypes())
    const defaultValues = {
        ...defaultFilters
    }
    const {watch, register, control, setValue, getValues, errors, handleSubmit, reset } = useForm({
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
        _setVehicleType(vehicleType || vehicleTypes.car);
    }, [_vehicleType])

    useEffect(() => {
        setValue('manufacturer.model', null);
        setValue('year', null);
    }, [selectedMake]);

    useEffect(() => {
        setValue('year', null);
    }, [selectedModel]);
    
    const onSubmit = (form, e, name) => {
        
        var empty;
        for(var key in form) {
            if(form[key] === null) form[key] = empty;
        }

        if(e !== null && e?.type !== null)  if(typeof e?.type === "submit")   e.preventDefault();
        
        const { coordinates, radius } = form
        const filtersFlat = filterProps(form)
        const data = { ...filtersFlat }
        
        if (coordinates && radius) {
            data.radius = radius
            data.coordinates = coordinates
            data.enableGeocoding = true
        }

        updateFilters(data)
    }

    const onResetFilter = (form, e) => {
        const filters = getValues();
        for(let key in filters){
            setValue(key, "")
        }
        router.push({
            pathname: router.pathname
        })
    }

    const toggleFilters = () => {
        hideForm((hiddenForm) => !hiddenForm);
    };

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
                <CTALink
                    className={clsx(classes.button)}
                    icon={StorefrontIcon}
                    title={t('layout:news_feed')}
                    href="/advanced-search">
                </CTALink>
                <ControlButtons 
                    resetFilter={onResetFilter}
                    dynamicHandleSubmit={handleSubmit}
                />
              <div className={classes.filtersTop} onClick={() => toggleFilters()}>
                <Typography variant="h4">
                  {t('filters:select-filters')}
                  <i className={clsx('ml-2', 'arrow_nav', hiddenForm ? 'is-top' : 'is-bottom')}/>
                </Typography>
              </div>

                <div className={clsx(hiddenForm && classes.filtersHidden)}>
                    <FieldWrapper label={t('vehicles:vehicle-type')}>
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

                    <FieldWrapper label={t('vehicles:announce-type')}>
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

                    <FieldWrapper label={t('vehicles:make')}>
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

                    <FieldWrapper label={t('vehicles:model')}>
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

                    <FieldWrapper label={t('vehicles:year')}>                        
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
                        {/* <SelectInput
                            name="year"
                            placeholder="Select year"
                            options={manufacturersData.years}
                            control={control}
                            errors={errors}
                            disabled={!watch('manufacturer.model') || !isCar}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                return selected
                            }}
                        /> */}
                    </FieldWrapper>

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
            </form>
        </div>
    )
}

const ControlButtons = ({...props}) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
       
            <Button
                className={ clsx(classes.button)}
                
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon/>}
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
