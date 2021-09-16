import React, { createContext, useEffect, useReducer } from 'react'
import _ from 'lodash'

import useLocalStorage from '../hooks/useLocalStorage'

const FormContext = createContext({})

const reducer = (state, action) => {
    if (action.type === 'update') {
        return {
            ...state,
            ...action.payload
        }
    } else if (action.type === 'clear') {
        return {}
    } else {
        console.log('unknown action')
        return state
    }
}

const FormContextProvider = ({ formKey, children }) => {
    const [getFormData, storeFormData, clearFormData] = useLocalStorage(`formData_${formKey.toLowerCase()}`)
    const [formDataContext, dispatchFormDataContext] = useReducer(reducer, getFormData)

    // console.log('formDataContext', formDataContext)

    // const interceptors = useRef({
    //     // [fieldKey: string]: function(value: any, key: string): { [key: string]: value: any }
    // })
    //
    // const registerInterceptor = (fieldName, fn) => {
    //     interceptors.current = {
    //         ...interceptors.current,
    //         [fieldName]: fn
    //     }
    // }

    const dispatchFormUpdate = (
        updates, 
        { 
            compare = false, 
            excludeKeys = [] 
        } = {}
    ) => {
        if (compare) {
            const clearNew = _.omit(updates, excludeKeys)
            const clearOld = _.omit(_.pick(formDataContext, _.keys(updates)), excludeKeys)

            if (_.isEqual(clearNew, clearOld)) {
                return
            }
        }
        // let modified = {}
        //
        // _.each(updates, (value, key) => {
        //     const interceptor = interceptors.current[key]
        //     const isValueChanged = !_.isEqual(value, formDataContext[key])
        //
        //     // if (isValueChanged) {
        //     //     console.log('isValueChanged', key, isValueChanged)
        //     //     console.log('interceptor', key, interceptor)
        //     // }
        //
        //     if (!isValueChanged || typeof interceptor !== 'function') {
        //         return
        //     }
        //
        //     // console.log('modified', value, key)
        //     // console.log('interceptor(value, key)', interceptor(value, key))
        //
        //     // console.log({
        //     //     state: formDataContext[key],
        //     //     update: value,
        //     //     modified:
        //     // })
        //
        //     modified = {
        //         ...modified,
        //         ...interceptor(value, key)
        //     }
        // })
        //
        // modified = {
        //     ...updates,
        //     ...modified
        // }



        // console.log('payload:', {
        //     ...updates,
        //     ...modified
        // })

        dispatchFormDataContext({
            type: 'update',
            payload: updates
        })
    }

    const dispatchFormClear = () => {
        dispatchFormDataContext({
            type: 'clear',
            payload: {}
        })
        clearFormData()
    }

    useEffect(() => {
        if(formKey){
            storeFormData(formDataContext)
        }
    }, [formDataContext])

    return (
        <FormContext.Provider value={{
            formDataContext,
            dispatchFormUpdate,
            dispatchFormClear
            // registerInterceptor
        }}>
            {children}
        </FormContext.Provider>
    )
}

FormContextProvider.defaultProps = {
    formKey: ''
}

export { FormContext, FormContextProvider }
