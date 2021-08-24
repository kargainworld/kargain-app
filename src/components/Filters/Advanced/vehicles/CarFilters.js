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
import { Row } from 'reactstrap'
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Emoji } from 'react-apple-emojis'
import { ListGroup, ListGroupItem } from 'reactstrap';

const useStyles = makeStyles(() => ({
    buttondropdown:{
        '& button':{
                borderRadius: '26.8293px !important',
                borderColor:'#dcd7d7 !important',
                backgroundColor: '#c4c4c400 !important',
                color: 'black !important',
                cursor: 'pointer',
                fontSize:"17.1707px !important",
                marginLeft: '15px !important',
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
            <div className={clsx(classes.overflow)}>
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="dollar-banknote" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:price')}
                    </DropdownToggle>
                    <DropdownMenu>
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
                                    setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                                    return e
                                }}
                            />
                        </FieldWrapper>

                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="joystick" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:type')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper >
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

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="stopwatch" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t(`vehicles:${mileageType?.label}`)}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper >
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
                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="globe-showing-americas" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:gear-box')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:gas')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="nut-and-bolt" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:cylinder')}
                    </DropdownToggle>
                    <DropdownMenu>
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
                                    setTimeout(props.dynamicHandleSubmit((data) => props.dynamicOnSubmit(data, e)), 100)
                                    return e
                                }}
                            />
                        </FieldWrapper>
                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="stopwatch" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:power')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="globe-showing-americas" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:country')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>

                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:address')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
                
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:class_emission')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:radius')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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

                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:equipments')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper >
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

                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="alarm-clock" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:co2-consumption')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="sport-utility-vehicle" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:doors_quantity')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:seats_quantity')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="house" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:paint')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="artist-palette" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:external_color')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="artist-palette" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:internal_color')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="18" style={{marginLeft: '10px', marginRight: '10px', marginBottom: '3%'}}/>
                        {t('vehicles:vehicle-state')}
                    </DropdownToggle>
                    <DropdownMenu>
                        <FieldWrapper>
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
                    </DropdownMenu>
                </ButtonDropdown>
            
            </div>
            {/* <FieldWrapper label={t('vehicles:price')}>
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
            </FieldWrapper> */}
        
        </>
    )
}

CarFilters.propTypes = {
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    watch: PropTypes.func
}

export default CarFilters
