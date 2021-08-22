import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import ValidationError from '../Validations/ValidationError'
import Checkbox from '@material-ui/core/Checkbox'

const BCheckBoxInput = ({ name, rules, control, errors, ...props }) => {
     
    return (
        <>
            <div className={clsx('input', 'input-field', props.fullwidth && 'w-100', props.className)}>
                <label className="pl-1" htmlFor={name} >
                    
                   
                    <Checkbox
                        defaultChecked
                        color="default"
                        inputProps={{ 'aria-label': 'checkbox with default color' }}
                    />
                    {' '} {props.label}
                    {props.required && <span className="required_label">*</span>}
                </label>
            </div>
            {errors && <ValidationError errors={errors} name={name}/>}
        </>
    )
}

BCheckBoxInput.propTypes = {
    name: PropTypes.string.isRequired,
    control : PropTypes.any.isRequired
}

export default memo(BCheckBoxInput)
