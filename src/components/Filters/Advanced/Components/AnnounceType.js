import makeStyles from "@material-ui/core/styles/makeStyles"
import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SelectInput from "../../../Form/Inputs/SelectInput"
import React, { useState } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useForm } from "react-hook-form"
import AnnounceTypes from "../../../../business/announceTypes"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"


const useStyles = makeStyles(() => ({
    dropdownMenu: {
        position: 'absolute',
        width: '250px',
        right: '220px',
        top: '225.49px',
        padding: '5px 5px'
    },
    filtersHidden: {
        display: 'none !important'
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

const AnnounceType = ({ defaultFilters, submit, limitwidth }) => {
    const classes = useStyles()
    const toggle1 = () => setOpen1(!dropdownOpen1)
    const { t } = useTranslation()
    const router = useRouter()
    const [dropdownOpen1, setOpen1] = useState(false)
    const [hiddenFormMobile, hideFormMobile] = useState(true)
    const isMobile = useMediaQuery('(max-width:768px)')
    const defaultValues = {
        ...defaultFilters
    }
    const [announceTypesFiltered, setAnnouncesTypesFiltered] = useState(AnnounceTypes())
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })


    return (
        isMobile && limitwidth ? (
            <div className={clsx(hiddenFormMobile && classes.filtersHidden)} >
                <ButtonDropdown id="buuton_2" isOpen={dropdownOpen1} toggle={toggle1} className={clsx(classes.buttonDropdown)}   >
                    <DropdownToggle caret id="button_2" style={{ fontSize:'15.15px' }}>
                        <Emoji name="page-facing-up" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                        {t('vehicles:announce-type')}
                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                    </DropdownToggle>
                    <DropdownMenu className={clsx(classes.dropdownMenu)} id="buuton_2">
                        <FieldWrapper >
                            <SelectInput

                                name="adType"
                                control={control}
                                errors={errors}
                                options={announceTypesFiltered}
                                selected={router.query.adType}
                                onChange={(selected, name) =>{
                                    setTimeout(handleSubmit((data) => submit(data, selected, name)), 100)
                                    return selected
                                }}
                            />
                        </FieldWrapper>
                    </DropdownMenu>
                </ButtonDropdown>
            </div>
        ) :isMobile ? (
            <ButtonDropdown id="buuton_2" isOpen={dropdownOpen1} toggle={toggle1} className={clsx(classes.buttonDropdown)}  >
                <DropdownToggle caret id="button_2" style={{ fontSize: '15.15px' }}>
                    <Emoji name="page-facing-up" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:announce-type')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'8.82px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownMenu)} id="buuton_2">
                    <FieldWrapper >
                        <SelectInput
                            name="adType"
                            control={control}
                            errors={errors}
                            options={announceTypesFiltered}
                            selected={router.query.adType}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => submit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
        ) :
            <ButtonDropdown id="buuton_2" isOpen={dropdownOpen1} toggle={toggle1} className={clsx(classes.buttonDropdown)}  >
                <DropdownToggle caret id="button_2">
                    <Emoji name="page-facing-up" width="14" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:announce-type')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownMenu)} id="buuton_2">
                    <FieldWrapper >
                        <SelectInput
                            name="adType"
                            control={control}
                            errors={errors}
                            options={announceTypesFiltered}
                            selected={router.query.adType}
                            onChange={(selected, name) =>{
                                setTimeout(handleSubmit((data) => submit(data, selected, name)), 100)
                                return selected
                            }}
                        />
                    </FieldWrapper>
                </DropdownMenu>
            </ButtonDropdown>
    )
}

export default AnnounceType
