import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import IconButton from '@material-ui/core/IconButton'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'
import {fetchNotifications} from "../../services/NotificationsService";
import {CircularProgress} from "@material-ui/core";

const NotificationsNav = ({ isOpen, keyName, toggle }) => {
    const [notifications, setNotification] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    const fetch = () => {
        setIsLoading(true)
        fetchNotifications()
            .then(({ pings }) => {
                setNotification(pings)
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
            className={clsx('nav-item', 'navbar_icon', {
                ['navbar-icon-notifications']: notifications.some(({ opened }) => !opened)
            })}
        >
            <div className="dropdown show">
                <IconButton color="inherit"
                    data-toggle="dropdown-notifications"
                    aria-haspopup="true"
                    aria-expanded="true"
                    id="dropdownMenu2"
                    onClick={() => toggle(keyName)}>
                    <Badge badgeContent={notifications.length} color="secondary">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>

                <div id="dropdown-notifications"
                    className={clsx('dropdown-menu', isOpen && 'show')}>
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
                                <ul style={{ paddingLeft: 16 }}>
                                    {notifications.map(({ message, action, _id }) => (
                                        <li key={_id}>
                                            <Link href={action}>{message}</Link>
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
