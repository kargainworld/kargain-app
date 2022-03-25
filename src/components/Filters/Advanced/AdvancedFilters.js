import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/router"
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import filterProps from 'libs/filterProps'
import { useAuth } from 'context/AuthProvider'
// import { MessageContext } from 'context/MessageContext'
import vehicleTypesDefault, { vehicleTypes, vehicleTypeRefModels } from 'business/vehicleTypes.js'
import AnnounceTypes from 'business/announceTypes.js'
import VehiclesService from 'services/VehiclesService'
import SwitchFiltersVehicleType from './SwitchFiltersVehicleType'
import useAddress from 'hooks/useAddress'
import ClearAndFeed from "./Components/ClearAndNews"
import VehicleType from "./Components/VehicleType"
import AnnounceType from "./Components/AnnounceType"
import Brand from "./Components/Brand"
import Model from "./Components/Model"
import Year from "./Components/Year"
import Price from "./Components/Price"
import Cylinder from "./Components/Cylinder"
import ShowAllFilters from "./Components/ShowAllFilters"
import { useMessage } from '../../../context/MessageContext'


const useStyles = makeStyles(() => ({

    filtersContainer: {
        padding: '.5rem'
    },
    filtersHidden: {
        display: 'none !important'
    },
    rowbuttons:{
        position: 'relative',
        backgroundColor: '#fff',
        marginTop:'20px'
    }
}))


const AdvancedFilters = ({ defaultFilters, updateFilters, vehicleType: vehicleTypeProp, setVehicleType, className }) => {

    const [hiddenFormMobile, hideFormMobile] = useState(true)
    const toggleFiltersMobile = useCallback(async  => {
        hideFormMobile((hiddenFormMobile) => !hiddenFormMobile)
    })

    const cache = useRef({})
    const classes = useStyles()
    const router = useRouter()

    const [_vehicleType, _setVehicleType] = useState(router.query? router.query.vehicleType: vehicleTypes.car)

    const vehicleType = typeof setVehicleType === "function" ? vehicleTypeProp : _vehicleType

    const isCar = (vehicleType? vehicleType: vehicleTypes.car) === vehicleTypes.car
    const [, , coordinates] = useAddress()
    const vehicleTypeModel = vehicleTypeRefModels[(vehicleType? vehicleType: vehicleTypes.car)]
    const { isAuthReady, authenticatedUser } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    const limitwidth = useMediaQuery('(max-width:480px)')
    const { dispatchModalError } = useMessage()
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

        if(e !== null && e?.type !== null)  if(typeof e?.type === "object")   e.preventDefault()

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


    const toggleFilters = useCallback(async  => {
        hideForm((hiddenForm) => !hiddenForm)
    })

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
                <div>
                    <ClearAndFeed defaultFilters={defaultFilters} />
                    <div className={clsx(classes.rowbuttons)}>
                        <VehicleType defaultFilters={defaultFilters} submit={onSubmit} />
                        <AnnounceType submit={onSubmit} defaultFilters={defaultFilters} limitwidth={limitwidth} />

                        {
                            isMobile ?
                                <div className={clsx(hiddenFormMobile && classes.filtersHidden)} >
                                    <Brand defaultFilters={defaultFilters} submit={onSubmit} brands={manufacturersData.makes} />
                                    <Model submit={onSubmit} defaultFilters={defaultFilters} models={manufacturersData.models}/>
                                    <Year submit={onSubmit} defaultFilters={defaultFilters} />
                                    <Price submit={onSubmit} defaultFilters={defaultFilters} />
                                    <Cylinder defaultFilters={defaultFilters} submit={onSubmit} />
                                </div>
                                :
                                <>
                                    <Brand defaultFilters={defaultFilters} submit={onSubmit} brands={manufacturersData.makes} />
                                    <Model submit={onSubmit} defaultFilters={defaultFilters} models={manufacturersData.models}/>
                                    <Year submit={onSubmit} defaultFilters={defaultFilters} />
                                    <Price submit={onSubmit} defaultFilters={defaultFilters} />
                                    <Cylinder defaultFilters={defaultFilters} submit={onSubmit} />
                                </>
                        }

                        <ShowAllFilters hiddenForm={hiddenForm} toggleFilters={toggleFilters} hiddenFormMobile={hiddenFormMobile} toggleFiltersMobile={toggleFiltersMobile} />

                        {
                            isMobile ?
                                <>

                                    <div className={clsx(hiddenFormMobile && classes.filtersHidden)}>
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
                                    <div className={clsx(hiddenFormMobile && classes.filtersHidden)}>
                                        <div  onClick={() => toggleFiltersMobile()} style={{ height:'20px' }}>
                                            <label> ... </label>
                                        </div>
                                    </div>
                                </>
                                :
                                <>

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
                                    <div className={clsx(hiddenForm && classes.filtersHidden)}>
                                        <div  onClick={() => toggleFilters()} style={{ height:'20px' }}>
                                            <label> ... </label>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}


AdvancedFilters.defaultProps = {
    vehicleType : vehicleTypesDefault[0]?.value
}

export default memo(AdvancedFilters)
