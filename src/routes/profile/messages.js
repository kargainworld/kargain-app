import React, { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next-translate/Link'
import { useForm } from 'react-hook-form'
import parseISO from 'date-fns/parseISO'
import { format } from 'date-fns'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import UserModel from '../../models/user.model'
import { useAuth } from '../../context/AuthProvider'
import ConversationsService from '../../services/ConversationsService'
import useStyles from '../../components/Conversations/conversation.styles'
import { MessageContext } from '../../context/MessageContext'
import ValidationError from '../../components/Form/Validations/ValidationError'
import { useSocket } from '../../context/SocketContext'
import { Avatar } from '../../components/AnnounceCard/components'
import { Container } from 'reactstrap'
import { NewIcons } from 'assets/icons'

const Messages = () => {

    const isMobileCon = useMediaQuery('(max-width:768px)')
    const theme = useTheme()
    const contentRef = useRef()
    const classes = useStyles()
    const { t } = useTranslation()
    const { isAuthenticated, authenticatedUser } = useAuth()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [openedConversation, setOpenedConversation] = useState(false)
    const [selectedRecipient, setSelectedRecipient] = useState(null)
    const { reset, register, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all'
    })

    const { socket, privateMessage, getOnlineStatusByUserId } = useSocket()

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'), {
        defaultMatches: true
    })

    const loadConversations = async () => {
        try {
            const conversations = await ConversationsService.getCurrentUserConversations()
            setConversations(conversations)
        } catch (err) {
            dispatchModalError({ err })
        }
    }
    const newDate = new Date()
    const time = newDate.getHours()
    const min = newDate.getMinutes()
    const currenthour = time + ':' + min



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
            // const conversation = await ConversationsService.postConversationMessage(message, selectedRecipient.getID)
            // setSelectedConversation(conversation)
            // console.log(selectedConversation.announce.id);
            socket.emit('PRIVATE_MESSAGE', { message, to: selectedRecipient.getID, announceId: selectedConversation.announce.id })

            selectedConversation.messages.push({
                from: authenticatedUser.getID,
                content: message
            })

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

    const handleSelectConversation = (index) => {
        const conversation = conversations[index]
        setSelectedConversation(conversation)
        const to = new UserModel(conversation.to)
        const from = new UserModel(conversation.from)
        const recipient = from.getID === authenticatedUser.getID ? to : from
        setSelectedRecipient(recipient)
        setOpenedConversation(true)
    }

    const closeConversation = () => {
        setOpenedConversation(false)
    }

    useEffect(() => {
        if (isAuthenticated) loadConversations()
    }, [isAuthenticated])

    useEffect(() => {
        if (conversations.length) {
            handleSelectConversation(0)
        }
    }, [conversations])

    useEffect(() => {
        if (privateMessage && selectedRecipient) {
            const item = conversations.some((conversation, index) => {
                if(conversation.announce.id === selectedConversation.announce.id){
                    console.log(index, conversation.announce.id === selectedConversation.announce.id)
                    const messages = selectedConversation ? selectedConversation.messages : []
                    messages.push(privateMessage)
                    setSelectedConversation({
                        ...selectedConversation,
                        messages
                    })
                    return conversation
                } else if(conversation.announce.id === privateMessage.announceId){
                    console.log(index, conversation.announce.id === privateMessage.announceId)
                    conversations[index].messages.push(privateMessage)
                    setSelectedConversation({
                        ...conversations[index]
                    })
                    return conversation
                }
                console.log("breacked")
            })
        }
    }, [privateMessage])

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current?.scrollHeight
        }
    }, [contentRef.current?.scrollHeight, selectedRecipient])
    return (
        <Container style={{ marginTop:'30px' }}>
            {isMobileCon ? (
                <h2 style={{ fontSize:'20px', marginLeft:'15px' }}>{t('vehicles:messaging')}</h2>
            ) : (
                <h2 style={{ fontSize:'28px', marginLeft:'15px' }}>{t('vehicles:messaging')}</h2>
            )}

            <div className={classes.conversations} >
                <div className={classes.conversationsList}>
                    <div className={classes.styleScroller}>
                        <div className={classes.scrollerContainer}>
                            <div style={{ width: '100%' }}>
                                {conversations.length > 0 ? (
                                    conversations.map((conversation, index) => {
                                        const to = new UserModel(conversation.to)
                                        const from = new UserModel(conversation.from)
                                        const recipient = from.getID === authenticatedUser.getID ? to : from

                                        return (
                                            <div
                                                key={index}
                                                className={classes.conversationListItem}
                                                onClick={() => handleSelectConversation(index)}
                                                style={{ marginLeft:'-10px' }}
                                            >
                                                <div>
                                                    <Avatar
                                                        className="rounded-circle mx-2"
                                                        src={recipient.getAvatar || recipient.getAvatarUrl}
                                                        alt={recipient.getUsername}
                                                        isonline={getOnlineStatusByUserId(recipient.getID)}
                                                        style={{ width: 32, height: 32 }}
                                                    />
                                                </div>
                                                <div className={classes.itemDetails} style={{ width:'100%' }}>

                                                    <p className="mt-0" style={{ fontSize:'16px', fontWeight:'normal', color:'black' }}>{recipient.getFullName} | <span className="mx-2">{conversation.announce.title}</span></p>
                                                    <p className={classes.itemDetailsPreview} style={{ color:'#999999', fontSize:'14px' }}>
                                                        {format(parseISO(conversation.createdAt), 'MM/dd/yyyy')}
                                                    </p>
                                                    <p className={classes.itemDetailsPreview}>{conversation?.message?.content}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p>{t('vehicles:no_conversations_yet')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {isMobile ? (
                    <>
                        {selectedConversation && selectedRecipient && (
                            <div
                                className={clsx(classes.conversation, !openedConversation && classes.conversationCloseMobile)}
                                style={{ width: '90%', marginLeft:'5%' }}
                            >
                                <div style={{ margin: '25px 0px 10px -27px' }}>
                                    <div className={classes.headerUsername}>
                                        <div style={{ maxWidth: '70%', display: "-webkit-inline-box" }}>
                                            <Link href={selectedRecipient.getProfileLink} prefetch={false}>
                                                <a>
                                                    <Avatar
                                                        className="rounded-circle mx-2"
                                                        src={selectedRecipient.getAvatar || selectedRecipient.getAvatarUrl}
                                                        alt={selectedRecipient.getUsername}
                                                        isonline={getOnlineStatusByUserId(selectedRecipient.getID)}
                                                        style={{ width: 32, height: 32 }}
                                                    />
                                                    <span className="mx-2">{selectedRecipient.getFullName}</span>
                                                </a>
                                            </Link>
                                            {/* <Link href={`/announces/${selectedConversation.announce.slug}`} prefetch={false}>
                        <a>
                            <img
                              src={selectedConversation.announce.images[0].location}
                              alt={selectedConversation.announce.title}
                              style={{width: 52, height: 52, borderRadius: "10%"}}
                            />
                          <span className="mx-2">{selectedConversation.announce.title}</span>
                        </a>
                      </Link> */}
                                        </div>
                                        {isMobile && (
                                            <div className={classes.pointerClose} onClick={() => closeConversation()}>
                                                <CloseIcon />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={classes.conversationContent} ref={contentRef}>
                                    <div className={classes.messageContainer}>
                                        {/* {selectedConversation.createdAt && format(parseISO(selectedConversation.createdAt), 'MM/dd/yyyy')} */}
                                        {selectedConversation?.messages.map((message, index) => {
                                            if (authenticatedUser.getID === message?.from) {
                                                var time
                                                if(message?.createdAt ){
                                                    time = format(parseISO(message?.createdAt), 'hh:mm')
                                                }else{
                                                    time = currenthour
                                                }
                                                return (
                                                    <div key={index} className={classes.textJustifiedEnd}>

                                                        <div className={classes.basicMessage}>
                                                            <div className={classes.messageBubble}>

                                                                <label style={{ fontSize:'12px', marginRight:'10px', marginTop:'10px' }}>{time}</label>
                                                                <label> {message?.content} </label>
                                                            </div>
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
                                                if(message?.createdAt ){
                                                    time = format(parseISO(message?.createdAt), 'hh:mm')
                                                }else{
                                                    time = currenthour
                                                }
                                                return (
                                                    <div key={index} className={classes.textJustifiedStart}>
                                                        <div className={classes.basicMessage}>
                                                            <img
                                                                className="dropdown-toggler rounded-circle mx-2"
                                                                width="30"
                                                                height="30"
                                                                src={selectedRecipient.getAvatar || selectedRecipient.getAvatarUrl}
                                                                title={selectedRecipient.getFullName}
                                                                alt={selectedRecipient.getUsername}
                                                            />
                                                            <div className={classes.messageBubbleLeft}>
                                                                <label> {message?.content} </label>
                                                                <label style={{ fontSize:'12px', marginLeft:'10px', marginTop:'10px' }}>{time}</label>

                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                                <div className={classes.conversationFooter}>
                                    <form className={classes.conversationForm} onSubmit={handleSubmit(onSubmitMessage)}>
                                        <div style={{ display: 'flex' }}>
                                            <input
                                                className={classes.conversationTextarea}
                                                name="message"
                                                ref={register({ required: t('form_validations:required') })}
                                                placeholder={t('vehicles:write_your_message')}
                                                maxLength={30000}
                                                rows={2}
                                                onKeyDown={onEnterPress}
                                            />
                                            {errors && <ValidationError errors={errors} name={name} />}
                                            <div className={classes.conversationInputButton} style={{ marginLeft:'10px' }}>
                                                <NewIcons.sendicon />
                                            </div>

                                            <button className={classes.conversationInputButton} type="submit">
                                                <NewIcons.sendbtn />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {selectedConversation && selectedRecipient && (
                            <div
                                className={clsx(classes.conversation, !openedConversation && classes.conversationCloseMobile)}
                                style={{ width: '68%', marginLeft:'2%' }}
                            >
                                <div style={{ margin: '1px 0px 10px -27px' }}>
                                    <div className={classes.headerUsername}>
                                        <div style={{ maxWidth: '70%', display: "-webkit-inline-box" }}>
                                            <Link href={selectedRecipient.getProfileLink} prefetch={false}>
                                                <a>
                                                    <Avatar
                                                        className="rounded-circle mx-2"
                                                        src={selectedRecipient.getAvatar || selectedRecipient.getAvatarUrl}
                                                        alt={selectedRecipient.getUsername}
                                                        isonline={getOnlineStatusByUserId(selectedRecipient.getID)}
                                                        style={{ width: 32, height: 32 }}
                                                    />
                                                    <span className="mx-2">{selectedRecipient.getFullName}</span>
                                                </a>
                                            </Link>
                                            {/* <Link href={`/announces/${selectedConversation.announce.slug}`} prefetch={false}>
                        <a>
                            <img
                              src={selectedConversation.announce.images[0].location}
                              alt={selectedConversation.announce.title}
                              style={{width: 52, height: 52, borderRadius: "10%"}}
                            />
                          <span className="mx-2">{selectedConversation.announce.title}</span>
                        </a>
                      </Link> */}
                                        </div>
                                        {isMobile && (
                                            <div className={classes.pointerClose} onClick={() => closeConversation()}>
                                                <CloseIcon />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={classes.conversationContent} ref={contentRef}>
                                    <div className={classes.messageContainer}>
                                        {/* {selectedConversation.createdAt && format(parseISO(selectedConversation.createdAt), 'MM/dd/yyyy')} */}
                                        {selectedConversation?.messages.map((message, index) => {
                                            if (authenticatedUser.getID === message?.from) {
                                                var time
                                                if(message?.createdAt ){
                                                    time = format(parseISO(message?.createdAt), 'hh:mm')
                                                }else{
                                                    time = currenthour
                                                }
                                                return (
                                                    <div key={index} className={classes.textJustifiedEnd}>

                                                        <div className={classes.basicMessage}>
                                                            <div className={classes.messageBubble}>

                                                                <label style={{ fontSize:'12px', marginRight:'10px', marginTop:'10px' }}>{time}</label>
                                                                <label> {message?.content} </label>
                                                            </div>
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
                                                if(message?.createdAt ){
                                                    time = format(parseISO(message?.createdAt), 'hh:mm')
                                                }else{
                                                    time = currenthour
                                                }
                                                return (
                                                    <div key={index} className={classes.textJustifiedStart}>
                                                        <div className={classes.basicMessage}>
                                                            <img
                                                                className="dropdown-toggler rounded-circle mx-2"
                                                                width="30"
                                                                height="30"
                                                                src={selectedRecipient.getAvatar || selectedRecipient.getAvatarUrl}
                                                                title={selectedRecipient.getFullName}
                                                                alt={selectedRecipient.getUsername}
                                                            />
                                                            <div className={classes.messageBubbleLeft}>
                                                                <label> {message?.content} </label>
                                                                <label style={{ fontSize:'12px', marginLeft:'10px', marginTop:'10px' }}>{time}</label>

                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                                <div className={classes.conversationFooter}>
                                    <form className={classes.conversationForm} onSubmit={handleSubmit(onSubmitMessage)}>
                                        <input
                                            className={classes.conversationTextarea}
                                            name="message"
                                            ref={register({ required: t('form_validations:required') })}
                                            placeholder={t('vehicles:write_your_message')}
                                            maxLength={30000}
                                            rows={2}
                                            onKeyDown={onEnterPress}
                                        />
                                        {errors && <ValidationError errors={errors} name={name} />}
                                        <div className={classes.conversationInputButton} style={{ marginLeft:'10px' }}>
                                            <NewIcons.sendicon />
                                        </div>

                                        <button className={classes.conversationInputButton} type="submit">
                                            <NewIcons.sendbtn />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </Container>
    )
}

export default Messages
