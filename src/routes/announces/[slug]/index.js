import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { NextSeo } from 'next-seo'
import Link from 'next-translate/Link'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'reactstrap'
import Alert from '@material-ui/lab/Alert'
import { useWeb3React } from "@web3-react/core"
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTranslation from 'next-translate/useTranslation'
import GalleryViewer from '../../../components/Gallery/GalleryViewer'
import DamageViewerTabs from '../../../components/Damages/DamageViewerTabs'
import CarInfos from '../../../components/Products/car/CarInfos'
import Comments from '../../../components/Comments/Comments'
import TagsList from '../../../components/Tags/TagsList'
import CTALink from '../../../components/CTALink'
import { Action } from '../../../components/AnnounceCard/components'
import AnnounceService from '../../../services/AnnounceService'
import AnnounceModel from '../../../models/announce.model'
import { MessageContext } from '../../../context/MessageContext'
import { ModalContext } from '../../../context/ModalContext'
import { useAuth } from '../../../context/AuthProvider'
import { getTimeAgo } from '../../../libs/utils'
import Error from '../../_error'
import { Avatar } from '../../../components/AnnounceCard/components'
import { useSocket } from '../../../context/SocketContext'
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined'
import * as i from '@material-ui/icons'
import useKargainContract from 'hooks/useKargainContract'
import TextField from '@material-ui/core/TextField'
import { injected } from "../../../connectors"
import usePriceTracker from 'hooks/usePriceTracker'
import Box from '@material-ui/core/Box'

import Web3 from "web3"

const web3 = new Web3(Web3.givenProvider)

const useStyles = makeStyles(() => ({
    formRow: {
        display: 'flex',

        '& > div': {
            margin: '1rem',
            flex: 1
        }
    },


    cardTopInfos: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '1rem 0'
    },

    priceStarsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: '15px 0',
        borderBottom: '1px solid'
    },
    wysiwyg: {
        margin: '1rem'
    }
}))

