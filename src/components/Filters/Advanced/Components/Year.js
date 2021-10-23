import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SliderInput from "../../../Form/Inputs/SliderInputUI"
import React, { useState } from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import customColors from "../../../../theme/palette"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const useStyles = makeStyles(() => ({

    filtersContainer: {
        padding: '.5rem'
    },
    filtersHidden: {
        display: 'none !important'
    },
    buttondropdown:{
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
    },
    dropdowntoggle:{
        '& .propTypes':{
            caret: 'PropTypes.bool',
            color: 'PropTypes.string',
            disabled: 'PropTypes.bool',
            onClick: 'PropTypes.func',
            dataToggle: 'PropTypes.string',
            ariaHaspopup: 'PropTypes.bool'
        }
    },
    rowbuttons:{
        position: 'relative',
        backgroundColor: '#fff',
        marginTop:'20px'
    },
    overflow:{
        overflowX:'auto'
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        height: '39px',
        background: customColors.gradient.main
    },
    filterbutton:{
        backgroundColor: 'white', /* Green */
        color: 'black',
        padding: '8px 15px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '26.8293px',
        border: 'solid #dcd7d7',
        borderWidth: '1px'
    },
    dropdownmenu: {
        position: 'absolute',
        width: '250px',
        right: '220px',
        top: '225.49px',
        padding: '5px 5px'
    },
    label:{
        textAlign:'left',
        fontSize:'14px',
        fontWeight: 'normal',
        lineHeight: '150%',
        color: 'black',
        marginLeft:'5px',
        marginBottom: '-10px'
    },
    dropdownmenuslide:{
        position: 'absolute',
        width: '250px',
        // height: 105px;
        right: '220px',
        top: '225.49px',
        padding: '15px 10px 20px'
    },
    btnfontsize:{
        '& button':{
            fontSize:'15.15px !important'
        },
        '& img':{
            width:'11px'
        }
    }
}))

const Year = ({ defaultFilters, submit }) => {
    const [dropdownOpen4, setOpen4] = useState(false)
    const toggle4 = () => setOpen4(!dropdownOpen4)
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
                                setTimeout(handleSubmit((data) => submit(data, e)), 100)
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
                                setTimeout(handleSubmit((data) => submit(data, e)), 100)
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
