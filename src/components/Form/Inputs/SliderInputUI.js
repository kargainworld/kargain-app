import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider'
import Tooltip from '@material-ui/core/Tooltip'
import ValidationError from '../Validations/ValidationError'

const ValueLabelComponent = ({ suffix, ...innerProps }) => {
    const { children, open, value } = innerProps
    const title = suffix ? `${value} ${suffix}` : value

    return (
        <Tooltip
            open={open}
            enterTouchDelay={0}
            placement="top"
            title={title}>
            {children}
        </Tooltip>
    )
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired
}

const RangeSlider = ({ name, rules, control, errors, ...props }) => {
    const InputClasses = clsx('input-field', props.fullwidth && 'w-100', props.classNames)
    const [value, setValue] = useState(props.defaultValue || props.max)

    const handleChange = (e, val) => {
        setValue(val)
        control.setValue(name, val)
        if(props.onChange) return props.onChange(e);
        return e;
    }

    useEffect(()=>{
        control.register(name, rules)
    },[])

    return (
        <>
            <div className={InputClasses} style={{
                // width: '80%',
                margin: '0 auto'
            }}>
                <Slider
                    value={value <= 0 ? 0 : value}
                    onChange={handleChange}
                    step={props.step}
                    min={props.min}
                    max={props.max}
                    marks={props.marks}
                    valueLabelDisplay={props.valueLabelDisplay}
                    defaultValue={props.defaultValue}
                    ValueLabelComponent={innerProps => <ValueLabelComponent suffix={props.suffix} {...innerProps} />}
                />
            </div>
            {errors && <ValidationError errors={errors} name={name}/>}
        </>
    )
}

RangeSlider.propTypes = {
    name: PropTypes.string.isRequired,
    min: PropTypes.number,
    step: PropTypes.number,
    max: PropTypes.number,
    valueLabelDisplay: PropTypes.string
}

RangeSlider.defaultProps = {
    rules: {},
    min: 1,
    max: 100,
    step: 10,
    valueLabelDisplay : 'auto' //on
}

export default React.memo(RangeSlider)
