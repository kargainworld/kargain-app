import clsx from "clsx"
import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SliderInput from "../../../Form/Inputs/SliderInputUI"
import React, { useState } from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import makeStyles from "@material-ui/core/styles/makeStyles"
import customColors from "../../../../theme/palette"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"

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

const Price = ({ defaultFilters, submit }) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const [dropdownOpen5, setOpen5] = useState(false)
    const toggle5 = () => setOpen5(!dropdownOpen5)
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
                                setTimeout(handleSubmit((data) => submit(data, e)), 100)
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
                                    setTimeout(handleSubmit((data) => submit(data, e)), 100)
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
