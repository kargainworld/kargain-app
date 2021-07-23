import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FilterListIcon from '@material-ui/icons/FilterList'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import StorefrontIcon from '@material-ui/icons/Storefront'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTranslation from 'next-translate/useTranslation'
import filterProps from '../../../libs/filterProps'
import SelectInput from '../../Form/Inputs/SelectInput'
import FieldWrapper from '../../Form/FieldWrapper'
import { useAuth } from '../../../context/AuthProvider'
import { MessageContext } from '../../../context/MessageContext'
import vehicleTypesDefault, { vehicleTypes, vehicleTypeRefModels } from '../../../business/vehicleTypes.js'
import AnnounceTypes from '../../../business/announceTypes.js'
import VehiclesService from '../../../services/VehiclesService'
import SwitchFiltersVehicleType from './SwitchFiltersVehicleType'
import useAddress from '../../../hooks/useAddress'
import CTALink from '../../CTALink'
import {Col, Row} from "reactstrap";

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
    }
}))


const FiltersAdvanced = ({ defaultFilters, updateFilters, vehicleType: vehicleTypeProp, setVehicleType, className }) => {
    const [_vehicleType, _setVehicleType] = useState(vehicleTypes.car)

    const vehicleType = typeof setVehicleType === "function" ? vehicleTypeProp : _vehicleType

    const onVehicleTypeChange = (...args) => {
        if (typeof setVehicleType === 'function') {
            return setVehicleType(...args)
        }

        return _setVehicleType(...args)
    }

    const cache = useRef({})
    const classes = useStyles()
    const { t } = useTranslation()
    const isCar = vehicleType === vehicleTypes.car
    const [, , coordinates] = useAddress()
    const vehicleTypeModel = vehicleTypeRefModels[vehicleType]
    const { isAuthReady, authenticatedUser } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    const { dispatchModalError } = useContext(MessageContext)
    const [hiddenForm, hideForm] = useState(true)
    const DynamicFiltersComponent = SwitchFiltersVehicleType(vehicleType)
    const [announceTypesFiltered, setAnnouncesTypesFiltered] = useState(AnnounceTypes())
    const defaultValues = {
        ...defaultFilters,
        vehicleType : vehicleTypesDefault[0],
        adType : AnnounceTypes[0]
    }

    const {watch, register, control, setValue, errors, handleSubmit } = useForm({
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
        setValue('manufacturer.model', null)
        setValue('year', null)
    }, [selectedMake])

    useEffect(() => {
        setValue('year', null)
    }, [selectedModel])

    const onSubmit = (form, e, name) => {

        var empty
        for (var key in form) {
            if(form[key] === null) form[key] = empty
        }

        if(e !== null)  if(typeof e.type === "submit")   e.preventDefault()

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

    const toggleFilters = () => {
        hideForm((hiddenForm) => !hiddenForm)
    }

    const fetchMakes = useCallback(async () => {
        const cacheKey = `${vehicleType}_makes`

        if(!cache.current[cacheKey]) {
            console.log('fetch makes')
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

    return(
        <div className={clsx(classes.filtersContainer, className)}>
            <form className="filters_form" onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <div className={clsx(hiddenForm && classes.filtersHidden)}>
                        <Col xs="6" sm="4">
                            <FieldWrapper label={t('vehicles:vehicle-type')}>
                                <SelectInput
                                    name="vehicleType"
                                    control={control}
                                    errors={errors}
                                    options={vehicleTypesDefault()}
                                    onChange={(selected, name) =>{
                                        // onVehicleTypeChange(selected.value)
                                        setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                        return selected
                                    }}
                                />
                            </FieldWrapper>
                        </Col>
                        <Col xs="6" sm="4">
                            <FieldWrapper label={t('vehicles:vehicle-type')}>
                                <SelectInput
                                    name="vehicleType"
                                    control={control}
                                    errors={errors}
                                    options={vehicleTypesDefault()}
                                    onChange={(selected, name) =>{
                                        // onVehicleTypeChange(selected.value)
                                        setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                        return selected
                                    }}
                                />
                            </FieldWrapper>
                        </Col>
                        <Col sm="4">
                            <FieldWrapper label={t('vehicles:vehicle-type')}>
                                <SelectInput
                                    name="vehicleType"
                                    control={control}
                                    errors={errors}
                                    options={vehicleTypesDefault()}
                                    onChange={(selected, name) =>{
                                        // onVehicleTypeChange(selected.value)
                                        setTimeout(handleSubmit((data) => onSubmit(data, selected, name)), 100)
                                        return selected
                                    }}
                                />
                            </FieldWrapper>
                        </Col>
                    </div>
                </Row>
            </form>
        </div>

    )
}

const ControlButtons = () => {
    const { t } = useTranslation()

    return (
        <div className="d-flex flex-column my-3">
            <Button
                className="my-1"
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon/>}
                type="submit"
            >
                {t('vehicles:apply-filters')}
            </Button>
        </div>
    )
}

FiltersAdvanced.defaultProps = {
    vehicleType : vehicleTypesDefault[0]?.value
}

export default memo(FiltersAdvanced)

