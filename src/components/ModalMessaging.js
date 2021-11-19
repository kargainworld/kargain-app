import React, { useRef, useContext, useEffect, useState } from 'react'
import Link from 'next-translate/Link'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useForm } from 'react-hook-form'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'
import { format } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import { MessageContext } from 'context/MessageContext'
import { useAuth } from '../context/AuthProvider'
import useStyles from './Conversations/conversation.styles'
import ValidationError from './Form/Validations/ValidationError'
import ConversationsService from '../services/ConversationsService'
import { ModalContext } from '../context/ModalContext'
import { useSocket } from '../context/SocketContext'
import { Avatar } from '../components/AnnounceCard/components'

export default function ModalMessaging() {
    const contentRef = useRef()
    const classes = useStyles()
    const router = useRouter()
    const { t } = useTranslation()
    const { isAuthenticated, authenticatedUser } = useAuth()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { modalStateContext, dispatchModalState } = useContext(ModalContext)
    const [conversation, setConversation] = useState(null)
    const { register, errors, handleSubmit, reset } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all'
    })

    const announce = modalStateContext.modalMessaginAnnounce
    const recipient = modalStateContext.modalMessagingProfile
    const recipientID = recipient.getID
    const announceID = announce?.getID
    const { socket, privateMessage, getOnlineStatusByUserId } = useSocket()

    const handleClose = () => {
        dispatchModalState({
            openModalMessaging: false
        })
    }

    const loadConversation = async () => {
        try {
            let conversation = announceID ? (await ConversationsService.getConversationWithProfileAnnounce(recipientID, announceID)) : (await ConversationsService.getConversationWithProfile(recipientID))
            setConversation(conversation)
        } catch (err) {
            dispatchModalError({ err })
        }
    }

    const onEnterPress = (e) => {
        e.persist()
        if(e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault()
            onSubmitMessage({ message: e.target.value })
        }
    }

    const onSubmitMessage = async (form) => {
        const { message } = form
        try {
            socket.emit('PRIVATE_MESSAGE', { message, to: recipientID, announceId:  conversation?.announce ? conversation.announce.id: announceID })
            if (conversation) conversation.messages.push({ from: authenticatedUser.getID, announceId:  conversation.announce.id, content: message })
            else {
                let conversation = {}
                conversation.messages = [{ from: authenticatedUser.getID, content: message }]
                setConversation(conversation)
            }
            dispatchModal({ msg: 'Message posted' })
            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current?.scrollHeight
            }
            reset()
        } catch (err) {
            dispatchModalError({
                err,
                persist: true
            })
        }
    }

    useEffect(() => {
        if (isAuthenticated && recipientID) {
            loadConversation()
        }
    }, [recipientID, isAuthenticated])

    useEffect(() => {
        if (privateMessage?.announceId === conversation?.announce?.id) {
            const messages = conversation ? conversation.messages : []
            messages.push(privateMessage)
            setConversation({
                ...conversation,
                messages
            })
        }
    }, [privateMessage])

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current?.scrollHeight
        }
    }, [contentRef.current?.scrollHeight])

    if (!isAuthenticated) {
        router.push({
            pathname: '/auth/login',
            query: { redirect: router.asPath }
        })
        return
    }

    return (
        <Modal open={modalStateContext.openModalMessaging} className={classes.modal} onClose={handleClose}>
            <Fade in={modalStateContext.openModalMessaging}>
                <div className={classes.paper}>
                    {recipient && (
                        <div className={classes.conversation}>
                            <div className={classes.conversationHeader}>
                                <div className={classes.headerUsername}>
                                    <div style={{ maxWidth: '70%', display: "-webkit-inline-box" }}>
                                        <Link href={recipient.getProfileLink} prefetch={false}>
                                            <a>
                                                <Avatar
                                                    className="rounded-circle"
                                                    src={recipient.getAvatar || recipient.getAvatarUrl}
                                                    alt={recipient.getUsername}
                                                    isonline={getOnlineStatusByUserId(recipient.getID)}
                                                    style={{ width: 52, height: 52 }}
                                                />
                                                <span className="mx-2">{recipient.getFullName}</span>
                                            </a>
                                        </Link>
                                        { announce?.getID ? (<Link href={announce?.getAnnounceLink} prefetch={false}>
                                            <a>
                                                <img
                                                    src={announce?.getFeaturedImg?.getLocation}
                                                    alt={announce?.getTitle}
                                                    style={{ width: 52, height: 52, borderRadius: "10%" }}
                                                />
                                                <span className="mx-2">{announce?.getAnnounceTitle}</span>
                                            </a>
                                        </Link>) : (<Link href={`/announces/${conversation?.announce?.slug}`} prefetch={false}>
                                            <a>
                                                <img
                                                    src={conversation?.announce?.images[0]?.location}
                                                    alt={conversation?.announce?.getTitle}
                                                    style={{ width: 52, height: 52, borderRadius: "10%" }}
                                                />
                                                <span className="mx-2">{conversation?.announce?.title}</span>
                                            </a>
                                        </Link>)}
                                    </div>
                                </div>
                            </div>
                            <div className={classes.conversationContent} ref={contentRef}>
                                <div className={classes.messageContainer}>
                                    {conversation?.messages?.length !== 0 ? (
                                        <>
                                            {conversation?.createdAt && format(parseISO(conversation.createdAt), 'MM/dd/yyyy')}
                                            {conversation?.messages.map((message, index) => {
                                                if (authenticatedUser.getID === message?.from) {
                                                    return (
                                                        <div key={index} className={classes.textJustifiedEnd}>
                                                            <div className={classes.basicMessage}>
                                                                <div className={classes.messageBubble}>{message?.content}</div>

                                                                <img
                                                                    className="dropdown-toggler rounded-circle mx-2"
                                                                    width="30"
                                                                    height="30"
                                                                    src={authenticatedUser.getAvatar || authenticatedUser.getAvatarUrl}
                                                                    title={authenticatedUser.getFullName}
                                                                    alt={authenticatedUser.getUsername}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={index} className={classes.textJustifiedStart}>
                                                            <div className={classes.basicMessage}>
                                                                <img
                                                                    className="dropdown-toggler rounded-circle mx-2"
                                                                    width="30"
                                                                    height="30"
                                                                    src={recipient.getAvatar || recipient.getAvatarUrl}
                                                                    title={recipient.getFullName}
                                                                    alt={recipient.getUsername}
                                                                />
                                                                <div className={classes.messageBubbleLeft}>{message?.content}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </>
                                    ) : (
                                        <Typography variant="body1">{`Start a conversation with ${recipient.getFullName}`}</Typography>
                                    )}
                                </div>
                            </div>
                            <div className={classes.conversationFooter}>
                                <form
                                    className={classes.conversationForm}
                                    onSubmit={(...args) => {
                                        const [event] = args
                                        event?.preventDefault()
                                        return handleSubmit(onSubmitMessage)(...args)
                                    }}
                                >
                                    <textarea
                                        className={classes.conversationTextarea}
                                        name="message"
                                        ref={register({ required: t('form_validations:required') })}
                                        placeholder={t('layout:write_your_message')}
                                        maxLength={30000}
                                        rows={2}
                                        onKeyDown={onEnterPress}
                                    />
                                    {errors && <ValidationError errors={errors} name={name} />}
                                    <button className={classes.conversationInputButton} type="submit">
                                        {t('layout:send')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </Fade>
        </Modal>
    )
}
