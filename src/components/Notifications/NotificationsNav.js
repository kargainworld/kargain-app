import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'
import {fetchNotifications} from "../../services/NotificationsService";
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
    wrapper: {
        border: 'none !important',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1) !important',
        borderRadius: '5px !important',
        padding: '16px !important'
    },
    notification: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        '&:not(:last-child)': {
            marginBottom: 8
        }
    },
    readIndicator: {
        width: 8,
        height: 8,
        maxWidth: 8,
        maxHeight: 8,
        minWidth: 8,
        minHeight: 8,
        background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%)',
        borderRadius: '50%',
        opacity: 1
    },
    opened: {
        opacity: 0.3
    },
    badge: {
        '& .MuiBadge-badge': {
            background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%) !important'
        }
    }
}))

const NotificationsNav = ({ isOpen, keyName, toggle }) => {
    const classes = useStyles()

    const [notifications, setNotification] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false || true)

    const fetch = () => {
        setIsLoading(true)
        fetchNotifications()
            .then(res => {
                if(res && res.pings) {
                    setNotification(res.pings)
                }
                setIsLoaded(true)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (isOpen || !isLoaded) {
            fetch()
        }
    }, [isOpen])

    return (
        <li
            className={clsx('nav-item', 'navbar_icon')}
        >
            <div className="dropdown show">
                <IconButton color="inherit"
                    data-toggle="dropdown-notifications"
                    aria-haspopup="true"
                    aria-expanded="true"
                    id="dropdownMenu2"
                    onClick={() => toggle(keyName)}>
                    <NotificationsIcon/>
                </IconButton>

                <div id="dropdown-notifications"
                    className={clsx('dropdown-menu', isOpen && 'show', classes.wrapper)}>
                    <div>
                        {isLoading && <CircularProgress />}

                        {
                            !notifications.length && !isLoading && isLoaded && (
                                <div className="text-podpiska">
                                    <span>You are welcome on Kargain</span>
                                </div>
                            )
                        }

                        {
                            !!notifications.length && !isLoading && isLoaded && (
                                <ul style={{ listStyle: 'none' }}>
                                    {notifications.map(({ message, action, opened, _id }) => (
                                        <li key={_id} className={classes.notification}>
                                            <Link href={action || ''}>{message}</Link>
                                            <span className={clsx(classes.readIndicator, opened && classes.opened)} />
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    </div>
                </div>
            </div>
        </li>
    )
}

export default NotificationsNav
