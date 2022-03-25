import React, { useContext } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import useTranslation from 'next-translate/useTranslation'
import { useMessage } from '../context/MessageContext'

const getMessage = (state, t) => {
    if (state.msg) return state.msg
    if (state.type === 'error') {
        const err = typeof state.err === 'object' ? state.err?.message : state.err
        return t(`messages_api: ${err}`)
    }
    return null
}

const PopupAlert = () => {
    const { t } = useTranslation()
    const { modalState: state  = {} } = useMessage()

    const message = getMessage(state, t)

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                severity={typeof state.type === 'string' ? state.type : 'info'}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default PopupAlert
