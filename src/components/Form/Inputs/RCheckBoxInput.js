import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import ValidationError from '../Validations/ValidationError'
import Checkbox from '@material-ui/core/Checkbox'

const RCheckBoxInput = ({ name, rules, control, errors, ...props }) => {
     
    return (
        <>
            <div className={clsx('input', 'input-field', props.fullwidth && 'w-100', props.className)}>
                <label className="pl-1" htmlFor={name} >
                    
                    <Checkbox 
                        style={{ width:"13.5px", height:"13.5px", fontSize:"14px", marginTop:"-4px", marginRight:"5px" }}
                        id={name}
                        name={name}                        
                        ref={control.register(rules)}
                        inputProps = {{ 'aria-label': 'uncontrolled-checkbox' }} 
                    />
                    

                    {' '} {props.label}
                    {props.required && <span className="required_label">*</span>}
                </label>
            </div>
            {errors && <ValidationError errors={errors} name={name}/>}
        </>
    )
}

RCheckBoxInput.propTypes = {
    name: PropTypes.string.isRequired,
    control : PropTypes.any.isRequired
}

export default memo(RCheckBoxInput)
