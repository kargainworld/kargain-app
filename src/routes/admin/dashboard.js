import React from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import Budget from '../../components/Admin/temp/Budget'
import TotalUsers from '../../components/Admin/temp/TotalUsers'
import TasksProgress from '../../components/Admin/temp/TasksProgress/TasksProgress'
import TotalProfit from '../../components/Admin/temp/TotalProfit'
import EditPlatformCommissionPercent from '../../components/Admin/EditPlatformCommissionPercent'
import EditOfferExpirationTime from '../../components/Admin/EditOfferExpirationTime'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}))

const DashboardAdmin = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>              
            <Grid
                container
                spacing={4}>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}>
                    <Budget />
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}>
                    <TotalUsers />
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}>
                    <TasksProgress />
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}>
                    <TotalProfit />
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                    <EditPlatformCommissionPercent />
                </Grid>
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xl={3}
                    xs={12}
                >
                    <EditOfferExpirationTime />
                </Grid>
            </Grid>
        </div>
    )
}

export default DashboardAdmin
