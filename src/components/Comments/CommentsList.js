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

const CommentsList = ({ comments, moreLink, className }) => {
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

    const filterComments = (CommentModel) => !deletedComments.includes(CommentModel.getID)

    return (
        <div>
            <ModalConfirmRemoveComment
                openDialogRemove={openDialogRemove}
                handleCloseDialogRemove={handleCloseDialogRemove}
                handleCallback={handleRemoveComment}
            />

            <ul className="commentsCardList" style={{height: '500px'}}>
                {comments && comments.filter(filterComments).map((comment, index) => {
                    const isOwn = authenticatedUser.getID === comment.getAuthor?.getID

                    if (!comment.getMessage || !comment.getAuthor?.getProfileLink) {
                        // TODO: new comment doesn't have getAuthor accessor.
                        // it appears only after full page reload.
                        return null
                    }

                    return (
                        <li key={index} className="d-flex align-items-center my-2">
                            {!isOwn && (
                                <div onClick={() => complain(comment.getID)}>
                                    <Avatar
                                        className="img-profile-wrapper avatar-preview"
                                        // src={''}
                                        // isonline={getOnlineStatusByUserId('')}
                                        // alt={''}
                                        style={{ width: '41.83px', height: '41.83px', marginRight: '5px' }}
                                    />
                                </div>
                            )}

                            {isOwn && (
                                <span
                                    className="mx-1 top-profile-location edit"
                                    onClick={()=>handleOpenDialogRemove(comment.getID) }>
                                     <Avatar
                                        className="img-profile-wrapper avatar-preview"
                                        // src={''}
                                        // isonline={getOnlineStatusByUserId('')}
                                        // alt={''}
                                        style={{ width: '29.99px', height: '29.99px', marginLeft:'40px', marginRight: '5px' }}
                                    />
                                </span>
                            )}

                            {/* <Link href={comment.getAuthor?.getProfileLink}>
                                <a>
                                    <Typography as="p" gutterBottom className="mx-1" style={{fontSize:'16.575px'}}>
                                        <strong>{comment.getAuthor?.getFullName} : </strong>
                                    </Typography>
                                </a>
                            </Link>

                            <div style={{display: 'flex', justifyContent: 'space-between', maxWidth: '100%', marginBottom: 8 }}>
                                <Typography
                                    as="p"
                                    gutterBottom
                                    style={{ whiteSpace: 'nowrap', maxWidth: '100%', textOverflow: 'ellipsis', marginRight: 16,
                                        marginBottom: 0, fontSize:'16.575px' }}
                                >
                                    {comment.getMessage}
                                </Typography>

                                {moreLink}
                            </div> */}
                         
                             <div style={{ width:"70%", wordWrap: 'normal'}}>
                                
                                <Link href={comment.getAuthor?.getProfileLink}>
                                    <a style={{fontSize:'16.575px'}}>
                                        <strong>{comment.getAuthor?.getFullName} : </strong>
                                    </a>
                                </Link>

                                <label style={{fontSize:'16.575px'}}>{comment.getMessage} </label>
                                {moreLink}
                            </div>
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
