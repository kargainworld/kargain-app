import makeStyles from "@material-ui/core/styles/makeStyles"
import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SelectInput from "../../../Form/Inputs/SelectInput"
import vehicleTypesDefault from "../../../../business/vehicleTypes"
import React, { useCallback, useState } from "react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import filterProps from "libs/filterProps"
import useMediaQuery from "@material-ui/core/useMediaQuery"


const useStyles = makeStyles(() => ({
    buttondropdown: {
        '& button':{
            borderRadius: '26.8293px !important',
            borderColor:'#dcd7d7 !important',
            backgroundColor: '#c4c4c400 !important',
            color: 'black !important',
            cursor: 'pointer',
            fontSize:"17.1707px",
            marginRight: '6px !important',
            marginTop: '5px !important',
            '& button:clicked': {
                borderRadius: '25px !important',
                backgroundColor: '#c4c4c447 !important',
                color: 'black !important',
                fontSize:"17.1707px !important"
            },
            '&::after': {
                display: 'none !important'
            },
            '& .propTypes':{
                disabled: 'PropTypes.bool',
                direction: 'PropTypes.oneOf([`up`, `down`, `left`, `right`])',
                group: 'PropTypes.bool',
                isOpen: 'PropTypes.bool',
                tag: 'PropTypes.string',
                toggle: 'PropTypes.func'
            }
        }
    }
}))


const VehicleType = ({ defaultFilters, updateFilters }) => {
    const [dropdownOpen, setOpen] = useState(false)
    const toggle = () => setOpen(!dropdownOpen)
    const classes = useStyles()
    const isMobile = useMediaQuery('(max-width:768px)')
    const { t } = useTranslation()
    const defaultValues = {
        ...defaultFilters
    }
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })

    const onSubmit = useCallback(async (form, e, name) => {

        let empty
        for (var key in form) {
            if(form[key] === null) form[key] = empty
        }

        if(e !== null && e?.type !== null)  if(typeof e?.type === "submit")   e.preventDefault()

        const { coordinates, radius } = form
        const filtersFlat = filterProps(form)
        const data = { ...filtersFlat }

        if (coordinates && radius) {
            data.radius = radius
            data.coordinates = coordinates
            data.enableGeocoding = true
        }

        updateFilters(data)
    }, [updateFilters])

    const router = useRouter()


    return (
        !isMobile ? (
            <ButtonDropdown  id="button_1" isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
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
                                setTimeout(handleSubmit((data) => onSubmit(data, e, name)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>

                </DropdownMenu>
            </ButtonDropdown>
        ) : (
            <ButtonDropdown  id="button_1" isOpen={dropdownOpen} toggle={toggle} className={clsx(classes.buttondropdown)} >
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
                                setTimeout(handleSubmit((data) => onSubmit(data, e, name)), 100)
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
