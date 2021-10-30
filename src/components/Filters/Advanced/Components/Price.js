import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SliderInput from "../../../Form/Inputs/SliderInputUI"
import React, { useState } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useStyles } from './styles.js'
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"


const Price = (props) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const [dropdownOpen5, setOpen5] = useState(false)
    const toggle5 = () => setOpen5(!dropdownOpen5)
    const classes = useStyles(props)
    const { t } = useTranslation()
    const defaultValues = {
        ...props.defaultFilters
    }
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })


    return (
        isMobile ? (
            <ButtonDropdown isOpen={dropdownOpen5} toggle={toggle5} className={clsx(classes.buttondropdown)} >
                <DropdownToggle caret style={{ fontSize: '15.15px' }}>
                    <Emoji name="dollar-banknote" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:price')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownmenuslide)}>

                    <label className={clsx(classes.label)}>
                        {t('vehicles:price')}
                    </label>
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
                                setTimeout(handleSubmit((data) => props.submit(data, e)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>

                    <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>0 €</label>
                    <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>200000 €</label>
                </DropdownMenu>
            </ButtonDropdown> )
            :
            (
                <ButtonDropdown isOpen={dropdownOpen5} toggle={toggle5} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret>
                        <Emoji name="dollar-banknote" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                        {t('vehicles:price')}
                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                    </DropdownToggle>
                    <DropdownMenu className={clsx(classes.dropdownmenuslide)}>
                        <label className={clsx(classes.label)}>
                            {t('vehicles:price')}
                        </label>
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
                                    setTimeout(handleSubmit((data) => props.submit(data, e)), 100)
                                    return e
                                }}
                            />
                        </FieldWrapper>

                        <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>0 €</label>
                        <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>200000 €</label>
                    </DropdownMenu>
                </ButtonDropdown>
            )

    )
}


export default Price
