import AnnounceService from "../../services/AnnounceService"
import React, { useContext, useEffect, useState } from "react"
import * as i from "@material-ui/icons"
import { Action } from "../AnnounceCard/components"
import { MessageContext } from "../../context/MessageContext"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import { useAuth } from "../../context/AuthProvider"


const ClickLikeButton = (props) => {
    const [isLiking, setIsLiking] = useState(false)
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const [like, setLike] = useState(alreadyLikeCurrentUser)
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const [likesCounter, setLikesCounter] = useState(props?.announce?.getCountLikes)
    const { t } = useTranslation()

    const checkIfAlreadyLike = () => {
        const matchUserFavorite = props.authenticatedUser.getFavorites.find((favorite) => favorite.getID === props?.announce?.getID)
        const matchAnnounceLike = props?.announce?.getLikes.find((like) => like.getAuthor.getID === props.authenticatedUser.getID)
        return !!matchUserFavorite || !!matchAnnounceLike
    }
    const alreadyLikeCurrentUser = checkIfAlreadyLike()
    const isOwn = props.authenticatedUser?.raw?._id === props?.announce?.raw?.user?._id

    useEffect(() => {
        setLike(alreadyLikeCurrentUser)
        setLikesCounter(props?.announce?.getCountLikes)
    }, [props?.announce])


    const handleClickLikeButton = async () => {
        if(isOwn) return
        if (!isAuthenticated) {
            await router.push({
                pathname: '/auth/login',
                query: { redirect: router.asPath }
            })
            return
        }
        if(isLiking) return
        setIsLiking(true)
        try {
            if (like) {
                setLike(false)
                setLikesCounter((likesCounter) => likesCounter - 1)
                await AnnounceService.removeLikeLoggedInUser(props?.announce?.getID)
            } else {
                setLike(true)
                setLikesCounter((likesCounter) => likesCounter + 1)
                await AnnounceService.addLikeLoggedInUser(props?.announce?.getID)
            }
            setIsLiking(false)
        } catch (err) {
            dispatchModalError({ err })
        }
    }

    return (
        <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
            <i.BookmarkBorder
                style={{
                    color: like ? '#444444' : '#444444',
                    marginRight: '8px'
                }}
            />
            <span style={{ color:'#444444' }}>{likesCounter}</span>
        </Action>
    )
}

export default ClickLikeButton
