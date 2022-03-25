import React, { createContext, useContext,  useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'

const initialState = {
    fetch: () => {}
}

const BackdropContext = createContext(initialState)

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    }
}))

export const BackdropContextProvider = ({ children }) => {
    const classes = useStyles()
    const [open, setOpen] = useState(false)

    const fetch = (status) => {
        setOpen(status)
    }

    return (
        <BackdropContext.Provider
            value={{
                fetch
            }}
        >
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {children}
        </BackdropContext.Provider>
    )
}

export const useBackdrop = () => {
    const context = useContext(BackdropContext)
    if (context === undefined) {
        throw new Error('BackdropContext must be used within an BackdropProvider')
    }
    return context
}
