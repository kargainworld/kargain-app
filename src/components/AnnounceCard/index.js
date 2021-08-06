import React, { useContext, useState, useRef, useEffect } from 'react'
import * as i from '@material-ui/icons'
import PropTypes from 'prop-types'
import Link from 'next-translate/Link'
import useDimensions from 'react-use-dimensions'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { MessageContext } from '../../context/MessageContext'
import AnnounceService from '../../services/AnnounceService'
import { useAuth } from '../../context/AuthProvider'
import TagsList from '../Tags/TagsList'
import CTALink from '../CTALink'
import { ModalContext } from '../../context/ModalContext'
import AnnounceModel from '../../models/announce.model'
import { getTimeAgo } from '../../libs/utils'
import { makeStyles } from '@material-ui/core/styles'
import { themeColors } from '../../theme/palette'
import { Root, User, Avatar, Info, AuthorName, Location, Meta, CreationDate, ShareIcon, SubHeader, Action, Price, Body,
    ImageWrapper, Title, CommentListStyled, Footer, ImageCounter, ImagePlaceholder } from './components'
import Button from '@material-ui/core/Button'
import { CardContent } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import GalleryViewer from '../Gallery/GalleryViewer'
import { useSocket } from '../../context/SocketContext'
import usePriceTracker from 'hooks/usePriceTracker'

const useStyles = makeStyles(() => ({
    buttonRemove: {
        backgroundColor : themeColors.red,

        "&:hover" : {
            backgroundColor : themeColors.red
        }
    }
}))

