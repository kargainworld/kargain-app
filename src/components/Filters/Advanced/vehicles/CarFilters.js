import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import SelectInput from '../../../Form/Inputs/SelectInput'
import SliderInput from '../../../Form/Inputs/SliderInputUI'
import SelectCountryFlags from '../../../Form/Inputs/SelectCountryFlags'
import SearchLocationInput from '../../../Form/Inputs/SearchLocationInput'
import FieldWrapper from '../../../Form/FieldWrapper'
import localeDataHelper from '../../../../libs/localeDataHelper'
import { vehicleTypes } from '../../../../business/vehicleTypes'
import { MessageContext } from '../../../../context/MessageContext'

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Emoji } from 'react-apple-emojis'

const useStyles = makeStyles(() => ({
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
        }
            
	}))

const CarFilters = ({ control, watch, errors, ...props }) => {
    const classes = useStyles()

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen);

    const { t, lang } = useTranslation()
    const countrySelect = watch('countrySelect')
    const selectedMileage = watch('mileageType')
    const [ mileageType, setMileageType ] = useState(null);
    const { dispatchModalError } = useContext(MessageContext)
    const [formData, setFormData] = useState({
        mileageType: [],
        RadioVehicleGeneralState: [],
        CheckboxOptionsEquipments: [],
        RadioChoicesGas: [],
        RadioFunctionVehicle: [],
        RadioTypeFunction: [],
        RadioChoicesEngine: [],
        RadioChoicesEmission: [],
        RadioChoiceBeds: [],
        RadioChoicesPaints: [],
        RadioChoicesMaterials: [],
        RadioChoicesExternalColor: []
    })

    const getData = useCallback(async () => {
        try{
            const data = await localeDataHelper.getLocaleData(vehicleTypes.car, lang)
            setFormData(data)
        }catch (err){
            dispatchModalError({ err, persist : true})
        }
    },[lang])

    useEffect(() => {
        getData()
    }, [getData])

    useEffect(() => {
        setMileageType(selectedMileage || {
            label: 'kilometer',
            value: 'km'
        });
    }, [selectedMileage])

    // const onChange = (form, e) => {
    //     props.formSubmit(form, e);
    // }
    return (
        <>  
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                
                <DropdownToggle caret>
                    <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                    Button Dropdown
                </DropdownToggle>
                <DropdownMenu>
                    <FieldWrapper label={t('vehicles:type')}>
                        <SelectInput
                            name="mileageType"
                            options={formData.mileageType}
                            control={control}
                            errors={errors}
                            onChange={(selected, name) =>{
                                setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>

            <FieldWrapper label={t('vehicles:price')}>
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
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:type')}>
                <SelectInput
                    name="mileageType"
                    options={formData.mileageType}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>
            
            <FieldWrapper label={t(`vehicles:${mileageType?.label}`)}>
                <SliderInput
                    name="mileage"
                    defaultValue={[1, 50000]}
                    min={0}
                    max={200000}
                    step={100}
                    errors={errors}
                    control={control}
                    suffix={mileageType?.value}
                    onChange={e =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:gear-box')}>
                <SelectInput
                    name="vehicleEngineType"
                    options={formData.RadioTypeFunction}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:gas')}>
                <SelectInput
                    name="vehicleEngineGas"
                    className="mb-2"
                    options={formData.RadioChoicesGas}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:cylinder')}>
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
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:power')}>
                <SliderInput
                    name="powerKw"
                    min={0}
                    max={200}
                    step={1}
                    errors={errors}
                    control={control}
                    suffix="kw"
                    onChange={e =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:country')}>
                <SelectCountryFlags
                    name="countrySelect"
                    errors={errors}
                    control={control}
                    onChange={(selected) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected.value)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:address')}>
                <SearchLocationInput
                    name="address"
                    country={countrySelect?.value}
                    control={control}
                    errors={errors}
                    onChange={(selected) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected)), 100)
                        return selected
                    }}
                    >
                </SearchLocationInput>
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:radius')}>
                <SliderInput
                    name="radius"
                    min={0}
                    max={500}
                    step={5}
                    control={control}
                    errors={errors}
                    suffix="km"
                    onChange={e =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:equipments')}>
                <SelectInput
                    name="equipments"
                    options={formData.CheckboxOptionsEquipments}
                    isMulti
                    defaultChecked={['ABS', 'ESP']}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:class_emission')}>
                <SelectInput
                    name="emission"
                    options={formData.RadioChoicesEmission}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:co2-consumption')}>
                <SliderInput
                    name="consumptionGkm"
                    min={0}
                    max={200}
                    step={1}
                    errors={errors}
                    control={control}
                    suffix="kw"
                    onChange={e =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:doors_quantity')}>
                <SliderInput
                    name="doors"
                    min={1}
                    max={10}
                    step={1}
                    errors={errors}
                    control={control}
                    onChange={e =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:seats_quantity')}>
                <SliderInput
                    name="seats"
                    min={1}
                    max={10}
                    step={1}
                    errors={errors}
                    control={control}
                    onChange={e =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                        return e
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:paint')}>
                <SelectInput
                    name="paint"
                    control={control}
                    options={formData.RadioChoicesPaints}
                    citycontrol={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:external_color')}>
                <SelectInput
                    name="externalColor"
                    options={formData.RadioChoicesMaterials}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:internal_color')}>
                <SelectInput
                    name="internalColor"
                    options={formData.RadioChoicesMaterials}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:vehicle-state')}>
                <SelectInput
                    name="vehicleGeneralState"
                    options={formData.RadioVehicleGeneralState}
                    control={control}
                    errors={errors}
                    onChange={(selected, name) =>{
                        setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, selected, name)), 100)
                        return selected
                    }}
                />
            </FieldWrapper>
        </>
    )
}

CarFilters.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    watch: PropTypes.func
}

export default CarFilters
