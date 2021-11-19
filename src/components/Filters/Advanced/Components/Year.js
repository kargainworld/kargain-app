import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SliderInput from "../../../Form/Inputs/SliderInputUI"
import React, { useState } from "react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useStyles } from './styles.js'

const Year = (props) => {
    const [dropdownOpen4, setOpen4] = useState(false)
    const toggle4 = () => setOpen4(!dropdownOpen4)
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
    const isMobile = useMediaQuery('(max-width:768px)')

    return (
        isMobile ? (

            <ButtonDropdown  id="button_5" isOpen={dropdownOpen4} toggle={toggle4} className={clsx(classes.buttondropdown)} >
                <DropdownToggle caret id="button_5" style={{ fontSize: '15.15px' }}>
                    <Emoji name="calendar" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:year')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownmenuslide)} id="button_5">
                    <label className={clsx(classes.label)}>
                        {t('vehicles:year')}
                    </label>
                    <FieldWrapper >
                        <SliderInput
                            name="year"
                            defaultValue={[1900, 2021]}
                            min={1900}
                            max={2100}
                            step={10}
                            errors={errors}
                            control={control}
                            suffix=""
                            onChange={e =>{
                                setTimeout(handleSubmit((data) => props.submit(data, e)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>
                    <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>1900</label>
                    <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>2100</label>

                </DropdownMenu>
            </ButtonDropdown>
        ) :
            <ButtonDropdown  id="button_5" isOpen={dropdownOpen4} toggle={toggle4} className={clsx(classes.buttondropdown)} >
                <DropdownToggle caret id="button_5">
                    <Emoji name="calendar" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:year')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownmenuslide)} id="button_5">
                    <label className={clsx(classes.label)}>
                        {t('vehicles:year')}
                    </label>
                    <FieldWrapper >
                        <SliderInput
                            name="year"
                            defaultValue={[1900, 2021]}
                            min={1900}
                            max={2100}
                            step={10}
                            errors={errors}
                            control={control}
                            suffix=""
                            onChange={e =>{
                                setTimeout(handleSubmit((data) => props.submit(data, e)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>
                    <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>1900</label>
                    <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>2100</label>

                </DropdownMenu>
            </ButtonDropdown>
    )
}

export default Year
