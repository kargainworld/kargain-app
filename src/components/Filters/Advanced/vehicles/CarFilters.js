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
                marginRight: '10px !important',
                marginTop: '5px !important',
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
    const [dropdownOpen1, setOpen1] = useState(false);
    const toggle1 = () => setOpen1(!dropdownOpen1);
    const [dropdownOpen2, setOpen2] = useState(false);
    const toggle2 = () => setOpen2(!dropdownOpen2);
    const [dropdownOpen3, setOpen3] = useState(false);
    const toggle3 = () => setOpen3(!dropdownOpen3);
    const [dropdownOpen4, setOpen4] = useState(false);
    const toggle4 = () => setOpen4(!dropdownOpen4);
    const [dropdownOpen5, setOpen5] = useState(false);
    const toggle5 = () => setOpen5(!dropdownOpen5);
    const [dropdownOpen6, setOpen6] = useState(false);
    const toggle6 = () => setOpen6(!dropdownOpen6);
    const [dropdownOpen7, setOpen7] = useState(false);
    const toggle7 = () => setOpen7(!dropdownOpen7);
    const [dropdownOpen8, setOpen8] = useState(false);
    const toggle8 = () => setOpen8(!dropdownOpen8);
    const [dropdownOpen9, setOpen9] = useState(false);
    const toggle9 = () => setOpen9(!dropdownOpen9);
    const [dropdownOpen10, setOpen10] = useState(false);
    const toggle10 = () => setOpen10(!dropdownOpen10);
    const [dropdownOpen11, setOpen11] = useState(false);
    const toggle11 = () => setOpen11(!dropdownOpen11);
    const [dropdownOpen12, setOpen12] = useState(false);
    const toggle12 = () => setOpen12(!dropdownOpen12);
    const [dropdownOpen13, setOpen13] = useState(false);
    const toggle13 = () => setOpen13(!dropdownOpen13);
    const [dropdownOpen14, setOpen14] = useState(false);
    const toggle14 = () => setOpen14(!dropdownOpen14);
    const [dropdownOpen15, setOpen15] = useState(false);
    const toggle15 = () => setOpen15(!dropdownOpen15);
    const [dropdownOpen16, setOpen16] = useState(false);
    const toggle16 = () => setOpen16(!dropdownOpen16);
    const [dropdownOpen17, setOpen17] = useState(false);
    const toggle17 = () => setOpen17(!dropdownOpen17);
    const [dropdownOpen18, setOpen18] = useState(false);
    const toggle18 = () => setOpen18(!dropdownOpen18);
   
    
    

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
            {/* <div className={clsx(classes.overflow)}> */}
                <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="dollar-banknote" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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

                {/* <ButtonDropdown isOpen={dropdownOpen1} toggle={toggle1} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="joystick" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
                </ButtonDropdown> */}

                {/* <ButtonDropdown isOpen={dropdownOpen2} toggle={toggle2} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="stopwatch" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
                </ButtonDropdown> */}
                <ButtonDropdown isOpen={dropdownOpen5} toggle={toggle5} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="nut-and-bolt" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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


                <ButtonDropdown isOpen={dropdownOpen3} toggle={toggle3} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="joystick" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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

                {/* <ButtonDropdown isOpen={dropdownOpen4} toggle={toggle4} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
                </ButtonDropdown> */}

                
                <ButtonDropdown isOpen={dropdownOpen6} toggle={toggle6} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="stopwatch" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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

                <ButtonDropdown isOpen={dropdownOpen7} toggle={toggle7} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="globe-showing-americas" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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

                <ButtonDropdown isOpen={dropdownOpen8} toggle={toggle8} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="house" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
                
                <ButtonDropdown isOpen={dropdownOpen9} toggle={toggle9} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="globe-showing-americas" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                {/* <ButtonDropdown isOpen={dropdownOpen10} toggle={toggle10} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="automobile" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
             */}
                <ButtonDropdown isOpen={dropdownOpen11} toggle={toggle11} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="oncoming-automobile" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen12} toggle={toggle12} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="alarm-clock" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen13} toggle={toggle13} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="sport-utility-vehicle" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen14} toggle={toggle14} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="seat" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen15} toggle={toggle15} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="artist-palette" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen16} toggle={toggle16} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="artist-palette" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen17} toggle={toggle17} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="artist-palette" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
                <ButtonDropdown isOpen={dropdownOpen18} toggle={toggle18} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="globe-showing-americas" width="12" style={{marginLeft: '5px', marginRight: '10px',}}/>
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
            
            {/* </div> */}
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
