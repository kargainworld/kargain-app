import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '../../assets/icons/HeaderNotification.svg';
import { CircularProgress } from '@material-ui/core';
import { fetchNotifications, removeNotification } from '../../services/NotificationsService';
import { makeStyles } from '@material-ui/styles';
import { useSocket } from '../../context/SocketContext';

const useStyles = makeStyles(() => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      background: '#fff',
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.6)',
    },
  },
  wrapper: {
    border: 'none !important',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1) !important',
    borderRadius: '5px !important',
    paddingLeft: '16px !important',
    maxHeight: 300,
    overflowY: 'scroll',
  },
  notification: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    '&:not(:last-child)': {
      marginBottom: 8,
    },
  },
  readIndicator: {
    width: 10,
    height: 10,
    background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%)',
    borderRadius: '50%',
    opacity: 1,
    margin: 5,
  },
  opened: {
    opacity: 0.3,
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '10px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#A291F3',
    // background: 'linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%) !important',
  },
  counts: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '8px',
  },
}));

const NotificationsNav = ({ isOpen, keyName, toggle }) => {
  const classes = useStyles();
  const {
    isNotificationChecked,
    notificationsChecked,
    notifications,
    setNotifications,
    notificationCounts,
    setNotificationCounts,
  } = useSocket();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen || !isNotificationChecked) {
      setIsLoading(true);
      fetchNotifications()
        .then((res) => {
          if (res && res.pings) {
            setNotifications(res.pings);
            const newNotifications = res.pings.filter((item) => !item.opened);
            if (newNotifications.length > 0) {
              setNotificationCounts(newNotifications.length);
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
          notificationsChecked(isOpen);
        });
    }
  }, [isOpen]);

  const handleRemovePing = (pingId) => {
    setIsLoading(true);
    removeNotification(pingId)
      .then((res) => {
        if (res) setNotifications(notifications.filter((item) => item._id !== pingId));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <li className={clsx('nav-item', 'navbar_icon')}>
      <div className="dropdown show">
        <IconButton
          color="inherit"
          data-toggle="dropdown-notifications"
          aria-haspopup="true"
          aria-expanded="true"
          id="dropdownMenu2"
          onClick={() => toggle(keyName)}
        >
          <NotificationsIcon style={{width:'21px', height:'21px'}}/>
          {!isNotificationChecked && !isOpen && notificationCounts > 0 && (
            <span className={classes.badge}>
              <div className={classes.counts}>{notificationCounts}</div>
            </span>
          )}
        </IconButton>

        <div id="dropdown-notifications" className={clsx('dropdown-menu', isOpen && 'show', classes.wrapper)}>
          <div>
            {!notifications.length && isOpen && (
              <div className="text-podpiska">
                <span>You are welcome on Kargain</span>
              </div>
            )}

            {!!notifications.length && isOpen && (
              <ul style={{ listStyle: 'none' }}>
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <CircularProgress />
                  </div>
                ) : (
                  notifications.map(({ message, action, opened, _id }) => (
                    <li key={_id} className={classes.notification}>
                      <Link href={action || ''}>{message}</Link>
                      <IconButton onClick={() => handleRemovePing(_id)}>
                        <span className={clsx(classes.readIndicator, opened && classes.opened)} />
                      </IconButton>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default NotificationsNav;
