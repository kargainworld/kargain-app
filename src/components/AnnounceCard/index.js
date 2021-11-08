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
import { makeStyles } from '@material-ui/core/styles'

import { Root, User, Avatar, Info, AuthorName, Location, Meta, SubHeader, Action,  Body,
    ImageWrapper, ImageCounter, ImagePlaceholder } from './components'
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

const useStyles = makeStyles(() => ({
    image:{
        '& .image-gallery-image':{
            width:'100% !important',
            height: '240px !important',
            objectFit: 'fill !important'
        }
    },
    a_coin:{
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12.2272px',
        lineHeight: '150%',
        color: '#999999'
    },
    a_info:{
        marginTop: '5px',
        fontSize: '17.4674px !important',
        fontWeight: '500',
        color: '#2C65F6'
    },
    avatar:{
        '& svg':{
            marginLeft:'1px !important'
        }
    },
    row:{
        display: 'flex, -webkitFlex-wrap: wrap',
        flexWrap: 'wrap',
        marginRight: '-15px'
    },
    share:{
        '&:hover':{
            backgroundColor:'#ececec !important'
        }
    },
    price: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '150%',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center'
    },
    priceContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6px 16px',
        position: 'absolute',
        left: '66%',
        right: '4%',
        bottom: '-8%',
        background: '#F0EEEE',
        borderRadius: '25px'
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white !important',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        width: "157px",
        hegiht: "33px",
        textAlign:'center',
        background: customColors.gradient.main
    },
    modalcontent:{
        '& .modal-content':{
            borderRadius: '5px'
        }
    },
    gear:{
        marginTop:'-55px',
        marginLeft:"95%",
        '&:hover':{
            width:'20px'
        }
    }
}))

const Index = ({ announceRaw, tokenPrice, onhandleOpenDialogRemove, onSelectSlug }) => {

    const [modalOpen, setModalOpen] = React.useState(false)
    const classes = useStyles()
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
        if(isOwn) return
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
            setPrice(price.quotes.EUR.price)
        })
    }, [state])

    const str = announce.getAnnounceTitle
    const tempArr = str.split("|")
    const temp1 = tempArr[0] + '|' + tempArr[1]
    const temp2 = tempArr[2] + '|' + tempArr[3] + '|' + tempArr[4]

    const strmaile = announce.getMileage
    const strlength = strmaile.length
    let strkm = ''
    if(strlength/3 < 0.4) {
        strkm = '0.00' + strmaile
    }else if(0.4 < strlength/3 < 0.7){
        strkm = '0.0'+strmaile
    }else if(strlength/3 == 1){
        strkm = '0.'+ strmaile
    }else{
        var m = strlength % 3
        strkm = strmaile.slice(strlength-3, strlength)
        strkm = strmaile.slice(0, m) + '.' +strkm
    }

    return (
        <div className={clsx(classes.row)}>
            <Root  style={{ borderRadius:'25px', border: '2px solid #D9D9DB', boxSizing: 'border-box', height:'520px' }}>

                <CardContent>
                    <Body>
                        <Meta className={clsx(classes.share)} style={{ marginTop: '-5px', marginRight: '2px', marginBottom: '-27px', width:'25px', height:'25px', backgroundColor: '#ffffff', borderRadius: '50%' }}>
                            <NewIcons.share
                                onClick={() =>
                                    dispatchModalState({
                                        openModalShare: true,
                                        modalShareAnnounce: announce
                                    })
                                }
                                alt="share"
                                style={{ marginTop: '11px',
                                    marginRight: '3px' }}
                            />
                        </Meta>

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
                                <div className={classes.price}>
                                    € {(priceBNB * tokenPrice).toFixed(2)}
                                </div>
                            </div>
                        </ImageWrapper>

                        <User>
                            <Avatar
                                src={announce.getAuthor.getAvatar || announce.getAuthor.getAvatarUrl}
                                size="medium"
                                isonline={getOnlineStatusByUserId(announce.getAuthor.getID)}
                                style={{ width: 45, height: 45, marginRight: 10 }}
                            />

                            <Info style={{ width:'55%', marginTop:'-5px' }}>
                                <AuthorName href={announce.getAuthor.getProfileLink} style={{ fontsSize:'13.9739px !important', fontWeight:'normal', color:'black', marginLeft:'6px' }}>{announce.getAuthor.getFullName}</AuthorName>
                                {announce.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                                    <Location href={announce.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer" className={clsx(classes.avatar)} style={{ fontSize:'13.9739px', fontWeight:'normal', color:'#999999', marginLeft: '2px' }}>
                                        <NewIcons.card_location/>
                                        {announce.getAdOrAuthorCustomAddress(['city', 'country'])}
                                    </Location>
                                )}
                            </Info>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <SubHeader style={{ marginTop:'20px !important' }}>
                                    {isOwn && (
                                        <Action onClick={toggleVisibility}>
                                            {announce.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                                        </Action>
                                    )}

                                    {!isAuthor && (
                                        <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                                            <NewIcons.card_heart style={{ marginRight:'7px' }}/>
                                            <span style={{ color:'#999999' }}>{likesCounter}</span>
                                        </Action>
                                    )}

                                    <Action
                                        title={t('vehicles:comment_plural')}
                                        style={{ color: announce.getCountComments > 0 ? '#999999' : '#999999' }}
                                        onClick={() => handleImageClick()}
                                    >
                                        <NewIcons.card_message style={{ marginLeft:'10px', marginRight:'7px' }}/>
                                        <span>{announce.getCountComments}</span>
                                    </Action>
                                </SubHeader>
                            </div>
                        </User>
                        <div style={{ marginLeft:'5px', marginTop:'15px' }}>
                            <a className={clsx(classes.a_coin)}>#1212</a>
                        </div>
                        <Link href={announce.getAnnounceLink}>
                            <a>
                                <h3 className={clsx(classes.a_info)}>
                                    <p style={{ color:'black' }}> {temp1} </p>
                                    <p> {temp2}  </p>
                                </h3>
                            </a>
                        </Link>

                        <div style={{ marginLeft:'5px ', marginBottom:'-15px ' }}>
                            <h6 style={{ fontsSize:'16px ', textAlign:'left' }}>
                                {strkm} Km
                            </h6>
                            <Emoji  name="gear" width="18" className={clsx(classes.gear)} onClick={() => setModalOpen(!modalOpen)} />
                            <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} className={clsx(classes.modalcontent)} style={{ borderRadius:'5px', marginTop:'15%', width:'400px' }}>
                                <button
                                    aria-label="Close"
                                    className=" close"
                                    type="button"
                                    onClick={() => setModalOpen(!modalOpen)}
                                    style={{ display: 'flex',
                                        justifyContent: 'flex-end',
                                        margin: '15px 15px' }}
                                >
                                    <NewIcons.close_color />
                                    <NewIcons.inclose_color style={{ transform: 'translate(-14.4px, 7.3px)' }} />
                                </button>

                                <div style={{ display:'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <div
                                        className={clsx(classes.button)}
                                        onClick={e => {
                                            onSelectSlug(announce.getSlug)
                                            onhandleOpenDialogRemove()
                                        }}>
                                        {t('vehicles:remove-announce')}
                                    </div>
                                </div>
                                <div style={{ display:'flex', justifyContent: 'center', marginTop: '10px', marginBottom:'50px' }}>
                                    <CTALink className={clsx(classes.button)} title={t('vehicles:edit-announce')} href={announce.getAnnounceEditLink} />
                                </div>
                            </Modal>
                        </div>
                    </Body>

                </CardContent>
            </Root>
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
