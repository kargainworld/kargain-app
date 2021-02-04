import  { useContext, useEffect } from 'react'
import { useToasts } from "@geist-ui/react"

import { MessageContext } from '../context/MessageContext'
import useTranslation from 'next-translate/useTranslation'

const getMessage = (state, t) => {
    if (state.msg) return state.msg
    if (state.type === 'error') {
        const err = typeof state.err === 'object' ? state.err?.message : state.err
        return t(`messages_api: ${err}`)
    }
    return null
}

const PopupAlert = () => {
    const [, setToast] = useToasts()

    const { t } = useTranslation()
    const { modalState: state  = {}} = useContext(MessageContext)

    const message = getMessage(state, t)

    useEffect(() => {
        if (state.active) {
            setToast({
                text: message,
                type: state.type
            })
        }
    }, [state.active, message])

    return null
}

export default PopupAlert
