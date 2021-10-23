
import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SelectInput from "../../../Form/Inputs/SelectInput"
import vehicleTypesDefault from "../../../../business/vehicleTypes"
import React, {  useState } from "react"
import useTranslation from "next-translate/useTranslation"
import { useStyles } from './styles.js'
import { useRouter } from "next/router"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useForm } from "react-hook-form"


const VehicleType = (props) => {
    const [dropdownOpen, setOpen] = useState(false)
    const toggle = () => setOpen(!dropdownOpen)
    const classes = useStyles(props)
    const isMobile = useMediaQuery('(max-width:768px)')
    const { t } = useTranslation()
    const defaultValues = {
        ...props.defaultFilters
    }
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })
    const router = useRouter()


    return (
        !isMobile ? (
            <ButtonDropdown  id="button_1" isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttonDropdown)} >
                <DropdownToggle caret id="button_1">
                    <Emoji name="automobile" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:vehicle-type')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownmenu)} >
                    <FieldWrapper>
                        <SelectInput
                            name="vehicleType"
                            control={control}
                            errors={errors}
                            options={vehicleTypesDefault()}
                            selected={router.query.vehicleType}
                            onChange={(e, name) =>{
                                setTimeout(handleSubmit((data) => props.submit(data, e, name)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>

                </DropdownMenu>
            </ButtonDropdown>
        ) : (
            <ButtonDropdown  id="button_1" isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttonDropdown)} >
                <DropdownToggle caret id="button_1" style={{ fontSize: '15.15px' }}>
                    <Emoji name="automobile" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:vehicle-type')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownmenu)} >
                    <FieldWrapper>
                        <SelectInput
                            name="vehicleType"
                            control={control}
                            errors={errors}
                            options={vehicleTypesDefault()}
                            selected={router.query.vehicleType}
                            onChange={(e, name) =>{
                                setTimeout(handleSubmit((data) => props.submit(data, e, name)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
        )
    )
}

export default VehicleType
