import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import Header from '../../Header'
import FieldWrapper from '../../Form/FieldWrapper'
import NumberInput from '../../Form/Inputs/NumberInput'
import StepNavigation from '../../Form/StepNavigation'
import SelectInput from '../../Form/Inputs/SelectInput'
import { FormContext } from '../../../context/FormContext'
import { MessageContext } from '../../../context/MessageContext'
import { SelectOptionsUtils } from '../../../libs/formFieldsUtils'
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

    const [formData, setFormData] = useState({
        RadioVehicleGeneralState: [],
        CheckboxOptionsEquipments: [],
        RadioChoicesDefective: []
    })

    dispatchFormUpdate(watch(), { compare: true })

    const getData = useCallback(async () => {
        try{
            const data = await localeDataHelper.getLocaleData(vehicleTypes.utility, lang)
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
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:owners_quantity')}>
                <SelectInput
                    name="ownersCount"
                    options={SelectOptionsUtils([1, 2, 3, 4, 5])}
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
                    name="serviceBook"
                    control={control}
                    errors={errors}
                    label={t('vehicles:service_book')}
                />
            </FieldWrapper>

            <FieldWrapper>
                <CheckBoxInput
                    name="warranty"
                    control={control}
                    errors={errors}
                    label={t('vehicles:warranty')}
                />
            </FieldWrapper>

            <FieldWrapper>
                <CheckBoxInput
                    name="nonSmoker"
                    control={control}
                    errors={errors}
                    label={t('vehicles:non_smoker')}
                />
            </FieldWrapper>

            <FieldWrapper>
                <CheckBoxInput
                    name="cabinFilter"
                    control={control}
                    errors={errors}
                    label={t('vehicles:cabin_filter')}
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

            <DamageSelectorControlled
                name="damages"
                vehicleType="car"
                control={control}
                defaultValues={getValues().damages}
            />

            <StepNavigation prev={prevStep} submit/>
        </form>
    )
}

export default Step
