import React, { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import AnnounceClass from '../../models/announce.model'
import { useAuth } from '../../context/AuthProvider'
// import { MessageContext } from 'context/MessageContext'
import commentsService from '../../services/CommentsService'
import CommentsList from './CommentsList'
import CommentForm from './CommentForm'
import CommentModel from '../../models/comment.model'
import { useMessage } from '../../context/MessageContext'

const Comments = ({ announceRaw }) => {
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const { dispatchModal, dispatchModalError } = useMessage()
    const textareaCommentRef = useRef()
    const announce = new AnnounceClass(announceRaw)
    const [comments, setComments] = useState(announce.getComments)
    const [doneSubmitting, setDoneSubmitting] = useState(true)

    const checkAuthRedirection = async () => {
        if (!isAuthenticated) {
            return router.push({
                pathname: '/auth/login',
                query: { redirect: router.asPath }
            })
        }
        return Promise.resolve()
    }

    const onSubmitComment = async (e) => {
        e.preventDefault()
        setDoneSubmitting(false)
        await checkAuthRedirection()
        const textarea = textareaCommentRef.current
        const message = textarea?.value
        if(textarea)  textarea.value = ''
        try {
            const comment = await commentsService.createComment({
                announce_id: announce.getID,
                message
            })
            setDoneSubmitting(true)
            dispatchModal({ msg: 'comment added successfully' })
            setComments((comments) => [...comments, new CommentModel(comment)])
        } catch (err) {
            setDoneSubmitting(true)
            dispatchModalError({ err })
        }
    }

    return (
        <div className="comments_container">
            <CommentsList comments={comments} />
            <CommentForm
                {...{
                    onSubmitComment,
                    textareaCommentRef,
                    doneSubmitting
                }}
            />
        </div>
    )
}

export default Comments
