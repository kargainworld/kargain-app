import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import styled from 'styled-components'

const VINchecker = styled.span`
    color: #0244ea;
    font-weight: 700;
`

export default function ConfirmDialog({ open, setOpen, handleConfirm, code }) {

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle disableTypography={true} id="alert-dialog-title">{"Confirm VIN code"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Your VIN is <VINchecker>{code}</VINchecker>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}
