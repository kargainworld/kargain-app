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

import { ButtonToggle, Row } from 'reactstrap'
import { NewIcons } from '../../assets/icons'
import clsx from 'clsx'
import { Emoji } from 'react-apple-emojis'

const useStyles = makeStyles(() => ({
    buttonRemove: {
        backgroundColor : themeColors.red,

        "&:hover" : {
            backgroundColor : themeColors.red
        }
    },

    image:{
       
        '& .image-gallery-image':{
            width:'100% !important',
            height: '240px !important',
            objectFit: 'fill !important',
        }
    },

    a_coin:{
       
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12.2272px',
        lineHeight: '150%',
        color: '#999999',
    },
    a_info:{
        marginTop: '5px',
        fontWeight: 'bold',
        fontSize: '17.4674px !important',
        fontWeight: '500',
        color: '#2C65F6',
    },
    filterbutton:{
        borderRadius: '100rem',
        padding: '1rem',
        fontFamily: 'Avenir Next',
        fontSize: '14px',
        fontWeight: '700',
        padding: '.1rem 1rem',
        color: '$color-black',
        boxShadow: '0 0 6px 0 #f0eeee',
        border: 'solid 2px transparent',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(179deg, #2C65F6, #ED80EB)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '2px 1000px 1px #f0eeee inset',
        baclgroundColor: '#F0EEEE !important',
        transform: 'translate(-50%, -50%)',
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
                query: { redirect: router.asPath },
            });
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

    var str = announce.getAnnounceTitle;
    const tempArr = str.split("|");
    var temp1 = tempArr[0]+'|'+tempArr[1]
    var temp2 = tempArr[2]+'|'+tempArr[3]+'|'+tempArr[4]

    var strmaile = announce.getMileage;
    var strlength = strmaile.length;
    var strkm = '';
    if(strlength/3 < 0.4){
        strkm = '0.00'+strmaile;
    }else if(0.4 < strlength/3 < 0.7){
        strkm = '0.0'+strmaile;
    }else if(strlength/3 == 1){
        strkm = '0.'+ strmaile;
    }else{
        var m = strlength % 3;
        strkm = strmaile.slice(strlength-3, strlength);
        strkm = strmaile.slice(0, m) + '.' +strkm;
    }
    
    return (
        <Row>
            <Root  style={{borderRadius:'25px', border: '2px solid #D9D9DB', boxSizing: 'border-box', width: '98%'}}>
            
                <CardContent>
                    <Body>
                        <Meta style={{marginTop: '7px', marginRight: '2px', marginBottom: '-15px'}}>
                            {/* <CreationDate>
                                <i.AccessTime />
                                {getTimeAgo(announce.getCreationDate.raw, lang)}
                            </CreationDate> */}

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
                            <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '-50px'}}> 
                                <div className={'btn btn-primary', classes.filterbutton}>
                                    € {announce.getPrice}
                                </div>
                            </div>
                        </ImageWrapper>
                        
                        

                        <User style={{marginTop:'-5%'}}>
                            <Avatar
                                src={announce.getAuthor.getAvatar || announce.getAuthor.getAvatarUrl}
                                size="medium"
                                isonline={getOnlineStatusByUserId(announce.getAuthor.getID)}
                                style={{ width: 45, height: 45, marginRight: 10 }}
                            />

                            <Info>
                                <AuthorName href={announce.getAuthor.getProfileLink} style={{fontsSize:'13.9739px !important', fontWeight:'normal', color:'black', marginLeft:'2px'}}>{announce.getAuthor.getFullName}</AuthorName>

                                {announce.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                                    <Location href={announce.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer" style={{fontSize:'13.9739px', fontWeight:'normal', color:'#999999', marginLeft: '2px'}}>
                                        {/* <i.RoomOutlined size={5.24} /> */}
                                        <NewIcons.card_location/>
                                        {announce.getAdOrAuthorCustomAddress(['city', 'country'])}
                                    </Location>
                                )}
                            </Info>

                            <div style={{marginLeft: '100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                                <SubHeader style={{marginTop:'21px !important'}}>
                                    {isOwn && (
                                        <Action onClick={toggleVisibility}>
                                            {announce.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                                        </Action>
                                    )}

                                    {!isAuthor && (
                                        <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                                            {/* <i.BookmarkBorder
                                                style={{
                                                    color: liked ? '#DB00FF' : '#444444'
                                                }}
                                            /> */}
                                            <NewIcons.card_heart />
                                            <span>{likesCounter}</span>
                                        </Action>
                                    )}

                                    <Action
                                        title={t('vehicles:comment_plural')}
                                        style={{ color: announce.getCountComments > 0 ? '#29BC98' : '#444444' }}
                                        onClick={() => handleImageClick()}
                                    >
                                        {/* <i.ChatBubbleOutline style={{ width: 23, marginRight: 4 }} /> */}
                                        <NewIcons.card_message />
                                        <span>{announce.getCountComments}</span>
                                    </Action>

                                    {/* <Action
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
                                    </Action> */}

                                    {tokenPrice && <Price>€ {(priceBNB * tokenPrice).toFixed(2)}</Price>}
                                </SubHeader>

                            </div>
                            
                        </User>
                        <div style={{marginLeft:'5px', marginTop:'15px'}}>
                            <a className={clsx(classes.a_coin)}>#1212</a>
                        </div>
                        <Link href={announce.getAnnounceLink}>
                            <a > 
                                <h3 className={clsx(classes.a_info)}>
                                    <p style={{color:'black'}}> {temp1} </p>
                                    <p> {temp2}  </p>
                                </h3>
                            </a>
                        </Link>
                        
                        
                        {/* {announce.getTags?.length > 0 && <TagsList tags={announce.getTags} />} */}
                        
                        {/* {announce.getCountComments > 0 && (
                            <CommentListStyled
                                // comments={announce.getComments.reverse().slice(0, 1)}
                                // moreLink={announce.getCountComments > 1 ? <Link href={announce.getAnnounceLink}>more</Link> : null}
                            />
                        )} */}
                        <div style={{marginLeft:'5px ', marginBottom:'-15px '}}>
                            <h6 style={{fontsSize:'16px ', textAlign:'left'}}> 
                                {/* {announce.getMileage} */}
                                {strkm} Km 
                                     
                            </h6>
                            <Emoji name="gear" width="18" style={{marginTop:'-55px', marginLeft:"90%"}} />
                        </div>
                    </Body>
 
                </CardContent>

                {/* <Footer> */}
                    
                    {/* {(isAuthor && typeof onhandleOpenDialogRemove === "function" && typeof onSelectSlug === "function")? (
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
                    {isAuthor && <CTALink title={t('vehicles:edit-announce')} href={announce.getAnnounceEditLink} />} */}
                {/* </Footer> */}
            </Root>
        </Row>
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
