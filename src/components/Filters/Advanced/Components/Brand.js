import makeStyles from "@material-ui/core/styles/makeStyles"
import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SelectInput from "../../../Form/Inputs/SelectInput"
import React, { useState } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"


const useStyles = makeStyles(() => ({
    dropdownMenu: {
        position: 'absolute',
        width: '250px',
        right: '220px',
        top: '225.49px',
        padding: '5px 5px'
    },
    buttonDropdown:{
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


const Brand = ({ defaultFilters, submit, brands }) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const [dropdownOpen2, setOpen2] = useState(false)
    const toggle2 = () => setOpen2(!dropdownOpen2)
    const classes = useStyles()
    const { t } = useTranslation()
    const defaultValues = {
        ...defaultFilters
    }
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })


    return (
        isMobile ? (
            <ButtonDropdown id="button_3" isOpen={dropdownOpen2} toggle={toggle2} className={clsx(classes.buttonDropdown)} >
                <DropdownToggle caret id="button_3" style={{ fontSize: '15.15px' }}>
                    <Emoji name="wrench" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:make')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownMenu)} id="button_3">
                    <FieldWrapper >
                        <SelectInput
                            name="manufacturer.make"
                            control={control}
                            errors={errors}
                            options={brands}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => submit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
        ) : (
            <ButtonDropdown id="button_3" isOpen={dropdownOpen2} toggle={toggle2} className={clsx(classes.buttonDropdown)} >
                <DropdownToggle caret id="button_3">
                    <Emoji name="wrench" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:make')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownMenu)} id="button_3">
                    <FieldWrapper >
                        <SelectInput
                            name="manufacturer.make"
                            control={control}
                            errors={errors}
                            options={brands}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => submit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
        )
    )
}

export default Brand
