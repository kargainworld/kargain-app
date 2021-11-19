import useMediaQuery from "@material-ui/core/useMediaQuery"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SelectInput from "../../../Form/Inputs/SelectInput"
import React, { useState } from "react"
import { useStyles } from './styles.js'

const Model = (props) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const [dropdownOpen3, setOpen3] = useState(false)
    const toggle3 = () => setOpen3(!dropdownOpen3)
    const classes = useStyles(props)
    const { t } = useTranslation()
    const defaultValues = {
        ...props.defaultFilters
    }
    const { watch, control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })
    return (
        isMobile ?
            <ButtonDropdown id="button_4" isOpen={dropdownOpen3} toggle={toggle3} className={clsx(classes.buttonDropdown)}>
                <DropdownToggle caret id="button_4" style={{ fontSize: '15.15px' }}>
                    <Emoji name="two-oclock" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:model')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownMenu)} id="button_4">
                    <FieldWrapper >
                        <SelectInput
                            name="manufacturer.model"
                            options={props.models}
                            control={control}
                            errors={errors}
                            disabled={!watch('manufacturer.make')}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => props.submit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
            :
            <ButtonDropdown id="button_4" isOpen={dropdownOpen3} toggle={toggle3} className={clsx(classes.buttonDropdown)} >
                <DropdownToggle caret id="button_4" style={{ fontSize: '15.15px' }}>
                    <Emoji name="two-oclock" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:model')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownMenu)} id="button_4">
                    <FieldWrapper >
                        <SelectInput
                            name="manufacturer.model"
                            options={props.models}
                            control={control}
                            errors={errors}
                            disabled={!watch('manufacturer.make')}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => props.submit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
    )
}

export default Model
