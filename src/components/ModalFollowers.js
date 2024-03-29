import React, { useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next-translate/Link'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import CircularProgress from '@material-ui/core/CircularProgress'

import { ModalContext } from 'context/ModalContext'
// import { MessageContext } from 'context/MessageContext'
import { NewIcons } from '../assets/icons'

import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
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
        outline: 'none'
    },

    list: {
        listStyleType: 'none',
        overflowX: 'hidden',
        overflowY: 'auto'
    },

    pointerClose: {
        position: 'absolute',
        top: 3,
        right: 3,
        color: 'black'
    },

    title: {
        textAlign: 'center',
        color: 'black',
        fontWeight: '500',
        fontSize: '24px',
        lineHeight: '150%'
    }
}))

export default function ModalFollowers() {

    const isMobile = useMediaQuery('(max-width:768px)')

    const classes = useStyles()
    const { modalStateContext, dispatchModalState } = useContext(ModalContext)
    // const { dispatchModalError } = useContext(MessageContext)
    const [isFetching, setFetching] = useState(false)

    const handleClose = () =>
        dispatchModalState({
            openModalFollowers: false
        })

    const handleRemove = async (userId) => {
    //TODO remove follow/following users
        if (isFetching) return
        setFetching(true)
        await modalStateContext.handleUnSubscription(userId)
        setFetching(false)
    }

    return (
        <Modal className={classes.modal} open={modalStateContext.openModalFollowers} onClose={handleClose}>
            <Fade in={modalStateContext.openModalFollowers}>
                {isMobile ? (
                    <div className={classes.paper} style={{ width:'90%' }}>
                        <Typography component="h2" variant="h2" className={classes.title}>
                            {modalStateContext.modalFollowersTitle} ({modalStateContext.modalFollowersProfiles.length})
                        </Typography>

                        <div className={classes.pointerClose} style={{ marginTop:'10px', marginRight:'10px' }} onClick={handleClose}>
                            <NewIcons.close_color />
                            <NewIcons.inclose_color style={{ transform: 'translate(-14.7px, 0.3px)' }} />
                        </div>
                        <div className="my-2" style={{ marginLeft: '-20px' }}>
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
                                                        width="32"
                                                        height="32"
                                                        src={user.getAvatar || user.getAvatarUrl}
                                                        title={user.getFullName}
                                                        alt={user.getUsername}
                                                    />
                                                    <Typography variant="body1" style={{ color:'black' }}>{user.getFullName}</Typography>
                                                </a>
                                            </Link>
                                            {isFetching && <CircularProgress fontSize="small" />}
                                            {!isFetching && modalStateContext.isOwner && modalStateContext.isFollowing && (
                                                <IconButton>
                                                    <RemoveCircleIcon onClick={() => handleRemove(user.getID)} />
                                                </IconButton>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                ) : (
                    <div className={classes.paper}>
                        <Typography component="h2" variant="h2" className={classes.title}>
                            {modalStateContext.modalFollowersTitle} ({modalStateContext.modalFollowersProfiles.length})
                        </Typography>

                        <div className={classes.pointerClose} style={{ marginTop:'10px', marginRight:'10px' }} onClick={handleClose}>
                            <NewIcons.close_color />
                            <NewIcons.inclose_color style={{ transform: 'translate(-14.7px, 0.3px)' }} />
                        </div>
                        <div className="my-2" style={{ marginLeft: '-20px' }}>
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
                                                        width="32"
                                                        height="32"
                                                        src={user.getAvatar || user.getAvatarUrl}
                                                        title={user.getFullName}
                                                        alt={user.getUsername}
                                                    />
                                                    <Typography variant="body1" style={{ color:'black' }}>{user.getFullName}</Typography>
                                                </a>
                                            </Link>
                                            {isFetching && <CircularProgress fontSize="small" />}
                                            {!isFetching && modalStateContext.isOwner && modalStateContext.isFollowing && (
                                                <IconButton>
                                                    <RemoveCircleIcon onClick={() => handleRemove(user.getID)} />
                                                </IconButton>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                )}

            </Fade>
        </Modal>
    )
}
