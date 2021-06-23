import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next-translate/Link';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import UsersService from '../services/UsersService';

import { ModalContext } from '../context/ModalContext';
import { MessageContext } from '../context/MessageContext';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '100%',
    maxWidth: 400,
    borderRadius: 5,
    position: 'relative',
    border: 'none',
    outline: 'none',
  },

  list: {
    listStyleType: 'none',
    overflowX: 'hidden',
    overflowY: 'auto',
  },

  pointerClose: {
    position: 'absolute',
    top: 3,
    right: 3,
    color: 'black',
  },

  title: {
    textAlign: 'center',
    color: 'black',
  },
}));

export default function ModalFollowers() {
  const classes = useStyles();
  const { modalStateContext, dispatchModalState } = useContext(ModalContext);
  const { dispatchModalError } = useContext(MessageContext);

  const handleClose = () =>
    dispatchModalState({
      openModalFollowers: false,
    });

  const handleRemove = async (userId) => {
    console.log(userId);
    //TODO remove follow/following users
  };

  return (
    <Modal className={classes.modal} open={modalStateContext.openModalFollowers} onClose={handleClose}>
      <Fade in={modalStateContext.openModalFollowers}>
        <div className={classes.paper}>
          <Typography component="h2" variant="h2" className={classes.title}>
            {modalStateContext.modalFollowersTitle} ({modalStateContext.modalFollowersProfiles.length})
          </Typography>

          <IconButton className={classes.pointerClose} onClick={handleClose}>
            <HighlightOffOutlinedIcon />
          </IconButton>

          <div className="my-2">
            <ul className={classes.list}>
              {modalStateContext.modalFollowersProfiles.map((user, index) => {
                return (
                  <li
                    key={index}
                    className="nav-item navbar-dropdown p-1 d-flex align-items-center justify-content-between"
                  >
                    <Link href={user.getProfileLink}>
                      <a className="d-flex align-items-center">
                        <img
                          className="dropdown-toggler rounded-circle mx-2"
                          width="50"
                          height="50"
                          src={user.getAvatar || user.getAvatarUrl}
                          title={user.getFullName}
                          alt={user.getUsername}
                        />
                        <Typography variant="body1">{user.getFullName}</Typography>
                      </a>
                    </Link>
                    <RemoveCircleIcon onClick={() => handleRemove(user.getID)} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
