import React, { useContext, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import Header from '../../Header'
import SelectInput from '../../Form/Inputs/SelectInput'
import StepNavigation from '../../Form/StepNavigation'
import NumberInput from '../../Form/Inputs/NumberInput'
import FieldWrapper from '../../Form/FieldWrapper'
import { SelectOptionsUtils } from '../../../libs/formFieldsUtils'
import { FormContext } from '../../../context/FormContext'
import { MessageContext } from '../../../context/MessageContext'
import DamageSelectorControlled from '../../Damages/DamageSelectorControlled'
import localeDataHelper from '../../../libs/localeDataHelper'
import { vehicleTypes } from '../../../business/vehicleTypes'
import TextInput from "../../Form/Inputs/TextInput";
import CheckBoxInput from "../../Form/Inputs/CheckBoxInput";

const Step = ({ onSubmitStep, prevStep }) => {
    const { t, lang } = useTranslation()
    const { dispatchModalError } = useContext(MessageContext)
    const { formDataContext, dispatchFormUpdate } = useContext(FormContext)
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
            const data = await localeDataHelper.getLocaleData(vehicleTypes.moto, lang)
            setFormData(data)
        }catch (err){
            dispatchModalError({ err, persist : true})
        }
    },[lang])

    useEffect(() => {
        getData()
    }, [])

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
                    rules={{ required: t('form_validations:field-is-required') }}
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
