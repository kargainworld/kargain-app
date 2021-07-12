import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import ValidationError from '../Validations/ValidationError'

let autoComplete

const SearchLocationInput = ({ name, control, rules, errors, country, ...props }) => {
    const autoCompleteRef = useRef(null)
    const [value, setValue] = useState()

    useEffect(() => {
        control.register(name, rules)
        setValue(control.getValues()?.address?.fullAddress)
    }, [])

    useEffect(() => {
        let options = {
            types: ['address'], //(cities), (regions), address
            componentRestrictions: {}
        }
        // if (country) options.componentRestrictions.country = country?.toLowerCase()
        if (typeof(country)=== "string") options.componentRestrictions.country = country.toLowerCase()
        if(typeof(country)=== "object") options.componentRestrictions.country = country?.value.toLowerCase()
        if (!window?.google?.maps?.places?.Autocomplete) {
            console.error('ERR PLACES AUTOCOMPLETE')
        } else {
            autoComplete = new window.google.maps.places.Autocomplete(
                autoCompleteRef.current,
                options
            )

            autoComplete.addListener('place_changed', () => {
                const addressObject = autoComplete.getPlace()
                let address_components = addressObject?.address_components
                const formatted_address = addressObject?.formatted_address
                if (Array.isArray(address_components)) {

                    const types = {
                        'street_number' : { type : 'number', key : 'housenumber'},
                        'route' : { key : 'street' },
                        'locality' : { key : 'city' },
                        'postal_code' : { key : 'postCode' },
                        // 'administrative_area_level_1' : '',
                        // 'administrative_area_level_2' : '',
                        'country' : { key : 'country' }
                    }

                    const addressMapper = Object.keys(types).reduce((carry, index) => {
                        const match = address_components.find(item => item.types.includes(index))
                        if(match) carry[types[index].key] = types[index].type === "number" ? Number(match?.long_name) : match?.long_name
                        return carry
                    },{})

                    const values = {
                        ...addressMapper,
                        fullAddress: formatted_address
                    }
                    control.setValue(name, values)
                    if(props.onChange)  if(typeof props.onChange  === "function") props.onChange(values)
                    // control.setValue(name, formatted_address)
                }
            })
        }
    }, [country])

    return (
        <>
            <div className={clsx('input-field', props.fullwidth && 'w-100', 'my-2')}>
                <input
                    type="text"
                    ref={e => {
                        autoCompleteRef.current = e
                    }}
                    defaultValue={value}
                    onKeyDown={e => {
                        if(e.keyCode === 13) {
                            e.preventDefault()
                            return false
                        }
                    }}
                    // onChange={(e={} ) => {
                    //     if(props.onChange) return props.onChange(e)
                    //     return e
                    // }}
                />
            </div>
            {errors && <ValidationError errors={errors} name={name}/>}
        </>
    )
}

SearchLocationInput.propTypes = {
    country: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    types: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
}

SearchLocationInput.defaultProps = {
    rules: {},
    country: 'fr',
    types: ['address'],
    onChange: {},
}

export default SearchLocationInput