const Announce = () => {
    const { library, chainId, account, activate, active } = useWeb3React()
    const [bnbBalance, setBalance] = useState()
    const [bnbBalanceWei, setBalanceWei] = useState()
    const refImg = useRef()
    const classes = useStyles()
    const router = useRouter()
    const { slug } = router.query
    const { t, lang } = useTranslation()
    const { isAuthenticated, authenticatedUser, setForceLoginModal } = useAuth()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const { getOnlineStatusByUserId } = useSocket()
    const { getPriceTracker } = usePriceTracker()
    const [priceBNB, setPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [tokenPrice, setTokenPrice] = useState(null)
    const [error, setError] = useState(null)
    const [isConfirmed, setIsConfirmed] = useState(true)
    const [isMinted, setIsMinted] = useState(false)

    const { fetchTokenPrice, mintToken, updateTokenPrince, makeOffer, isContractReady } = useKargainContract()

    const [state, setState] = useState({
        err: null,
        stateReady: false,
        isSelf: false,
        isAdmin: false,
        announce: new AnnounceModel(),
        likesCounter: 0
    })

    const [tried, setTried] = useState(false)

    useEffect(() => {
        if (!isContractReady)
            return

        if (!!account && !!library) {
            let stale = false

            web3.eth
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        let ethBalance = web3.utils.fromWei(balance, 'ether');
                        setBalance(ethBalance)
                        setBalanceWei(balance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(null)
                    }
                })

            return () => {
                stale = true
                setBalance(undefined)
            }
        }
    }, [account, library, chainId, isContractReady]) //

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).then(() =>{
                    fetchTokenPrice(state.announce.getTokenId)
                        .then((price) => {
                            setTokenPrice(price)
                            setIsLoading(false)
                            setIsMinted(price ? true : false)
                        })
                        .catch(() => {
                            setIsLoading(false)
                        })
                }).catch(() => {
                    setTried(true)
                })
            } else {
                setTried(true)
            }
        })
    }, [])

    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }

    }, [tried, active])

    const [isLiking, setIsLiking] = useState(false)

    const { announce } = state

    const checkIfAlreadyLike = () => {
        const matchUserFavorite = authenticatedUser.getFavorites.find((favorite) => favorite.getID === announce.getID)
        const matchAnnounceLike = announce.getLikes.find((like) => like.getAuthor.getID === authenticatedUser.getID)
        return !!matchUserFavorite || !!matchAnnounceLike
    }

    const alreadyLikeCurrentUser = checkIfAlreadyLike()

    const [like, setLike] = useState(alreadyLikeCurrentUser)

    const isOwn = authenticatedUser?.raw?._id === announce?.raw?.user?._id

    const toggleVisibility = () => {
        AnnounceService.updateAnnounce(announce.getSlug, { visible: !announce?.raw?.visible }).then(() =>
            window.location.reload()
        )
    }

    const handleClickLikeButton = async () => {
        if(isOwn) return
        if (!isAuthenticated) return setForceLoginModal(true)
        let counter = state.likesCounter
        if(isLiking) return
        setIsLiking(true)
        try {
            if (like) {
                await AnnounceService.removeLikeLoggedInUser(announce.getID)
                setState((state) => ({
                    ...state,
                    likesCounter: Math.max(0, counter - 1)
                }))
            } else {
                await AnnounceService.addLikeLoggedInUser(announce.getID)
                setState((state) => ({
                    ...state,
                    likesCounter: counter + 1
                }))
            }
            setLike(!like)
            setIsLiking(false)
        } catch (err) {
            dispatchModalError({ err })
        }
    }
    
    const fetchAnnounce = useCallback(async () => {
        try {
            const result = await AnnounceService.getAnnounceBySlug(slug)
            const { announce, isAdmin, isSelf } = result

            setState((state) => ({
                ...state,
                stateReady: true,
                announce: new AnnounceModel(announce),
                isAdmin,
                isSelf
            }))
        } catch (err) {
            setState((state) => ({
                ...state,
                stateReady: true,
                err
            }))
        }
    }, [slug])

    useEffect(() => {
        fetchAnnounce()
    }, [fetchAnnounce])

    useEffect(() => {
        if (!state.stateReady) return

        setIsLoading(true)

        const tokenId = state.announce.getTokenId
        getPriceTracker().then((price) => {
            setPrice(price.quotes.EUR.price)
        })

        fetchTokenPrice(tokenId)
            .then((price) => {
                setTokenPrice(price)
                setIsLoading(false)
                setIsMinted(price ? true : false)
            })
            .catch(() => {
                setIsLoading(false)
            })
    }, [state, fetchTokenPrice])

    if (!state.stateReady) return null
    if (state.err) return <Error statusCode={state.err?.statusCode} />

    return (
        <Container>
            <NextSeo title={`${announce.getTitle} - Kargain`} description={announce.getTheExcerpt()} />

            {state.isAdmin && (
                <Alert severity="info" className="mb-2">
                    Connected as Admin
                </Alert>
            )}

            <div className="objava-wrapper">
                {!announce.getIsActivated && (
                    <Alert severity="warning">{`Your announce is hidden from public & waiting for moderator activation`}</Alert>
                )}

                {!announce.getIsVisible && <Alert color="warning">Your announce is currently not published (draft mode)</Alert>}

                <Row>
                    <Col sm={12} md={6}>
                        <div className="top">
                            <Typography as="h2" variant="h2">
                                {announce.getAnnounceTitle}
                            </Typography>

                            <div  style={{ width: '100%' }}>
                                <Box mb={2} display="flex" flexDirection="row">
                                    {isAuthenticated && authenticatedUser.getIsPro ? (
                                        <>
                                            <span className="mx-1">
                                                <strong>{announce.getPriceHT}€ HT</strong>
                                            </span>
                                            <span> - </span>
                                            <span className="mx-1">
                                                <small>{announce.getPrice}€</small>
                                            </span>
                                        </>
                                    ) : (
                                        <Col sm={4}>
                                            <h4 variant="h2">€ {(tokenPrice * priceBNB).toFixed(2)}</h4>
                                        </Col>
                                    )}
                                    {!isOwn && (
                                        <Col sm={5}>
                                            <button disabled={bnbBalance < tokenPrice} onClick={async () => {
                                                const tokenId = state.announce.getTokenId
                                                setIsConfirmed(false)
                                                setError(null)
                                                console.log(isContractReady)
                                                console.log(bnbBalanceWei)
                                                const weiValue = web3.utils.toWei(tokenPrice, 'ether');
                                                console.log(weiValue)
                                                
                                                const task = makeOffer(tokenId, weiValue)

                                    
                                            }}>
                                                <h4>{t('vehicles:makeOffer')}</h4>
                                            </button>
                                        </Col>
                                    )}
                                    <Col sm={3}
                                        className="icons-star-prof"
                                        onClick={() =>
                                            dispatchModalState({
                                                openModalShare: true,
                                                modalShareAnnounce: announce
                                            })
                                        }
                                    >
                                        <small className="mx-2"> {getTimeAgo(announce.getCreationDate.raw, lang)}</small>
                                        <img src="/images/share.png" alt="" />
                                    </Col>
                                </Box>


                            </div>
                        </div>

                        <div className="pics">
                            {announce.getCountImages > 0 && (
                                <>
                                    <GalleryViewer images={announce.getImages} ref={refImg} />
                                    {/* {isDesktop && (
                    <GalleryImgsLazy
                        images={announce.getImages}
                        handleCLickImg={handleCLickImg}
                    />
                  )} */}
                                </>
                            )}
                        </div>
                    </Col>

                    <Col sm={12} md={6}>
                        <div className={classes.formRow}>
                            <div className="pic" style={{ flex: 1 }}>
                                <Avatar
                                    className="img-profile-wrapper avatar-preview"
                                    src={announce.getAuthor.getAvatar || announce.getAuthor.getAvatarUrl}
                                    isonline={getOnlineStatusByUserId(announce.getAuthor.getID)}
                                    alt={announce.getTitle}
                                    style={{ width: 80, height: 80 }}
                                />
                            </div>

                            <div style={{ flex: 4 }}>
                                <Link href={`/profile/${announce.getAuthor.getUsername}`}>
                                    <a>
                                        <Typography variant="h3" component="h2" style={{ paddingLeft: 4 }}>
                                            {announce.getAuthor.getFullName}
                                        </Typography>
                                    </a>
                                </Link>

                                {announce.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                                    <div className="top-profile-location">
                                        <a href={announce.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                                            <span className="top-profile-location">
                                                <RoomOutlinedIcon />
                                                {announce.getAdOrAuthorCustomAddress()}
                                            </span>
                                        </a>
                                    </div>
                                )}
                                {announce.showCellPhone && <span style={{ paddingLeft: 6 }}> {announce.getAuthor.getPhone} </span>}
                            </div>
                        </div>

                        <TagsList tags={announce.getTags} />

                        <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)}>
                            <div className="icons-profile-wrapper">

                                {isOwn && (
                                    <Action onClick={toggleVisibility}>
                                        {announce.getIsVisible ? <i.VisibilityOutlined /> : <i.VisibilityOffOutlined />}
                                    </Action>
                                )}
                                <Action title={t('vehicles:i-like')} onClick={() => handleClickLikeButton()}>
                                    <i.BookmarkBorder
                                        style={{
                                            color: alreadyLikeCurrentUser ? '#DB00FF' : '#444444'
                                        }}
                                    />
                                    <span>{state.likesCounter}</span>
                                </Action>

                                <Action
                                    title={t('vehicles:comment_plural')}
                                    style={{ color: announce.getCountComments > 0 ? '#29BC98' : '#444444' }}
                                >
                                    <i.ChatBubbleOutline style={{ width: 23, marginRight: 4 }} />
                                    <span>{announce.getCountComments}</span>
                                </Action>

                                <Action
                                    onClick={() =>
                                        dispatchModalState({
                                            openModalMessaging: true,
                                            modalMessagingProfile: announce.getAuthor
                                        })
                                    }
                                >
                                    <i.MailOutline style={{ position: 'relative', top: -1 }} />
                                </Action>

                                {(state.isAdmin || state.isSelf) && (
                                    <div style={{ display: "flex", gap: 5 }}>
                                        <CTALink href={announce.getAnnounceEditLink} title={t('vehicles:edit-announce')} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {(state.isAdmin || state.isSelf) && (
                            <div className={clsx('price-stars-wrapper', classes.priceStarsWrapper)}>
                                <div className="icons-profile-wrapper">

                                    {!isLoading && (
                                        <div style={{ display: "flex", gap: 5 }}>
                                            <TextField
                                                label="Token price"
                                                onChange={(event) => setTokenPrice(event.target.value)}
                                                value={tokenPrice}
                                                type="number"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!error}
                                                helperText={error ? error.message : (!isConfirmed && "Waiting confirmation")}
                                                disabled={!isConfirmed || !active}
                                                variant="outlined"
                                            />
                                            <button disabled={!isConfirmed || !tokenPrice || !active} onClick={() => {
                                                const tokenId = state.announce.getTokenId

                                                setIsConfirmed(false)
                                                setError(null)

                                                const task = !isMinted ?
                                                    mintToken(tokenId, +tokenPrice) :
                                                    updateTokenPrince(tokenId, +tokenPrice)

                                                task.then(() => {
                                                    setIsConfirmed(true)
                                                    setIsMinted(true)
                                                    dispatchModal({ msg: 'Token price confirmed!' })
                                                }).catch((error) => {
                                                    console.error(error)
                                                    setError(error)
                                                    setIsConfirmed(true)
                                                })
                                            }}>
                                                {isMinted ? t('vehicles:save') : t('vehicles:mint')}
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                        <Comments announceRaw={announce.getRaw} />
                    </Col>
                </Row>

                <section className="my-2">
                    <Typography component="h3" variant="h3">
                        {t('vehicles:vehicle-data')}
                    </Typography>
                    <CarInfos announce={announce} enableThirdColumn />
                </section>

                <section className="my-2">
                    <Typography component="h3" variant="h3">
                        {t('vehicles:equipments')}
                    </Typography>
                    <Row>
                        {announce.getVehicleEquipments.map((equipment, index) => {
                            return (
                                <Col sm={6} md={3} key={index}>
                                    <div className="equipment m-3">
                                        <Typography>{equipment.label}</Typography>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </section>

                <section className="my-2">
                    <Typography component="h3" variant="h3">
                        {t('vehicles:description')}
                    </Typography>
                    <div className={classes.wysiwyg}>
                        <Typography>{announce.getDescription}</Typography>
                    </div>
                </section>

                <section className="my-2">
                    <Typography component="h3" variant="h3">
                        {t('vehicles:data-sheet')}
                    </Typography>
                    <DamageViewerTabs tabs={announce.getDamagesTabs} vehicleType={announce.getVehicleType} />
                </section>
            </div>
        </Container>
    )
}

export default Announce
