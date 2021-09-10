import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Typography from '@material-ui/core/Typography'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import copy from 'copy-to-clipboard'
import { ModalContext } from '../context/ModalContext'
import EmailInput from '../components/Form/Inputs/EmailInput'
import AnnounceService from '../services/AnnounceService'
import { MessageContext } from '../context/MessageContext'
import { useAuth } from '../context/AuthProvider'
import ro from 'date-fns/locale/ro/index.js'
import customColors from '../theme/palette'
import clsx from 'clsx'
import { NewIcons } from '../assets/icons';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    
    paper: {
        backgroundColor: theme.palette.background.paper,
        // border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 4),
        maxWidth : '600px',
        width : '30%',
        textAlign: 'center',
    },

    list: {
        listStyleType: 'none',
        height: '500px',
        width: '300px',
        overflowX: 'hidden',
        overflowY: 'scroll'
    },

    pointerClose: {
        display: 'flex',
        cursor: 'pointer'
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        width: "50%",
        textAlign:'center',
        background: customColors.gradient.main
    },
    share:{
        color:'#212121',
        fontSize: '24px',
        marginTop: '10px',
        fontFamily: 'Droid Sans,-apple-system,Helvetica Neue,sans-serif',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: '1px',
        marginBottom: '15px',
    }
}))

// const Facebook = () => {
//     const label = "Via facebook"
//     const { modalStateContext } = useContext(ModalContext)
//     const shareUrl = `https://kargain.com/announce/${modalStateContext.modalShareAnnounce.getSlug}`
//     const title = modalStateContext.modalShareAnnounce.getAnnounceTitle
//
//     return(
//         <div className="d-flex">
//             <FacebookShareButton
//                 url={shareUrl}
//                 quote={`Kargain.com | ${title}`}
//             >
//                 <a className="social-link-modal" href="#">
//                     {label} <FacebookIcon/>
//                 </a>
//             </FacebookShareButton>
//         </div>
//     )
// }

// const Messenger = () => {
//     const label = "Via Facebook Messenger"
//     const { modalStateContext } = useContext(ModalContext)
//     const shareUrl = modalStateContext.modalShareAnnounce.getAnnounceShareLink
//     const title = modalStateContext.modalShareAnnounce.getAnnounceTitle
//
//     return(
//         <div className="d-flex">
//             <FacebookMessengerShareButton
//                 url={shareUrl}
//                 quote={`Kargain.com | ${title}`}
//             >
//                 <a className="social-link-modal" href="#">
//                     {label} <FacebookIcon/>
//                 </a>
//             </FacebookMessengerShareButton>
//         </div>
//     )
// }

const Email = () => {
    const label = 'Via email'
    const { t } = useTranslation()
    const [openForm, setOpenForm] = useState(false)
    const { modalStateContext } = useContext(ModalContext)
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { control, errors, handleSubmit } = useForm()
    const { isAuthenticated } = useAuth()
    const [clipBoarCopied, setClipBoardCopied] = useState(false)
    
    const onSubmit = (form) => {
        console.log(modalStateContext.modalShareAnnounce.getAnnounceShareLink);
        copy(modalStateContext.modalShareAnnounce.getAnnounceShareLink);
        // copy(modalStateContext.modalShareAnnounce.getAnnounceShareLink, {
        //     onCopy : () => setClipBoardCopied(true)
        // })
        if(isAuthenticated) {
            AnnounceService.mailtoAnnounceLink(modalStateContext.modalShareAnnounce.getSlug, form.email)
            .then(() => {
                dispatchModal({
                    msg: t('layout:email_had_been_sent_to_{email}', {email : form.email})
                })
            }).catch(err => {
                dispatchModalError({ err })
            })
        } else {
            AnnounceService.mailtoAnnounceLinkWithoutAuth(modalStateContext.modalShareAnnounce.getSlug, form.email)
            .then(() => {
                dispatchModal({
                    msg: t('layout:email_had_been_sent_to_{email}', {email : form.email})
                })
            }).catch(err => {
                dispatchModalError({ err })
            })
        }
    }
    
    return(
        <div className="d-flex">
            <div style={{ flex : 1 }}>
                <a className="social-link-modal" href="#" onClick={() => setOpenForm(open => !open)}>
                    {label}
                </a>
            </div>
            
            {openForm && (
                <div style={{ flex : 3 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <EmailInput
                            name="email"
                            placeholder="email"
                            errors={errors}
                            control={control}
                            rules={{ required: t('form_validations:field-is-required') }}
                        />
                        <button type="submit">Envoyer</button>
                    </form>
                </div>
            )}
        </div>
    )
}

const Clipboard = () => {
    const { t } = useTranslation()
    const { modalStateContext } = useContext(ModalContext)
    const [clipBoarCopied, setClipBoardCopied] = useState(false)
    const label = !clipBoarCopied ? t('layout:copy_link') : t('layout:copy_link_copied')
    
    const handleClick = () => {
        copy(modalStateContext.modalShareAnnounce.getAnnounceShareLink)
        setClipBoardCopied(true)
    }
    
    return(
        <div >
            <a className="social-link-modal" style={{color: 'white'}} href="#" onClick={handleClick}>
                {label}
            </a>
        </div>
    )
}

export default function ModalShare () {
    const classes = useStyles()
    const router = useRouter();
    const { isAuthenticated } = useAuth()
    const { modalStateContext, dispatchModalState } = useContext(ModalContext)
    
    const handleClose = () => {
        dispatchModalState({
            openModalShare : false
        })
    }
    
    useEffect(()=> {
        // if(!isAuthenticated){
        //     // setForceLoginModal(true)
        //     router.push({
        //     pathname: '/auth/login',
        //     query: { redirect: router.asPath },
        //     });
        //     dispatchModalState({
        //         openModalShare : false
        //     })
        // }
    },[modalStateContext.openModalShare, isAuthenticated])
    
    // if(!isAuthenticated) return null
    
    return (
        <Modal
            className={classes.modal}
            open={modalStateContext.openModalShare}
            onClose={handleClose}>
            <Fade in={modalStateContext.openModalShare}>
                <div className={classes.paper}>
                    <div style={{ display:'flex', justifyContent: 'flex-end'}}>
                        <NewIcons.close_color onClick={handleClose}/>                     
                        <NewIcons.inclose_color style={{transform: 'translate(-15.7px, 8.3px)'}} />
                    </div>
                    <div className={clsx(classes.share)}>
                        Partager
                    </div>
                    
                    <div style={{display:'flex', justifyContent: 'center'}}>
                        <div className={clsx(classes.button)}>
                            {/*<Facebook/>*/}
                            {/*<Messenger/>*/}
                            {/* <Email/> */}
                            <Clipboard/>
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