const Index = ({ announceRaw, featuredImgHeight, tokenPrice, onhandleOpenDialogRemove, onSelectSlug }) => {
    const classes = useStyles()
    const refImg = useRef()
    const router = useRouter()
    const { getPriceTracker } = usePriceTracker()
    const [priceBNB, setPrice] = useState(0)
    const { t, lang } = useTranslation()
    const announce = new AnnounceModel(announceRaw)
    const [refWidth, { width }] = useDimensions()
    const { dispatchModalError } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const [likesCounter, setLikesCounter] = useState(announce.getCountLikes)
    const { isAuthenticated, authenticatedUser, setForceLoginModal } = useAuth()
    const isAuthor = isAuthenticated && authenticatedUser.getID === announce.getAuthor?.getID
    const checkIfAlreadyLike = () => {
        const matchUserFavorite = authenticatedUser.getFavorites.find((favorite) => favorite.getID === announce.getID)
        const matchAnnounceLike = announce.getLikes.find((like) => like.getAuthor.getID === authenticatedUser.getID)
        return !!matchUserFavorite || !!matchAnnounceLike
    }

    const alreadyLikeCurrentUser = checkIfAlreadyLike()

    const [liked, setLiked] = useState(alreadyLikeCurrentUser)

    const { getOnlineStatusByUserId } = useSocket()

    const handleClickLikeButton = async () => {
        if(isOwn) return
        if (!isAuthenticated) return setForceLoginModal(true)
        try {
            if (!liked) {
                await AnnounceService.addLikeLoggedInUser(announce.getID)
                setLikesCounter((likesCount) => likesCount + 1)
                setLiked(true)
            } else {
                await AnnounceService.removeLikeLoggedInUser(announce.getID)
                setLikesCounter((likesCount) => Math.max(likesCount - 1))
                setLiked(false)
            }
        } catch (err) {
            dispatchModalError({ err })
        }
    }

    const isOwn = authenticatedUser?.raw?.id === announceRaw?.user?.id

    const toggleVisibility = () => {
        AnnounceService.updateAnnounce(announce.getSlug, { visible: !announceRaw.visible }).then(() =>
            window.location.reload()
        )
    }

    const handleImageClick = () => {
        router.push(announce.getAnnounceLink)
    }

    const [state, setState] = useState({
        err: null,
        stateReady: false
    })

    useEffect(() => {

        getPriceTracker().then((price) => {
            setPrice(price.quotes.EUR.price)
        })


    }, [state])

    return (
        <Root>

            <CardContent>
                <User>
                    <Avatar
                        src={announce.getAuthor.getAvatar || announce.getAuthor.getAvatarUrl}
                        size="medium"
                        isonline={getOnlineStatusByUserId(announce.getAuthor.getID)}
                        style={{ width: 52, height: 52, marginRight: 10 }}
                    />

                    <Info>
                        <AuthorName href={announce.getAuthor.getProfileLink}>{announce.getAuthor.getFullName}</AuthorName>

                        {announce.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                            <Location href={announce.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                                <i.RoomOutlined size={18} />
                                {announce.getAdOrAuthorCustomAddress(['city', 'country'])}
                            </Location>
                        )}
                    </Info>

                    <Meta>
                        <CreationDate>
                            <i.AccessTime />

                            {getTimeAgo(announce.getCreationDate.raw, lang)}
                        </CreationDate>

                        {/* <ShareIcon
                            onClick={() =>
                                dispatchModalState({
                                    openModalShare: true,
                                    modalShareAnnounce: announce
                                })
                            }
                            src="/images/share.png"
                            alt=""
                        /> */}
                    </Meta>
                </User>

                <SubHeader>
                    {isOwn && (
                        <Action onClick={toggleVisibility}>
                            {announce.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                        </Action>
                    )}

                    {!isAuthor && (
                        <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                            <i.BookmarkBorder
                                style={{
                                    color: alreadyLikeCurrentUser ? '#DB00FF' : '#444444'
                                }}
                            />
                            <span>{likesCounter}</span>
                        </Action>
                    )}

                    <Action
                        title={t('vehicles:comment_plural')}
                        style={{ color: announce.getCountComments > 0 ? '#29BC98' : '#444444' }}
                        onClick={() => handleImageClick()}
                    >
                        <i.ChatBubbleOutline style={{ width: 23, marginRight: 4 }} />
                        <span>{announce.getCountComments}</span>
                    </Action>

                    <Action
                        onClick={() => {
                            if (!isAuthenticated) {
                                router.push({
                                    pathname: '/auth/login',
                                    query: { redirect: router.asPath },
                                });
                                return
                            }
                            dispatchModalState({
                                openModalMessaging: true,
                                modalMessagingProfile: announce.getAuthor,
                                modalMessaginAnnounce: announce
                            })
                            }
                        }
                    >
                        <i.MailOutline style={{ position: 'relative', top: -1 }} />
                    </Action>

                    {tokenPrice && <Price>€ {(priceBNB * tokenPrice).toFixed(2)}</Price>}
                </SubHeader>

                <Body>
                    <ImageWrapper>
                        {announce.getImages.length > 0 && (
                            <GalleryViewer
                                images={announce.getImages}
                                ref={refImg}
                                handleClick={handleImageClick}
                                isAnnounceCard={true}
                            />
                        )}

                        {!announce.getFeaturedImg && (
                            <ImagePlaceholder>
                                <i.CameraAlt fontSize="large" />
                            </ImagePlaceholder>
                        )}

                        {announce.getFeaturedImg && (
                            <ImageCounter>
                                <i.CameraAlt />
                                {announce.getCountImages}
                            </ImageCounter>
                        )}
                    </ImageWrapper>

                    <Link href={announce.getAnnounceLink}>
                        <a>
                            <Title>{announce.getAnnounceTitle}</Title>
                        </a>
                    </Link>

                    {announce.getTags?.length > 0 && <TagsList tags={announce.getTags} />}

                    {announce.getCountComments > 0 && (
                        <CommentListStyled
                            comments={announce.getComments.reverse().slice(0, 1)}
                            moreLink={announce.getCountComments > 1 ? <Link href={announce.getAnnounceLink}>more</Link> : null}
                        />
                    )}
                </Body>
            </CardContent>

            <Footer>
                {(isAuthor && typeof onhandleOpenDialogRemove === "function" && typeof onSelectSlug === "function")? (
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.buttonRemove}
                        startIcon={<DeleteIcon/>}
                        onClick={e => {
                            onSelectSlug(announce.getSlug)
                            onhandleOpenDialogRemove()
                        }}>
                        {t('vehicles:remove-announce')}
                    </Button>) : (<CTALink title={t('vehicles:see-announce')} href={announce.getAnnounceLink} />)}
                {isAuthor && <CTALink title={t('vehicles:edit-announce')} href={announce.getAnnounceEditLink} />}
            </Footer>
        </Root>
    )
}

Index.propTypes = {
    announceRaw: PropTypes.any.isRequired,
    featuredImgHeight: PropTypes.number
}

Index.defaultProps = {
    featuredImgHeight: 500
}

export default Index
