import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import StepNavigation from '../../Form/StepNavigation'
import FieldWrapper from '../../Form/FieldWrapper'
import SelectInput from '../../Form/Inputs/SelectInput'

import { SelectOptionsUtils } from '../../../libs/formFieldsUtils'
import { FormContext } from '../../../context/FormContext'
import { MessageContext } from '../../../context/MessageContext'

import localeDataHelper from '../../../libs/localeDataHelper'
import { vehicleTypes } from '../../../business/vehicleTypes'
import Header from '../../Header'
import TextInput from "../../Form/Inputs/TextInput"
import CheckBoxInput from "../../Form/Inputs/CheckBoxInput"

const Step = ({ onSubmitStep, prevStep }) => {
    const { t, lang } = useTranslation()
    const { formDataContext, dispatchFormUpdate } = useContext(FormContext)
    const { dispatchModalError } = useContext(MessageContext)
    const { control, errors, getValues, handleSubmit, watch } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues: formDataContext
    })

    dispatchFormUpdate(watch(), { compare: true })

    const [formData, setFormData] = useState({
        RadioVehicleGeneralState: [],
        CheckboxOptionsEquipments: [],
        RadioChoicesDefective: []
    })

    const getData = useCallback(async () => {
        try{
            const data = await localeDataHelper.getLocaleData(vehicleTypes.camper, lang)
            setFormData(data)
        }catch (err){
            dispatchModalError({ err, persist : true })
        }
    },[lang])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <form className="form_wizard" onSubmit={handleSubmit(onSubmitStep)}>
            <Header text={t('vehicles:vehicle-state')}/>

            <FieldWrapper label={t('vehicles:chassis_number')}>
                <TextInput
                    name="chassisNumber"
                    placeholder='VIN'
                    control={control}
                    errors={errors}
                    rules={{ required:t('form_validations:required'), maxLength:{
                        value: 17,
                        message: t('form_validations:max_length_{max}', { max : 17 })
                    } }}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:vehicle_general_state')}>
                <SelectInput
                    name="vehicleGeneralState"
                    options={formData?.RadioVehicleGeneralState}
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:owners_quantity')}>
                <SelectInput
                    name="ownersCount"
                    options={SelectOptionsUtils([1,2,3,4,5,6,7,8,9])}
                    placeholder="Select number of owners"
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper>
                <CheckBoxInput
                    name="accidentVehicle"
                    control={control}
                    errors={errors}
                    label={t('vehicles:accident_vehicle')}
                />
            </FieldWrapper>

            <FieldWrapper>
                <CheckBoxInput
                    name="defectiveVehicle"
                    control={control}
                    errors={errors}
                    label={t('vehicles:defective_vehicle')}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:equipments')}>
                <SelectInput
                    name="equipments"
                    isMulti
                    options={formData.CheckboxOptionsEquipments}
                    defaultChecked={['ABS', 'ESP']}
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <StepNavigation prev={prevStep} submit/>
        </form>
    )
}

export default Step
