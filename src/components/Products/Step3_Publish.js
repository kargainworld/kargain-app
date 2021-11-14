import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Col, Row } from 'reactstrap'
import useTranslation from 'next-translate/useTranslation'
import NumberInput from '../Form/Inputs/NumberInput'
import TelInput from  '../Form/Inputs/TelInput'
import SelectCountryFlags from '../Form/Inputs/SelectCountryFlags'
import CheckboxMUI from '../Form/Inputs/CheckboxMUI'
import BCheckBoxInput from '../Form/Inputs/BCheckBoxInput'
import TextareaInput from '../Form/Inputs/TextareaInput'
import StepNavigation from '../Form/StepNavigation'
import FieldWrapper from '../Form/FieldWrapper'
import useAddress from 'hooks/useAddress'
import UploadDropZone from '../Uploads/UploadDropZone'
import { FormContext } from 'context/FormContext'
import SearchLocationInput from '../Form/Inputs/SearchLocationInput'
import SelectInput from "../Form/Inputs/SelectInput"
import { SelectOptionsUtils } from "libs/formFieldsUtils"
import { Emoji } from 'react-apple-emojis'
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import TextInput from 'components/Form/Inputs/TextInput'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(() => ({
    delete:{
        '& .special-label':{
            display:'none'
        }
    },
    div:{
        '& #btnwidth':{
            width:'96% !important'
        }
    }
}))
/*const [, ] = useState(null)
    const [, ] = useState(null)*/

const Step = ({ handleSubmitForm, prevStep,tokenPrice ,setTokenPrice,error }) => {
    const classes = useStyles()
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

    const vat = watch('vat')

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
            <h3 style={{ fontSize:'24px', fontWeight:"500", marginTop:"10px", color:'black' }}>
                <Emoji style={{ marginRight:"15px", marginBottom:"3px", marginLeft:"1%" }} name="page-facing-up" width={18} />
                {t('vehicles:publish-my-ad-now')}
            </h3>
            <Row>
                <Col sm={12} md={6} >
                    <FieldWrapper >
                        <CheckboxMUI
                            name="vat"
                            label={t('vehicles:vat')}
                            control={control}
                            errors={errors}
                            stye={{ fontSize:'14px !important', fontWeight:'nomarl' }}
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
                        }
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
                <TextInput
                    name="tags"
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:country')} >
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

            <FieldWrapper label={t('vehicles:phone')} >
                <div className={clsx(classes.delete)}>
                    <TelInput
                        className={clsx(classes.delete)}
                        name="phone"
                        errors={errors}
                        control={control}
                        innerProps={{
                            country: 'fr'
                        }}
                        
                    />
                </div>
            </FieldWrapper>
            <div style={{ display: "flex", flexDirection: 'column', width: '50%'  }}>
                <div style={{ fontSize:'12px', color:'#999999', marginBottom:'5px' }}>{t('vehicles:tokenPrice')} : </div>
                <TextField
                    classes={clsx(classes.textFieldMint)}
                    onChange={(event) => setTokenPrice(event.target.value)}
                    value={tokenPrice}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ''}                    
                    variant="outlined"
                />
            </div>

            <h3 style={{ fontSize:'24px', fontWeight:"500", marginTop:"30px", color:'black' }}>
                {/* <img src="/icons/Vehicleinfo-icon.png" style={{marginRight:"10px", marginBottom:"5px", width:"16px", height:"24px"}}/> */}
                <Emoji style={{ marginRight:"15px", marginBottom:"3px", marginLeft:"1%" }} name="paperclip" width={18} />
                {t('vehicles:pictures')}
            </h3>
            <UploadDropZone
                
                initialFiles={initialImagesRef.current}
                maxFiles={15}
                getFiles={getFiles}
                hideSubmit
                dragLabel={t('vehicles:upload-{max}-pictures', { max: 15 })}
            />

            <FieldWrapper>
                <BCheckBoxInput
                    style={{ marginBottom:'3px !important' }}
                    name="vat"
                    label={t('vehicles:accept-cgu')}
                    control={control}
                    errors={errors}
                    stye={{ fontSize:'14px', fontWeight:'nomarl' }}
                />
            </FieldWrapper>
            <div className={clsx(classes.div)}>
                <StepNavigation  prev={prevStep} submitLabel={t('vehicles:create-my-announce')} submit/>
            </div>
        </form>
    )
}

export default Step
