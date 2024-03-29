import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Col, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import NumberInput from '../../Form/Inputs/NumberInput'
import SelectInput from '../../Form/Inputs/SelectInput'
import StepNavigation from '../../Form/StepNavigation'
import FieldWrapper from '../../Form/FieldWrapper'
import { SelectOptionsUtils } from '../../../libs/formFieldsUtils'
import { FormContext } from '../../../context/FormContext'
// import { MessageContext } from 'context/MessageContext'
import localeDataHelper from '../../../libs/localeDataHelper'
import { vehicleTypes } from '../../../business/vehicleTypes'
import { Emoji } from 'react-apple-emojis'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useMessage } from '../../../context/MessageContext'

const Step1CarDetails = ({ onSubmitStep, prevStep }) => {

    const isMobile = useMediaQuery('(max-width:768px)')

    const { t, lang } = useTranslation()
    const formRef = useRef(null)
    const { formDataContext } = useContext(FormContext)
    const { dispatchModalError } = useMessage()

    const { control, errors, handleSubmit, watch, setValue } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues: formDataContext
    })

    // dispatchFormUpdate(watch(), { compare: true })

    const selectedMileage = watch('mileageType')
    const [ mileageType, setMileageType ] = useState(null)
    const [formData, setFormData] = useState({
        RadioVehicleGeneralState: [],
        CheckboxOptionsEquipments: [],
        RadioChoicesGas: [],
        RadioFunctionVehicle: [],
        RadioTypeFunction: [],
        RadioChoicesEngine: [],
        RadioChoicesEmission: [],
        RadioChoicesPaints: [],
        RadioChoicesMaterials: [],
        RadioChoicesExternalColor: [],
        mileageType: [
            {
                label: 'mileage',
                value: 'mi'
            },
            {
                label: 'kilometer',
                value: 'km'
            }
        ]
    })

    const getData = useCallback(async () => {
        try {
            const data = await localeDataHelper.getLocaleData(vehicleTypes.car, lang)
            setFormData(data)
        } catch (err) {
            dispatchModalError({ err, persist: true })
        }
    }, [lang])

    useEffect(() => {
        getData()
    }, [getData])

    const onPowerKwChange = ({ target: { value } }) => {
        setValue('powerCh', (Math.round(+value / 0.735499)).toString())
    }

    const onPowerChChange = ({ target: { value } }) => {
        setValue('powerKw', (Math.round(+value * 0.735499)).toString())
    }

    useEffect(() => {
        setMileageType(selectedMileage || {
            label: 'kilometer',
            value: 'km'
        })
    }, [selectedMileage])

    return (
        <form className="form_wizard" ref={formRef} onSubmit={handleSubmit(onSubmitStep)}>
            <Row>
                <Col>
                    <FieldWrapper label={t('vehicles:type')}>
                        <SelectInput
                            name="vehicleFunctionType"
                            options={formData.RadioTypeFunction}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </Col>

            </Row>

            <Row>
                {isMobile ? (
                    <Col sm={12} md={12}>
                        <Row>
                            <Col md={12}>
                                <FieldWrapper label={t('vehicles:type')}>
                                    <SelectInput
                                        name="mileageType"
                                        options={formData.mileageType}
                                        control={control}
                                        errors={errors}
                                        rules={{ required: t('form_validations:required') }}
                                    />
                                </FieldWrapper>
                            </Col>
                            <Col md={12}>
                                <FieldWrapper label={t(`vehicles:${mileageType?.label}`)}>
                                    <NumberInput
                                        name="mileage"
                                        placeholder={`20000 ${mileageType?.value}`}
                                        control={control}
                                        errors={errors}
                                        rules={{ required: t('form_validations:required') }}
                                    />
                                </FieldWrapper>
                            </Col>
                        </Row>

                    </Col>
                ):(
                    <Col sm={12} md={6}>
                        <Row>
                            <Col>
                                <FieldWrapper label={t('vehicles:type')}>
                                    <SelectInput
                                        name="mileageType"
                                        options={formData.mileageType}
                                        control={control}
                                        errors={errors}
                                        rules={{ required: t('form_validations:required') }}
                                    />
                                </FieldWrapper>
                            </Col>
                            <Col>
                                <FieldWrapper label={t(`vehicles:${mileageType?.label}`)}>
                                    <NumberInput
                                        name="mileage"
                                        placeholder={`20000 ${mileageType?.value}`}
                                        control={control}
                                        errors={errors}
                                        rules={{ required: t('form_validations:required') }}
                                    />
                                </FieldWrapper>
                            </Col>
                        </Row>

                    </Col>
                )}

                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:cylinder')}>
                        <NumberInput
                            name="vehicleEngineCylinder"
                            control={control}
                            errors={errors}
                            placeholder="cm&sup3;"
                            rules={{ required: t('form_validations:required'),
                                validate: { min: (value) => value >= 10 ? true : t('form_validations:min_{min}', { min : 10 }) } }}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:gas')}>
                        <SelectInput
                            name="vehicleEngineGas"
                            options={formData.RadioChoicesGas}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:gear-box')}>
                        <SelectInput
                            name="vehicleEngineType"
                            options={formData.RadioChoicesEngine}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:power')}>
                        <NumberInput
                            name="powerKw"
                            control={control}
                            errors={errors}
                            placeholder={"KW"}
                            onChange={onPowerKwChange}
                        // rules={{ required:t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:power_ch')}>
                        <NumberInput
                            name="powerCh"
                            control={control}
                            errors={errors}
                            placeholder={0}
                            onChange={onPowerChChange}
                        // rules={{ required:t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            {/* <Header strong text={t('vehicles:consumption')} /> */}
            <h3 style={{ fontSize:'24px', fontWeight:"500", marginTop:"30px" }}>
                {/* <img src="/icons/Consumption-icon.png" style={{marginRight:"10px", marginBottom:"5px", width:"16px", height:"24px"}}/> */}
                <Emoji style={{ marginRight:"15px", marginBottom:"3px" }} name="fuel-pump" width={18} />
                {t('vehicles:consumption')}
            </h3>
            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={`${t('vehicles:consumption')} mixt`}>
                        <NumberInput
                            name="consumptionMixt"
                            control={control}
                            errors={errors}
                            placeholder="20 g/100"
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={`${t('vehicles:consumption')} (g/km)`}>
                        <NumberInput
                            name="consumptionCity"
                            control={control}
                            errors={errors}
                            placeholder="20 g/100"
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={`${t('vehicles:road')} (g/km)`}>
                        <NumberInput
                            name="consumptionRoad"
                            control={control}
                            errors={errors}
                            placeholder="20 g/100"
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label="CO2 (g/km)">
                        <NumberInput
                            name="consumptionGkm"
                            control={control}
                            errors={errors}
                            placeholder={0}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:class_emission')}>
                        <SelectInput
                            name="emission"
                            options={formData.RadioChoicesEmission}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            {/* <Header text={t('vehicles:vehicle-informations')} /> */}
            <h3 style={{ fontSize:'24px', fontWeight:"500", marginTop:"30px" }}>
                {/* <img src="/icons/Vehicleinfo-icon.png" style={{marginRight:"10px", marginBottom:"5px", width:"16px", height:"24px"}}/> */}
                <Emoji style={{ marginRight:"15px", marginBottom:"3px" }} name="page-facing-up" width={18} />
                {t('vehicles:vehicle-informations')}
            </h3>
            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:doors_quantity')}>
                        <SelectInput
                            name="doors"
                            options={SelectOptionsUtils([2, 3, 4, 5, 6, 7, 8, 9])}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:seats_quantity')}>
                        <SelectInput
                            name="seats"
                            options={SelectOptionsUtils([2, 3, 4, 5, 6, 7, 8, 9])}
                            // placeholder={t('vehicles:select_seats_quantity')}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:paint')}>
                        <SelectInput
                            name="paint"
                            options={formData.RadioChoicesPaints}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:materials')}>
                        <SelectInput
                            name="materials"
                            isMulti
                            options={formData.RadioChoicesMaterials}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:external_color')}>
                        <SelectInput
                            name="externalColor"
                            options={formData.RadioChoicesExternalColor}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:internal_color')}>
                        <SelectInput
                            name="internalColor"
                            options={formData.RadioChoicesExternalColor}
                            control={control}
                            errors={errors}
                            placeholder={t('vehicles:select')}
                        />
                    </FieldWrapper>
                </Col>
            </Row>
            <StepNavigation prev={prevStep} submit />
        </form>
    )
}

export default Step1CarDetails
