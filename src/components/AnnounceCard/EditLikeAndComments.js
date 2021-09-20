import clsx from "clsx"
import { Action } from "./components"
import * as i from "@material-ui/icons"
import ClickLikeButton from "../Likes/ClickLikeButton"
import { NewIcons } from "../../assets/icons"
import CTALink from "../CTALink"
import React, { useContext, useState } from "react"
import AnnounceService from "../../services/AnnounceService"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useAuth } from "../../context/AuthProvider"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import { ModalContext } from "../../context/ModalContext"

const useStyles = makeStyles(() => ({
    priceStarsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: '15px 0',
        borderBottom: '1px solid #999999'
    }
}))

const EditLikeAndComments = (props) => {
    const classes = useStyles()
    const router = useRouter()
    const [hiddenForm, hideForm] = useState(true)
    const { dispatchModalState } = useContext(ModalContext)
    const { t } = useTranslation()
    const { isAuthenticated, authenticatedUser } = useAuth()
    const isOwn = authenticatedUser?.raw?._id === props?.announce?.raw?.user?._id
    const toggleVisibility = () => {
        AnnounceService.updateAnnounce(props?.announce?.getSlug, { visible: !props?.announce?.raw?.visible }).then(() =>
            window.location.reload()
        )
    }
    const toggleFilters = () => {
        hideForm((hiddenForm) => !hiddenForm)
    }

    return (
        <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)} style={{ marginTop:'-15px' }}>
            <div className="icons-profile-wrapper" style={{ width:'90%' }}>

                {isOwn && (
                    <Action onClick={toggleVisibility}>
                        {props?.announce?.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                    </Action>
                )}
                <ClickLikeButton authenticatedUser={authenticatedUser} announce={props.announce}  />

                <Action
                    title={t('vehicles:comment_plural')}
                    style={{ color: props?.announce?.getCountComments > 0 ? '#FE74F1' : '#444444', marginLeft:'10px' }}
                >
                    <NewIcons.card_message_pink style={{ width: 23, marginRight: '8px' }} />
                    <span>{props?.announce?.getCountComments}</span>
                </Action>

                <Action
                    onClick={() => {
                        if (!isAuthenticated) {
                            router.push({
                                pathname: '/auth/login',
                                query: { redirect: router.asPath }
                            })
                            return
                        }
                        dispatchModalState({
                            openModalMessaging: true,
                            modalMessagingProfile: props?.announce?.getAuthor,
                            modalMessaginAnnounce: props?.announce
                        })
                    }
                    }
                    style={{ color: props?.announce?.getCountComments > 0 ? '#444444' : '#444444', marginLeft:'10px' }}
                >
                    <i.MailOutline style={{ position: 'relative', top: -1  }} />
                </Action>


                {(props.isAdmin || props.isSelf) && (
                    <div style={{ display: "flex", gap: 5 }}>
                        <CTALink href={props?.announce?.getAnnounceEditLink} title={t('vehicles:edit-announce')} />
                    </div>
                )}
            </div>

            <div onClick={() => toggleFilters()} style={{ width:'10%', display:'flex', justifyContent:'flex-end', marginTop:'20px' }}>
                <i className={clsx('ml-2', 'arrow_nav', hiddenForm ? 'is-left' : 'is-bottom')}/>
            </div>
        </div>
    )
}

export default EditLikeAndComments
