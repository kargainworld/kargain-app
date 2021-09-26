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

    const dispatchFormUpdate = (updates,
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
        if(formKey) {
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
