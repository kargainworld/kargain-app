import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';


import { useAuth } from '../../context/AuthProvider'
import { MessageContext } from '../../context/MessageContext'
import CommentsService from '../../services/CommentsService'
import clsx from "clsx"
import { Avatar } from '../AnnounceCard/components'
import { Row } from 'reactstrap'
import AnnounceModel from '../../models/announce.model'
import { useSocket } from '../../context/SocketContext'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { NewIcons } from 'assets/icons'

const useStyles = makeStyles(() => ({
    '& ::-webkit-scrollbar': {
        width: '5px'
      },
      
      /* Track */
      '& ::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 5px grey', 
        borderRadius: '10px'
      },
       
      /* Handle */
      '& ::-webkit-scrollbar-thumb': {
        background: 'red', 
        borderRadius: '10px',
      },
      
      /* Handle on hover */
      '& ::-webkit-scrollbar-thumb:hover': {
        background: '#b30000' 
      }
}))

const CommentsList = ({ comments, moreLink, className }) => {
    const classes = useStyles()
    const [deletedComments, setDeletedComments] = useState([])
    const { authenticatedUser } = useAuth()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const [openDialogRemove, setOpenDialogRemove] = useState(false)
    const [selectCommentID, setSelectedCommentID] = useState()

    const handleOpenDialogRemove = (commentID) => {
        setOpenDialogRemove(true)
        setSelectedCommentID(commentID)
    }

    const handleCloseDialogRemove = () => {
        setOpenDialogRemove(false)
    }

    const handleRemoveComment = () => {
        CommentsService.disableComment(selectCommentID)
            .then(() => {
                dispatchModal({ msg: 'Comment successfully removed' })
                window.location.reload()
            }).catch(err => {
                dispatchModalError({ err })
            })
    }

    const complain = async (id) => {
        try {
            await CommentsService.complainToComment(id)

            dispatchModal({ msg: 'Complaint added' })
        } catch (err) {
            setDeletedComments([...deletedComments, id])
            dispatchModal({ msg: 'Comment already deleted' })
        }
    }

    const { getOnlineStatusByUserId } = useSocket()
    const filterComments = (CommentModel) => !deletedComments.includes(CommentModel.getID)

    const [state, setState] = useState({
        err: null,
        stateReady: false,
        isSelf: false,
        isAdmin: false,
        announce: new AnnounceModel()
    })

    const { announce } = state

    return (
        <div>
            <ModalConfirmRemoveComment
                openDialogRemove={openDialogRemove}
                handleCloseDialogRemove={handleCloseDialogRemove}
                handleCallback={handleRemoveComment}
            />

            <ul className = {clsx(classes)}
                    style={{listStyleType: 'none',
                        margin: '1rem 0',
                        height: '300px',
                        overflowY: 'scroll'}}>
                {comments && comments.filter(filterComments).map((comment, index) => {
                    const isOwn = authenticatedUser.getID === comment.getAuthor?.getID

                    if (!comment.getMessage || !comment.getAuthor?.getProfileLink) {
                        // TODO: new comment doesn't have getAuthor accessor.
                        // it appears only after full page reload.
                        return null
                    }

                    return (
                        <li key={index} className="d-flex align-items-top my-2">
                        {/* <li key={index} className="d-flex"> */}
                            <div style={{display:'flex', width:'80%', wordWrap: 'break-word'}}>
                                {!isOwn && (
                                    <div onClick={() => complain(comment.getID)}
                                        style={{
                                            color: '#999999',
                                            display: '-webkit-flex',
                                            display: '-moz-box',
                                            display: 'flex',
                                            alignItems: 'flex-start'}}
                                    >
                                        <Avatar
                                            className="img-profile-wrapper avatar-preview"
                                            src={comment.getAuthor?.getAvatar || comment.getAuthor?.getAvatarUrl}
                                            isonline={getOnlineStatusByUserId(comment.getAuthor?.getID)}
                                            alt={comment.getTitle}
                                            style={{ width: '41.83px', height: '41.83px', marginRight: '10px' }}
                                        />
                                    </div>
                                )}

                                {isOwn && (
                                    <span
                                        className="mx-1 top-profile-location edit"
                                        onClick={()=>handleOpenDialogRemove(comment.getID) }
                                        style={{
                                            color: '#999999',
                                            display: '-webkit-flex',
                                            display: '-moz-box',
                                            display: 'flex',
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <Avatar
                                            className="img-profile-wrapper avatar-preview"
                                            src={comment.getAuthor?.getAvatar || comment.getAuthor?.getAvatarUrl}
                                            isonline={getOnlineStatusByUserId(comment.getAuthor?.getID)}
                                            alt={comment.getTitle}
                                            style={{ width: '29.99px', height: '29.99px', marginLeft:'40px', marginRight: '10px'}}
                                        />
                                    </span>
                                )}

                                <div style={{display:'flex'}}>
                                    <label>
                                        <Link href={comment.getAuthor?.getProfileLink} style={{width:'30%'}}>
                                            <a style={{fontSize:'16.575px'}}>
                                                <strong>{comment.getAuthor?.getFullName} : </strong>
                                            
                                            </a>
                                        </Link>
                                        {comment.getMessage} 
                                    </label>
                                    {moreLink}
                                </div>
                            </div>
                            {!isOwn && (
                                <div style={{width: '20%', display:'flex', justifyContent: 'center'}}>
                                    <NewIcons.card_heart style={{width:'15px', height:'15px'}}/>
                                </div>
                            )}

                            {isOwn && (
                                <div style={{width: '20%', display:'flex', justifyContent: 'center'}}>
                                    <NewIcons.heart_blue />
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

const ModalConfirmRemoveComment = ({ openDialogRemove, handleCloseDialogRemove, handleCallback }) => {
    const { t } = useTranslation()

    return(
        <Dialog
            open={openDialogRemove}
            onClose={handleCloseDialogRemove}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" disableTypography>
                {t('vehicles:confirm-suppression')}
            </DialogTitle>
            <DialogActions>
                <Button onClick={handleCloseDialogRemove} color="primary" autoFocus>
                    {t('vehicles:cancel')}
                </Button>
                <Button
                    variant="contained"
                    startIcon={<RemoveCircleIcon/>}
                    onClick={handleCallback}>
                    {t('vehicles:remove_comment')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
CommentsList.propTypes = {
    comments: PropTypes.array.isRequired
}

export default CommentsList
