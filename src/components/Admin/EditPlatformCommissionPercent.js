import React, { useEffect, useState } from "react"
import clsx from 'clsx'
import { makeStyles } from "@material-ui/styles"
import { Avatar, Card, CardContent, Grid, InputAdornment, Typography } from "@material-ui/core"
import PrimaryIcon from '@material-ui/icons/Store'
import useKargainContract from "hooks/useKargainContract"
import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save'
import IconButton from '@material-ui/core/IconButton'
import { Skeleton } from "@material-ui/lab"


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
    const [isLoading, setIsLoading] = useState(false)
    const { fetchPlatformPercent, updatePlatformPercent } = useKargainContract()

    useEffect(()=> {
        const action = async () => {
            setIsLoading(true)

            try {
                const value = await fetchPlatformPercent()
                setPlatformCommissionPercent(value ? value.toString() : "0")
            } catch (error) {
                console.error(error)
                // TODO: handle this error
            }

            setIsLoading(false)
        } 

        action()
    }, [fetchPlatformPercent])

    const handlePlatformPercentSave = async () => {
        setIsLoading(true)
        setError(null)
            
        try {
            await updatePlatformPercent(platformCommissionPercent)
        } catch (error) {
            setError(error)
        }

        setIsLoading(false)
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
                                            disabled={isLoading}
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
                            helperText={error && error.message}
                            disabled={isLoading}
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
