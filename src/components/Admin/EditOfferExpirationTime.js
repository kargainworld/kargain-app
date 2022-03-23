import React, { useContext, useEffect, useState } from "react"
import clsx from 'clsx'
import { makeStyles } from "@material-ui/styles"
import { Avatar, Card, CardContent, Grid, InputAdornment, Typography } from "@material-ui/core"
import PrimaryIcon from '@material-ui/icons/Timer'
import useKargainContract from "hooks/useKargainContract"
import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save'
import IconButton from '@material-ui/core/IconButton'
import { Skeleton } from "@material-ui/lab"
import { MessageContext } from "context/MessageContext"

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 700
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    differenceIcon: {
        color: theme.palette.error.dark
    },
    differenceValue: {
        color: theme.palette.error.dark,
        marginRight: theme.spacing(1)
    }
}))

const EditOfferExpirationTime = props => {
    const { className, ...rest } = props

    const classes = useStyles()

    const [offerExpirationTime, setOfferExpirationTime] = useState(null)
    const [error, setError] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const { fetchOfferExpirationTime, updateOfferExpirationTime } = useKargainContract()

    const { dispatchModal } = useContext(MessageContext)

    const [isBlockchainFail, setIsBlockchainFail] = useState(false)

    useEffect(() => {
        if (isBlockchainFail) {
            return
        }

        const action = async () => {
            try {
                const value = await fetchOfferExpirationTime()
                if (!value)
                    return

                setOfferExpirationTime(value.toString())
            } catch (err) {
                console.error(err)
                setIsBlockchainFail(true)
            }
        }

        action()
    }, [fetchOfferExpirationTime, isBlockchainFail])

    const handleOfferExpirationSave = async () => {
        setIsConfirmed(false)
        setError(null)

        updateOfferExpirationTime(+offerExpirationTime)
            .then(() => {
                setIsConfirmed(true)
                dispatchModal({ msg: 'Expiration time confirmed!' })
            })
            .catch((error) => {
                console.error(error)
                setError(error)
                setIsConfirmed(true)
            })
    }

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}>
            <CardContent>
                <Grid
                    container
                    justifyContent="space-between">
                    <Grid item style={{ flex: 1 }}>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">
                            OFFER EXPIRATION
                        </Typography>
                        <br /><br />
                        {!isBlockchainFail && offerExpirationTime === null && <Skeleton variant="rect" width={210} height={56} />}
                        {!isBlockchainFail && offerExpirationTime !== null && <TextField
                            label="Days"
                            fullWidth={true}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleOfferExpirationSave}
                                            edge="end"
                                            disabled={!isConfirmed}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onChange={(event) => setOfferExpirationTime(event.target.value)}
                            value={offerExpirationTime}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            error={!!error}
                            helperText={error ? error.message : (!isConfirmed && "Waiting confirmation")}
                            disabled={!isConfirmed}
                            variant="outlined"
                        />}
                        {isBlockchainFail && <span>You cannot edit this value, check if you are connected to the correct network and if you are using an admin account.</span>}
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <PrimaryIcon className={classes.icon} />
                        </Avatar>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EditOfferExpirationTime
