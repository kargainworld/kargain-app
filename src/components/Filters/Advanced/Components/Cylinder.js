import { ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import clsx from "clsx"
import { Emoji } from "react-apple-emojis"
import FieldWrapper from "../../../Form/FieldWrapper"
import SliderInput from "../../../Form/Inputs/SliderInputUI"
import React, { useState } from "react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useStyles } from './styles.js'

const Cylinder = (props) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const [dropdownOpen6, setOpen6] = useState(false)
    const toggle6 = () => setOpen6(!dropdownOpen6)
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
            <ButtonDropdown isOpen={dropdownOpen6} toggle={toggle6} className={clsx(classes.buttondropdown)} >
                <DropdownToggle caret style={{ fontSize: '15.15px' }}>
                    <Emoji name="nut-and-bolt" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    {t('vehicles:cylinder')}
                    <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                </DropdownToggle>
                <DropdownMenu className={clsx(classes.dropdownmenuslide)}>
                    <label className={clsx(classes.label)}>
                        {t('vehicles:cylinder')}
                    </label>
                    <FieldWrapper>
                        <SliderInput
                            name="vehicleEngineCylinder"
                            suffix="cm3"
                            min={10}
                            max={1000}
                            step={10}
                            defaultValue={[1, 1000]}
                            errors={errors}
                            control={control}
                            onChange={e =>{
                                setTimeout(handleSubmit((data) => props.submit(data, e)), 100)
                                return e
                            }}
                        />
                    </FieldWrapper>
                    <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>10 cm3</label>
                    <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>1000 cm3</label>

                </DropdownMenu>
            </ButtonDropdown>
        )
            :
            (
                <ButtonDropdown isOpen={dropdownOpen6} toggle={toggle6} className={clsx(classes.buttondropdown)} >
                    <DropdownToggle caret style={{ fontSize: '15.15px' }}>
                        <Emoji name="nut-and-bolt" width="11" style={{ marginLeft: '5px', marginRight: '10px' }}/>
                        {t('vehicles:cylinder')}
                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')} style={{ width:'10px', height:'5px', marginBottom:'5px' }}/>
                    </DropdownToggle>
                    <DropdownMenu className={clsx(classes.dropdownmenuslide)}>
                        <label className={clsx(classes.label)}>
                            {t('vehicles:cylinder')}
                        </label>
                        <FieldWrapper>
                            <SliderInput
                                name="vehicleEngineCylinder"
                                suffix="cm3"
                                min={10}
                                max={1000}
                                step={10}
                                defaultValue={[1, 1000]}
                                errors={errors}
                                control={control}
                                onChange={e =>{
                                    setTimeout(handleSubmit((data) => props.submit(data, e)), 100)
                                    return e
                                }}
                            />
                        </FieldWrapper>
                        <label className={clsx(classes.label)} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '-10px', fontSize: '11px' }}>10 cm3</label>
                        <label className={clsx(classes.label)} style={{ textAlign:'right', display: 'flex', justifyContent: 'flex-end', marginTop: '-16px', fontSize: '11px' }}>1000 cm3</label>

                    </DropdownMenu>
                </ButtonDropdown>
            )


    )
}


export default Cylinder
