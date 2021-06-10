import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import NotificationsIcon from '@material-ui/icons/Notifications'
import {CircularProgress} from "@material-ui/core";
import {fetchNotifications, removeNotification} from "../../services/NotificationsService";
import {makeStyles} from "@material-ui/styles";
import useSocket from '../../hooks/useSocket';
import { useAuth } from '../../context/AuthProvider';

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
          backgroundColor: 'rgba(0,0,0,.6)',
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
        top: "10%",
        right: "20%",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "red",
        '& .MuiBadge-badge': {
            background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%) !important'
        }
    }
}))

const NotificationsNav = ({ isOpen, keyName, toggle }) => {
    const classes = useStyles()
    const socket = useSocket()
    const { authenticatedUser } = useAuth()
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetchNotifications()
            .then(res => {
                if(res && res.pings) {
                    const newNotifications = res.pings.filter(item => !item.opened)
                    
                    if(newNotifications.length > 0) {
                        setNotifications(newNotifications)
                        if(!isOpen) setIsChecked(false)
                    } else setIsChecked(true)
                }
                setIsLoaded(true)
            })
            .finally(() => setIsLoading(false))
    }, [isOpen])

    useEffect(() => {
        if (socket){
            if(isOpen) {
                socket.emit('OPENED_NOTIFICATION', { user: authenticatedUser.getID })
                setIsChecked(true)
            }
            socket.on('GET_NOTIFICATION', (data) => {console.log("HERE!!!!!!!!!")
                setIsChecked(false)
            })
        }

    }, [socket, isOpen])

    const handleRemovePing = (pingId) => {
        setIsLoading(true)
        removeNotification(pingId).then(res => {
            if(res) setNotifications(notifications.filter((item) => item._id !== pingId))
        }).finally(() => setIsLoading(false))
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
                    onClick={() => {
                        toggle(keyName)
                        setIsChecked(true)
                    }}>
                    <NotificationsIcon/>
                    {!isChecked && !isOpen && <span className={classes.badge} />}
                </IconButton>

                <div id="dropdown-notifications"
                    className={clsx('dropdown-menu', isOpen && 'show', classes.wrapper)}>
                    <div>
                        {isLoading && <div className="d-flex justify-content-center align-items-center"><CircularProgress /></div> }
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
                                            <IconButton onClick={() => handleRemovePing(_id)}>
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
