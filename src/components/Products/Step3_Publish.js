import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Col, Row } from 'reactstrap'
import useTranslation from 'next-translate/useTranslation'
import NumberInput from '../Form/Inputs/NumberInput'
import TelInput from  '../Form/Inputs/TelInput'
import SelectCountryFlags from '../Form/Inputs/SelectCountryFlags'
import CheckboxMUI from '../Form/Inputs/CheckboxMUI'
import TextareaInput from '../Form/Inputs/TextareaInput'
import StepNavigation from '../Form/StepNavigation'
import FieldWrapper from '../Form/FieldWrapper'
import useAddress from '../../hooks/useAddress'
import UploadDropZone from '../Uploads/UploadDropZone'
import { FormContext } from '../../context/FormContext'
import SearchLocationInput from '../Form/Inputs/SearchLocationInput'
import TagsControlled from '../Tags/TagsControlled'
import Header from '../Header'
import SelectInput from "../Form/Inputs/SelectInput";
import {SelectOptionsUtils} from "../../libs/formFieldsUtils";

const Step = ({ handleSubmitForm, prevStep }) => {
    const { t } = useTranslation()
    const [, , coordinates] = useAddress()
    const { formDataContext, dispatchFormUpdate } = useContext(FormContext)
    const { watch, control, errors, setValue, register, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues: {
            ...formDataContext,
            showCellPhone: true,
            vat: false,
            visible: true
        }
    })

    dispatchFormUpdate(watch(), { compare: true })

    const vat = watch('vat');

    const getFiles = (files) => {
        setValue('images', files)
    }

    const countrySelect = watch('countrySelect')

    useEffect(() => {
        register({ name: 'location.coordinates' })
        setValue('location.coordinates', coordinates)
    }, [coordinates])

    useEffect(() => {
        register({ name: 'images' })
    }, [])

    const initialImagesRef = React.useRef(formDataContext.images)

    return (
        <form className="form_wizard" onSubmit={handleSubmit(handleSubmitForm)}>
            <Header text={t('vehicles:publish-my-ad-now')}/>
            <Row>
                {/*<Col sm={12} md={6}>*/}
                {/*    <FieldWrapper label={t('vehicles:announce-title')}>*/}
                {/*        <TextInput*/}
                {/*            name="title"*/}
                {/*            placeholder="BMW 633csi e24 - 1976"*/}
                {/*            fullwidth*/}
                {/*            control={control}*/}
                {/*            errors={errors}*/}
                {/*            rules={{*/}
                {/*                required: t('form_validations:field-is-required'),*/}
                {/*                minLength: {*/}
                {/*                    value: 5,*/}
                {/*                    message: t('form_validations:min_length_{min}', { min : 5})*/}
                {/*                }*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </FieldWrapper>*/}
                {/*</Col>*/}
                <Col sm={12} md={6}>
                    <FieldWrapper label={t('vehicles:ad-price')}>
                        <NumberInput
                            name="price"
                            placeholder="15000€"
                            errors={errors}
                            control={control}
                            rules={{
                                required: t('form_validations:required'),
                                validate: val => {
                                    const value = Number(val)
                                    if (value < 500) return t('form_validations:min_price_{min}{currency}', { min : 500, currency : '€'})
                                    if (value > 200000) return t('form_validations:max_price_{max}{currency}', { max : 200000, currency : '€'})
                                }
                            }}
                        />
                    </FieldWrapper>
                </Col>

                <Col sm={12} md={6} >
                    <FieldWrapper >
                        <CheckboxMUI
                            name="vat"
                            label={t('vehicles:vat')}
                            control={control}
                            errors={errors}
                        />
                    </FieldWrapper>
                </Col>
            </Row>

            {vat &&
                <Row>
                    <Col sm={12} md={6}>
                        <FieldWrapper>
                            <NumberInput
                                name="priceHTCoefficient"
                                placeholder="HT"
                                errors={errors}
                                control={control}
                                rules={{
                                    required: t('form_validations:required')
                                }}
                            />
                        </FieldWrapper>
                    </Col>
                </Row>}



            <FieldWrapper label={t('vehicles:appointment')}>
                <SelectInput
                    name="isProfessional"
                    options={SelectOptionsUtils([
                        {
                            value: true,
                            label: t('vehicles:is_appointment__professional')
                        },
                        {
                            value: false,
                            label: t('vehicles:is_appointment__private')
                        },
                    ])}
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:description')}>
                <TextareaInput
                    name="description"
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:tags')}>
                <TagsControlled
                    name="tags"
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:country')}>
                <SelectCountryFlags
                    name="countrySelect"
                    errors={errors}
                    control={control}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:address')}>
                <SearchLocationInput
                    name="address"
                    country={countrySelect?.value}
                    control={control}
                    errors={errors}
                    rules={{ required: t('form_validations:required') }}>
                </SearchLocationInput>
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:phone')}>
                <TelInput
                    name="phone"
                    errors={errors}
                    control={control}
                    rules={{ required: t('form_validations:field-is-required') }}
                    innerProps={{
                        country: 'fr'
                    }}
                />
            </FieldWrapper>

            <Header text={t('vehicles:pictures')}/>
            <UploadDropZone
                initialFiles={initialImagesRef.current}
                maxFiles={15}
                getFiles={getFiles}
                hideSubmit
                dragLabel={t('vehicles:upload-{max}-pictures', { max: 15 })}
            />

            <FieldWrapper>
                <CheckboxMUI
                    name="visible"
                    label={t('vehicles:create-and-publish')}
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <StepNavigation prev={prevStep} submitLabel={t('vehicles:create-my-announce')} submit/>
        </form>
    )
}

export default Step
