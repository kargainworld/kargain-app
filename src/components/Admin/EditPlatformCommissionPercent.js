import React, { useContext, useEffect, useState } from "react"
import clsx from 'clsx'
import { makeStyles } from "@material-ui/styles"
import { Avatar, Card, CardContent, Grid, InputAdornment, Typography } from "@material-ui/core"
import PrimaryIcon from '@material-ui/icons/Store'
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

const EditPlatformCommissionPercent = props => {
    const { className, ...rest } = props

    const classes = useStyles()

    const [platformCommissionPercent, setPlatformCommissionPercent] = useState(null)
    const [error, setError] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const { fetchPlatformPercent, updatePlatformPercent } = useKargainContract()

    const { dispatchModal, dispatchModalError } = useContext(MessageContext)

    useEffect(()=> {
        const action = async () => {
            try {
                const value = await fetchPlatformPercent()
                if (!value)
                    return

                setPlatformCommissionPercent(value.toString())
            } catch (err) {
                console.error(err)
                dispatchModalError({ err })
            }
        } 

        action()
    }, [dispatchModalError, fetchPlatformPercent])

    const handlePlatformPercentSave = async () => {
        setIsConfirmed(false)
        setError(null)
            
        updatePlatformPercent(platformCommissionPercent)
            .then(() => {
                setIsConfirmed(true)
                dispatchModal({ msg: 'Platform commission confirmed!' })
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
                    justify="space-between">
                    <Grid item style={{ flex:1 }}>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom
                            variant="body2">
                            PLATFORM COMMISSION
                        </Typography>
                        <br /><br />
                        {platformCommissionPercent === null && <Skeleton variant="rect" width={210} height={56} />}
                        {platformCommissionPercent !== null && <TextField
                            label="Percent"
                            fullWidth={true}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handlePlatformPercentSave}
                                            edge="end"
                                            disabled={!isConfirmed}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onChange={(event) => setPlatformCommissionPercent(event.target.value)}
                            value={platformCommissionPercent}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            error={!!error}
                            helperText={error ? error.message : (!isConfirmed && "Waiting confirmation")}
                            disabled={!isConfirmed}
                            variant="outlined"
                        />}
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <PrimaryIcon className={classes.icon}/>
                        </Avatar>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default EditPlatformCommissionPercent
