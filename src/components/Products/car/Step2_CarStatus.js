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
import { Emoji } from 'react-apple-emojis'

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
            const data = await localeDataHelper.getLocaleData(vehicleTypes.car, lang)
            setFormData(data)
        }catch (err){
            dispatchModalError({ err, persist : true})
        }
    },[lang])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <form className="form_wizard" onSubmit={handleSubmit(onSubmitStep)}>
            
            <h3 style={{fontSize:'24px', fontWeight:"500", marginTop:"30px"}}>
                <div></div>
                {/* <img src="/icons/Vehicleinfo-icon.png" style={{marginRight:"10px", marginBottom:"5px", width:"16px", height:"24px"}}/> */}
                <Emoji style={{marginRight:"15px", marginBottom:"3px"}} name="oncoming-automobile" width={18} />
                {t('vehicles:vehicle-state')}
            </h3>
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
                    rules={{ required:t('form_validations:required') }}
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

            <FieldWrapper label={t('vehicles:accident_vehicle')}>
                <SelectInput 
                    name="accidentVehicle"
                    control={control}
                    errors={errors}
                    
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:defective_vehicle')}>
                <SelectInput
                    name="defectiveVehicle"
                    control={control}
                    errors={errors}
                    
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

            {/* <Header text={t('vehicles:data-sheet')}/> */}
            <h3 style={{fontSize:'24px', fontWeight:"500", marginTop:"30px"}}>
                {/* <img src="/icons/Vehicleinfo-icon.png" style={{marginRight:"10px", marginBottom:"5px", width:"16px", height:"24px"}}/> */}
                <Emoji style={{marginRight:"15px", marginBottom:"3px"}} name="page-facing-up" width={18} />
                {t('vehicles:data-sheet')}
            </h3>
            <DamageSelectorControlled
                vehicleType="car"
                name="damages"
                control={control}
                defaultValues={getValues().damages}
            />

            <StepNavigation prev={prevStep} submit/>
        </form>
    )
}

export default Step
