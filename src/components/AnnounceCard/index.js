import React, { useContext, useState, useRef, useEffect } from 'react'
import * as i from '@material-ui/icons'
import PropTypes from 'prop-types'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { MessageContext } from 'context/MessageContext'
import AnnounceService from 'services/AnnounceService'
import { useAuth } from 'context/AuthProvider'
import { ModalContext } from 'context/ModalContext'
import AnnounceModel from 'models/announce.model'
import { useStyles } from './styles.js'

import {
    Root,
    User,
    Avatar,
    Info,
    AuthorName,
    Location,
    Meta,
    SubHeader,
    Action,
    Body,
    ImageWrapper,
    ImageCounter,
    ImagePlaceholder,
    ImageBox
} from './components'
import { CardContent } from '@material-ui/core'
import GalleryViewer from '../Gallery/GalleryViewer'
import { useSocket } from 'context/SocketContext'
import usePriceTracker from 'hooks/usePriceTracker'
import { NewIcons } from 'assets/icons'
import clsx from 'clsx'
import { Emoji } from 'react-apple-emojis'
import { Modal } from 'reactstrap'
import customColors from 'theme/palette'
import CTALink from '../CTALink'

const Index = ({ announceRaw, tokenPrice, onhandleOpenDialogRemove, onSelectSlug, ...props }) => {
    const [modalOpen, setModalOpen] = React.useState(false)
    const classes = useStyles(props)
    const refImg = useRef()
    const router = useRouter()
    const { getPriceTracker } = usePriceTracker()
    const [priceBNB, setPrice] = useState(0)
    const { t } = useTranslation()
    const announce = new AnnounceModel(announceRaw)
    const { dispatchModalError } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const [likesCounter, setLikesCounter] = useState(announce.getCountLikes)
    const { isAuthenticated, authenticatedUser } = useAuth()
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
        if (isOwn) return
        if (!isAuthenticated) {
            router.push({
                pathname: '/auth/login',
                query: { redirect: router.asPath }
            })
            return
        }
        try {
            if (!liked) {
                setLikesCounter((likesCount) => likesCount + 1)
                setLiked(true)
                await AnnounceService.addLikeLoggedInUser(announce.getID)
            } else {
                setLikesCounter((likesCount) => Math.max(likesCount - 1))
                setLiked(false)
                await AnnounceService.removeLikeLoggedInUser(announce.getID)
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
            setPrice(price?.quotes?.EUR.price)
        })
    }, [state])

    const str = announce.getAnnounceTitle
    const tempArr = str.split('|')
    const temp1 = tempArr[0] + '|' + tempArr[1]
    const temp2 = tempArr[2] + '|' + tempArr[3] + '|' + tempArr[4]

    const strmaile = announce.getMileage
    const strlength = strmaile.length
    let strkm = ''
    if (strlength / 3 < 0.4) {
        strkm = '0.00' + strmaile
    } else if (0.4 < strlength / 3 < 0.7) {
        strkm = '0.0' + strmaile
    } else if (strlength / 3 == 1) {
        strkm = '0.' + strmaile
    } else {
        var m = strlength % 3
        strkm = strmaile.slice(strlength - 3, strlength)
        strkm = strmaile.slice(0, m) + '.' + strkm
    }

    return (
        <div className={clsx(classes.row)}>
            <Root
                style={{
                    borderRadius: '25px',
                    border: '2px solid #D9D9DB',
                    boxSizing: 'border-box',
                    height: '511px'
                }}
            >
                <CardContent style={{ padding: '31px 28px 17px 28px', height: '100%' }}>
                    <Body>
                        <Meta className={clsx(classes.share)}>
                            <NewIcons.share
                                onClick={() =>
                                    dispatchModalState({
                                        openModalShare: true,
                                        modalShareAnnounce: announce
                                    })
                                }
                                alt="share"
                            />
                        </Meta>
                        <ImageBox>
                            <ImageWrapper className={clsx(classes.image)}>
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
                                <div className={classes.priceContainer}>
                                    <div className={classes.price}>€ {(priceBNB * tokenPrice).toFixed(2)}</div>
                                </div>
                            </ImageWrapper>
                        </ImageBox>
                        <User>
                            <Avatar
                                src={announce.getAuthor.getAvatar || announce.getAuthor.getAvatarUrl}
                                size="medium"
                                isonline={getOnlineStatusByUserId(announce.getAuthor.getID)}
                                style={{ width: 45, height: 45, marginRight: 7 }}
                            />

                            <Info>
                                <AuthorName href={announce.getAuthor.getProfileLink}>{announce.getAuthor.getFullName}</AuthorName>
                                {announce.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                                    <Location href={announce.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                                        <div style={{ marginLeft: '-1.5px' }}>
                                            <NewIcons.card_location />
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#99999', marginLeft: '3.49px' }}>
                                            {announce.getAdOrAuthorCustomAddress(['city', 'country'])}
                                        </div>
                                    </Location>
                                )}
                            </Info>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <SubHeader style={{ marginTop: '20px !important' }}>
                                    {isOwn && (
                                        <Action onClick={toggleVisibility}>
                                            {announce.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                                        </Action>
                                    )}

                                    {!isAuthor && (
                                        <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                                            <NewIcons.card_heart style={{ marginRight: '7px' }} />
                                            <span style={{ color: '#999999' }}>{likesCounter}</span>
                                        </Action>
                                    )}

                                    <Action
                                        title={t('vehicles:comment_plural')}
                                        style={{ color: announce.getCountComments > 0 ? '#999999' : '#999999' }}
                                        onClick={() => handleImageClick()}
                                    >
                                        <NewIcons.card_message style={{ marginLeft: '10px', marginRight: '7px' }} />
                                        <span>{announce.getCountComments}</span>
                                    </Action>
                                </SubHeader>
                            </div>
                        </User>
                        <div style={{ marginLeft: '8px' }}>
                            <a className={clsx(classes.a_coin)}>#1212</a>
                        </div>
                        <Link href={announce.getAnnounceLink}>
                            <div className={clsx(classes.a_info)}>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        color: 'black',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {temp1}
                                </div>
                                <div
                                    style={{
                                        fontWeight: 500,
                                        color: '#2C65F6',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {temp2}
                                </div>
                            </div>
                        </Link>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div
                                style={{
                                    fontsSize: '16px',
                                    color: customColors.text.primary,
                                    fontWeight: 500,
                                    lineHeight: '24px'
                                }}
                            >
                                {strkm} Km
                            </div>
                            <Emoji name="gear" className={clsx(classes.gear)} onClick={() => setModalOpen(!modalOpen)} />
                        </div>
                    </Body>
                </CardContent>
            </Root>
            <Modal
                toggle={() => setModalOpen(!modalOpen)}
                isOpen={modalOpen}
                className={clsx(classes.modalcontent)}
                style={{ borderRadius: '5px', marginTop: '15%', width: '400px' }}
            >
                <button
                    aria-label="Close"
                    className=" close"
                    type="button"
                    onClick={() => setModalOpen(!modalOpen)}
                    style={{ display: 'flex', justifyContent: 'flex-end', margin: '15px 15px' }}
                >
                    <NewIcons.close_color />
                    <NewIcons.inclose_color style={{ transform: 'translate(-14.4px, 7.3px)' }} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <div
                        className={clsx(classes.button)}
                        onClick={(e) => {
                            onSelectSlug(announce.getSlug)
                            onhandleOpenDialogRemove()
                        }}
                    >
                        {t('vehicles:remove-announce')}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '50px' }}>
                    <CTALink
                        className={clsx(classes.button)}
                        title={t('vehicles:edit-announce')}
                        href={announce.getAnnounceEditLink}
                    />
                </div>
            </Modal>
        </div>
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
