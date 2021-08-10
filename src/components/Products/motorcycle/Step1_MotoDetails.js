import React, { useContext, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Col, Row } from 'reactstrap'
import useTranslation from 'next-translate/useTranslation'
import FieldWrapper from '../../Form/FieldWrapper'
import NumberInput from '../../Form/Inputs/NumberInput'
import SelectInput from '../../Form/Inputs/SelectInput'
import StepNavigation from '../../Form/StepNavigation'
import { FormContext } from '../../../context/FormContext'
import { MessageContext } from '../../../context/MessageContext'
import localeDataHelper from '../../../libs/localeDataHelper'
import { vehicleTypes } from '../../../business/vehicleTypes'
import Header from '../../Header'

const Step1MotoDetails = ({ onSubmitStep, prevStep }) => {
    const { t, lang } = useTranslation()
    const formRef = useRef(null)
    const { dispatchModalError } = useContext(MessageContext)
    const { formDataContext, dispatchFormUpdate } = useContext(FormContext)
    const { control, errors, handleSubmit, watch, setValue } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues: formDataContext
    })

    dispatchFormUpdate(watch(), { compare: true })
    
    const selectedMileage = watch('mileageType')
    const [ mileageType, setMileageType ] = useState(null);
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
        try{
            const data = await localeDataHelper.getLocaleData(vehicleTypes.moto, lang)
            setFormData(data)
        }catch (err){
            dispatchModalError({ err, persist : true})
        }
    },[lang])
    
    useEffect(() => {
        getData()
    }, [getData])

    const onPowerKwChange = ({ target: { value } }) => {
        setValue('powerCh', (Math.round(+value / 0.735499)).toString())
    }

    const onPowerChChange = ({ target: { value } }) => {
        setValue('powerKw', (Math.round(+value * 0.735499 )).toString())
    }
    
    useEffect(() => {
        setMileageType(selectedMileage || {
            label: 'kilometer',
            value: 'km'
        });
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
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            <Row>
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
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:cylinder')}>
                        <NumberInput
                            name="vehicleEngineCylinder"
                            control={control}
                            errors={errors}
                            placeholder="150 ch"
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
                            placeholder={0}
                            onChange={onPowerKwChange}
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
                        />
                    </FieldWrapper>
                </Col>
            </Row>
    
            <Header strong text={t('vehicles:consumption')}/>
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
                        />
                    </FieldWrapper>
                </Col>
            </Row>
    
            <Header text={t('vehicles:vehicle-informations')}/>

            <Row>
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:paint')}>
                        <SelectInput
                            name="paint"
                            options={formData.RadioChoicesPaints}
                            control={control}
                            errors={errors}
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
                        />
                    </FieldWrapper>
                </Col>
            </Row>
            <StepNavigation prev={prevStep} submit/>
        </form>
    )
}

export default Step1MotoDetails
