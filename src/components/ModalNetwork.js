import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function ModalNetwork({ open, handleClose }) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={() => {}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xs"
            >
                <DialogTitle disableTypography id="alert-dialog-title" >{"Wrong Network"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Look like you connected to unsupported network. Change network to Matic
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Sign out
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
