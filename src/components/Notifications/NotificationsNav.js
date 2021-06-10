import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import NotificationsIcon from '@material-ui/icons/Notifications'
import {fetchNotifications, removeNotification} from "../../services/NotificationsService";
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import useSocket from '../../hooks/useSocket';

const useStyles = makeStyles(() => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
            background: '#fff',
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid'
        }
    },
    wrapper: {
        border: 'none !important',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1) !important',
        borderRadius: '5px !important',
        paddingLeft: '16px !important',
        maxHeight: 300,
        overflowY: "scroll"
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
        width: 10,
        height: 10,
        background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%)',
        borderRadius: '50%',
        opacity: 1,
        margin: 5
    },
    opened: {
        opacity: 0.3
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "red",
        '& .MuiBadge-badge': {
            background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%) !important'
        }
    },
    amount: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: 14
    }
}))

const NotificationsNav = ({ isOpen, keyName, toggle }) => {
    const classes = useStyles()
    const socket = useSocket()

    const [notifications, setNotification] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        fetchNotifications()
            .then(res => {
                if(res && res.pings) {
                    setNotification(res.pings)
                }
                setIsLoaded(true)
            })
    }, [])

    useEffect(() => {
        if (socket)
            socket.on('GET_NOTIFICATION', data => {
                console.log(data)
            })
    }, [socket])

    const handleRemovePing = (pingId) => {
        removeNotification(pingId).then(res => {
            console.log(res);
        })
    }

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
                    {!isOpen && !!notifications.length && <span className={classes.badge}>
                        <div className={classes.amount}>{notifications.length}</div>
                    </span>}
                </IconButton>

                <div id="dropdown-notifications"
                    className={clsx('dropdown-menu', isOpen && 'show', classes.wrapper)}>
                    <div>
                        {
                            !notifications.length && isLoaded && (
                                <div className="text-podpiska">
                                    <span>You are welcome on Kargain</span>
                                </div>
                            )
                        }

                        {
                            !!notifications.length && isLoaded && (
                                <ul style={{ listStyle: 'none' }}>
                                    {notifications.map(({ message, action, opened, _id }) => (
                                        <li key={_id} className={classes.notification}>
                                            <Link href={action || ''}>{message}</Link>
                                            <IconButton sizeSmall onClick={() => handleRemovePing(_id)}>
                                                <span className={clsx(classes.readIndicator, opened && classes.opened)} />
                                            </IconButton>
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
