import React, { useCallback, useContext, useEffect, useState } from 'react'
import {  Container, Row } from 'reactstrap'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import ChatIcon from '@material-ui/icons/Chat'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { useAuth } from 'context/AuthProvider'
import { MessageContext } from 'context/MessageContext'
import { ModalContext } from 'context/ModalContext'
import UsersService from 'services/UsersService'
import AnnounceService from 'services/AnnounceService'
import UserModel from 'models/user.model'
import AvatarPreview from 'components/Avatar/AvatarPreview'
import AnnounceCard from 'components/AnnounceCard'
import Tabs from 'components/Tabs/Tabs'
import Loading from 'components/Loading'
import Error from '../../_error'
import { makeStyles } from "@material-ui/styles"
import clsx from "clsx"
import customColors from 'theme/palette'
import { NewIcons } from 'assets/icons'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useWeb3React } from "@web3-react/core"
import { injected } from "connectors"
import AnnounceModel from "../../../models/announce.model"
import TransactionsService from "../../../services/TransactionsService"

const useStyles = makeStyles((theme) => ({
    subscriptionWrapper: {
        display: 'flex'
    },
    userName: {
        color: theme.palette.primary.light
    },
    tabs: {
        '& > .nav': {
            display: 'flex',
            flexWrap: 'nowrap'
        }
    },
    followContainer: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        '& > div': {
            display: 'flex',
            alignItems: 'center'
        },

        '&:not(:last-child)': {
            marginRight: theme.spacing(3)
        }
    },
    followItem: {
        display: "block",
        lineHeight: 1
    },
    filters: {
        padding: '0 !important',
        '& .FieldWrapper': {
            marginRight: '0 !important',
            marginLeft: '0 !important'
        },
        '& #new_feed':{
            display: 'none !important'
        }
    },
    btnFollow: {
        padding: '3px 8px',
        fontSize: '12px',
        marginRight: '15px'
    },
    pagetopdiv: {
        position: 'absolute',
        width: '100%',
        height: '126px',
        left: '0px',
        top: '-25px',
        background: '#EAEAEA'
    },
    button: {
        border: "none !important",
        padding: '4.5px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        background: customColors.gradient.main
    },
    subscriptionbutton:{
        backgroundColor: 'white',
        color: '#666666',
        padding: '5.5px 10px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '17.5px',
        border: '1px solid #C4C4C4',
        borderWidth: '1px',
        height:'35px'
    },
    subscriptionbuttonblue:{
        backgroundColor: 'white',
        color: '#666666',
        padding: '4.5px 10px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '17.5px',
        border: '1px solid blue',
        borderWidth: '1px',
        height:'35px'
    }
}))

const Profile = () => {

    const isMobile = useMediaQuery('(max-width:768px)')
    const { activate } = useWeb3React()
    const classes = useStyles()
    const { t } = useTranslation()
    const router = useRouter()
    const { username } = router.query
    const { authenticatedUser, isAuthenticated } = useAuth()
    const { dispatchModalError } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const [followerCounter, setFollowersCounter] = useState(0)
    const [alreadyFollowProfile, setAlreadyFollowProfile] = useState(false)
    const [state, setState] = useState({
        err: null,
        stateReady: false,
        stateAnnounces: false,
        isSelf: false,
        isAdmin: false,
        profile: new UserModel(),
        announcesMinted: []
    })

    const [filterState, setFilterState] = useState({
        loading: false,
        sorter: {},
        filters: {},
        page: 1,
        total: 0
    })

    const profile = state.profile

    const handleFollowProfile = async () => {
        if (!isAuthenticated) {
            router.push({
                pathname: '/auth/login',
                query: { redirect: router.asPath }
            })
            return
        }
        try {
            if (alreadyFollowProfile) {
                await UsersService.unFollowUser(profile.getID)
                setFollowersCounter(followerCounter - 1)
                setAlreadyFollowProfile(false)
            } else {
                await UsersService.followUser(profile.getID)
                setFollowersCounter(followerCounter + 1)
                setAlreadyFollowProfile(true)
            }
        } catch (err) {
            dispatchModalError({ err, persist: true })
        }
    }

    const handleUnSubscription = async (userId) => {
        await UsersService.unFollowUser(userId)
        fetchProfile()
        dispatchModalState({
            modalFollowersProfiles: profile.getFollowings.filter(following => following.getID !== userId)
        })
        return true
    }

    const fetchProfile = useCallback(async () => {
        try {
            const result = await UsersService.getUserByUsername(username)
            const { user, isAdmin, isSelf } = result
            setState(state => ({
                ...state,
                stateReady: true,
                profile: new UserModel(user),
                isAdmin,
                isSelf
            }))
        } catch (err) {
            setState(state => ({
                ...state,
                stateReady: true,
                err
            }))
        }
    }, [username])

    const fetchAnnounces = useCallback(async () => {
        try {
            const { sorter, filters, page } = filterState
            setFilterState(filterState => ({
                ...filterState,
                loading: true
            }))

            const params = {
                page,
                sort_by: sorter.key,
                sort_ord: sorter.asc ? 'ASC' : null,
                ...filters,
                user: profile.getID
            }

            const result = await AnnounceService.getProfileAnnounces(params)

            setState(state => ({
                ...state,
                profile: new UserModel({
                    ...profile.getRaw,
                    garage: result.rows
                }),
                stateAnnounces: true
            }))

            setFilterState(filterState => ({
                ...filterState,
                loading: false
            }))

        } catch (err) {
            setFilterState(filterState => ({
                ...filterState,
                loading: false,
                err
            }))
        }
    }, [filterState.sorter, filterState.filters, filterState.page])

    const updateFilters = (filters) => {
        setFilterState(filterState => ({
            ...filterState,
            filters: filters
        }))
    }

    const fetchMintedAnnounces = useCallback(async () => {
        let tokensMinted = []
        if (!state.stateAnnounces)
            return

        try {
            for (const announce of state.profile.raw.garage) {
                const ad = new AnnounceModel(announce)
                let tokenMinted = false
                TransactionsService.getTransactionsByAnnounceId(ad.getID).then((data) => {
                    if (data[0] && ad.getID === data[0].announce && data[0].status === 'Approved' && data[0].action === 'TokenMinted') {
                        tokenMinted = true
                    }
                    if (data[0] && ad.getID === data[0].announce && data[0] && data[0].status === 'OfferAccepted') {
                        tokenMinted = false
                    }

                    if (tokenMinted) {
                        const token = {
                            tokenPrice: data[0].data,
                            id: announce.id
                        }
                        tokensMinted.push(token)
                    }
                })
            }
        } catch (err) {
            // console.log(err)
        }
        setState(state => ({
            ...state,
            announcesMinted: tokensMinted
        }))
        setFilterState(filterState => ({
            ...filterState,
            loading: false
        }))
    }, [ ])

    useEffect(() => {
        if (!state.stateAnnounces || filterState.loading)
            return

        setFilterState(filterState => ({
            ...filterState,
            loading: true
        }))

        fetchMintedAnnounces()
    }, [state.profile, fetchMintedAnnounces, state.stateAnnounces])

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).then(() =>{
                }).catch((err) => {
                    console.log("err", err)
                })
            }
        })
    }, [])

    useEffect(() => {
        setFollowersCounter(profile.getCountFollowers)
        setAlreadyFollowProfile(!!profile.getFollowers.find(follower =>
            follower.getID === authenticatedUser.getID))
    }, [authenticatedUser, profile])

    useEffect(() => {
        fetchProfile()
        window.scrollTo(0, 0)
    }, [fetchProfile])

    useEffect(() => {
        if (state.stateReady) {
            fetchAnnounces()
        }
    }, [fetchAnnounces])

    if (!state.stateReady) return null
    if (filterState.loading) return <Loading />
    if (state.err) return <Error statusCode={state.err?.statusCode} />
    return (
        <>
            {isMobile ? (
                <div className={clsx(classes.pagetopdiv)} style={{ marginTop: '25px' }}/>
            ) : (
                <div className={clsx(classes.pagetopdiv)}/>
            )}

            <Container style={{ marginTop: 25 }}>
                <NextSeo
                    title={`${profile.getFullName} - Kargain`}
                />
                {isMobile ? (
                    <div style={{ display: 'flex', justifyContent: 'center', color:'#666666', marginLeft:'20px' }}>
                        <div style={{ display:'flex' }}>
                            <AvatarPreview src={profile.getAvatar || profile.getAvatarUrl} />
                            <NewIcons.avatarcheck style={{ width:'24px', height:'24px', transform: 'translate(-40px, 150px)' }}/>
                        </div>
                    </div>
                ):(
                    <div style={{ display: 'flex', justifyContent: 'center', color:'#666666' }}>
                        <AvatarPreview src={profile.getAvatar || profile.getAvatarUrl} />
                        <NewIcons.avatarcheck style={{ transform: 'translate(-40px, 150px)' }}/>
                    </div>
                )}

                {isMobile ? (
                    <div>
                        <div style={{ textAlign:'center', marginTop:'25px', width:'100%' }} >
                            <h2 style={{ fontSize:'22px', fontWeight:'bold', lineHeight: '150%' }}>
                                {profile.getFullName}
                                {(profile.getIsPro && profile.getIsActivated)}
                            </h2>

                            <p className={classes.userName} style={{ fontSize:'14px', fontWeight:'normal', lineHeight:'150%', color:'black' }}>
                                <NewIcons.pigeon /> @ {profile.getUsername}
                            </p>

                            {profile.getAddressParts.fullAddress && (
                                <a href={profile.buildAddressGoogleMapLink()}
                                    target="_blank"
                                    rel="noreferrer">
                                    <p style={{ fontSize:'10px', fontWeight:'normal', lineHeight:'150%', color:'#999999' }}>
                                        {profile.buildAddressString()}
                                    </p>
                                </a>
                            )}
                        </div>

                        <div style={{ display:'flex', justifyContent:'center', width:'100%', marginTop:'5px' }}>
                            <div
                                onClick={() => dispatchModalState({
                                    openModalFollowers: true,
                                    modalFollowersProfiles: profile.getFollowers,
                                    modalFollowersTitle: t('vehicles:followers'),
                                    isFollowing: false
                                })}
                            >
                                <div>
                                    {state.isSelf ? (
                                        <span className={clsx("mx-1", classes.subscriptionbutton)}>
                                            {t('vehicles:followers', { count: followerCounter })}
                                        </span>
                                    ) : (
                                        <>
                                            <span onClick={(e) => { e.stopPropagation() }}>
                                                {
                                                    alreadyFollowProfile ?
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            className={clsx(classes.subscriptionbuttonblue)}
                                                            onClick={() => handleFollowProfile()}>
                                                            {t('vehicles:un-subscriptions')}
                                                        </Button>
                                                        :
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            className={clsx(classes.subscriptionbuttonblue)}
                                                            onClick={() => handleFollowProfile()}>
                                                            {t('vehicles:subscriptions')}
                                                        </Button>
                                                }
                                            </span>
                                            <span className={clsx(classes.subscriptionbutton)}>
                                                {followerCounter} {t('vehicles:followers', { count: followerCounter })}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={classes.subscriptionbutton}
                                onClick={() => dispatchModalState({
                                    openModalFollowers: true,
                                    modalFollowersProfiles: profile.getFollowings,
                                    modalFollowersTitle: t('vehicles:subscriptions'),
                                    isFollowing: true,
                                    isOwner: profile.getID === authenticatedUser.getID,
                                    handleUnSubscription: handleUnSubscription
                                })}>

                                <span>
                                    {profile.getCountFollowings} {t('vehicles:subscriptions', { count: profile.getCountFollowings })}
                                </span>

                            </div>
                        </div>

                        <div style={{ display:'flex', justifyContent:'center', marginTop:'30px', marginBottom:'20px', marginLeft:'5px', width:'100%' }}>
                            {state.isSelf ? (
                                <div className="mx-2">
                                    <Link href={profile.getProfileEditLink}>
                                        <Button component="a" variant="outlined" className={clsx(classes.button)}>
                                            {t('vehicles:edit-my-profile')}
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mx-2">
                                    <Button
                                        className={clsx(classes.button)}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<ChatIcon />}
                                        onClick={ () => {
                                            if(!isAuthenticated){
                                                router.push({
                                                    pathname: '/auth/login',
                                                    query: { redirect: router.asPath }
                                                })
                                            } else {
                                                dispatchModalState({
                                                    openModalMessaging: true,
                                                    modalMessagingProfile: profile
                                                })
                                            }
                                        }
                                        }>
                                        {t('vehicles:contact')}
                                    </Button>
                                </div>
                            )}
                        </div>

                    </div>

                ) : (
                    <div>
                        <div className="top-profile-name-btn">
                            <div style={{ display:'flex', justifyContent:'left', marginTop:'-40px', width:'33.33%' }}>
                                {state.isSelf ? (
                                    <div className="mx-2">
                                        <Link href={profile.getProfileEditLink}>
                                            <Button component="a" variant="outlined" className={clsx(classes.button)}>
                                                {t('vehicles:edit-my-profile')}
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="mx-2">
                                        <Button
                                            className={clsx(classes.button)}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<ChatIcon />}
                                            onClick={ () => {
                                                if(!isAuthenticated){
                                                    router.push({
                                                        pathname: '/auth/login',
                                                        query: { redirect: router.asPath }
                                                    })
                                                } else {
                                                    dispatchModalState({
                                                        openModalMessaging: true,
                                                        modalMessagingProfile: profile
                                                    })
                                                }
                                            }
                                            }>
                                            {t('vehicles:contact')}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign:'center', marginTop:'25px', width:'33.33%' }} >
                                <h2 style={{ fontSize:'36px', fontWeight:'bold', lineHeight: '150%' }}>
                                    {profile.getFullName}
                                    {(profile.getIsPro && profile.getIsActivated)}
                                </h2>

                                <p className={classes.userName} style={{ fontSize:'16px', fontWeight:'normal', lineHeight:'150%', color:'black' }}>
                                    <NewIcons.pigeon /> @ {profile.getUsername}
                                </p>

                                {profile.getAddressParts.fullAddress && (
                                    <a href={profile.buildAddressGoogleMapLink()}
                                        target="_blank"
                                        rel="noreferrer">
                                        <p style={{ fontSize:'12px', fontWeight:'normal', lineHeight:'150%', color:'#999999' }}>
                                            {profile.buildAddressString()}
                                        </p>
                                    </a>
                                )}
                            </div>

                            <div style={{ width:'33.33%' }}> </div>

                        </div>

                        <div style={{ width:'100%', display:'flex' }}>
                            <div style={{ width: '50%' }}/>
                            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'-45px', width:'50%', transform: 'translate(0px, -125px)' }}>
                                <div
                                    onClick={() => dispatchModalState({
                                        openModalFollowers: true,
                                        modalFollowersProfiles: profile.getFollowers,
                                        modalFollowersTitle: t('vehicles:followers'),
                                        isFollowing: false
                                    })}
                                >
                                    <div>
                                        {state.isSelf ? (
                                            <span className={clsx("mx-1", classes.subscriptionbutton)}>
                                                {t('vehicles:followers', { count: followerCounter })}
                                            </span>
                                        ) : (
                                            <>
                                                <span onClick={(e) => {
                                                    e.stopPropagation()
                                                }}>
                                                    {
                                                        alreadyFollowProfile ?
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                className={clsx(classes.subscriptionbuttonblue)}
                                                                onClick={() => handleFollowProfile()}>
                                                                {t('vehicles:un-subscriptions')}
                                                            </Button>
                                                            :
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                className={clsx(classes.subscriptionbuttonblue)}
                                                                onClick={() => handleFollowProfile()}>
                                                                {t('vehicles:subscriptions')}
                                                            </Button>
                                                    }
                                                </span>
                                                <span className={clsx(classes.subscriptionbutton)}>
                                                    {followerCounter} {t('vehicles:followers', { count: followerCounter })}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={classes.subscriptionbutton}
                                    onClick={() => dispatchModalState({
                                        openModalFollowers: true,
                                        modalFollowersProfiles: profile.getFollowings,
                                        modalFollowersTitle: t('vehicles:subscriptions'),
                                        isFollowing: true,
                                        isOwner: profile.getID === authenticatedUser.getID,
                                        handleUnSubscription: handleUnSubscription
                                    })}>

                                    <span>
                                        {profile.getCountFollowings} {t('vehicles:subscriptions', { count: profile.getCountFollowings })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <TabsContainer {...{
                    state,
                    filterState,
                    updateFilters,
                    fetchAnnounces
                }} />
            </Container>

        </>
    )
}

const getParams = () => {
    if (typeof window === 'undefined') {
        return {}
    }

    return window.location.search.substring(1).split('&').reduce((acc, param) => {
        const [key, value] = param.split('=')

        return {
            ...acc,
            [key]: value
        }
    }, {})
}

const TabsContainer = ({ state, filterState, updateFilters, fetchAnnounces }) => {

    const isMobile = useMediaQuery('(max-width:768px)')
    const router = useRouter()
    const classes = useStyles()
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const [filtersOpened] = useState(false)
    const { profile, isSelf } = state
    const { activeTab = 0 } = getParams()
    const[selectedSlug, setSelectedSlug] = useState("")
    const [openDialogRemove, setOpenDialogRemove] = useState(false)

    const [state1, setState] = useState({
        loading: true,
        sorter: {},
        filters: {},
        page: 1,
        pages: 1,
        announces: [],
        total: 0,
        isScrollLoding: false
    })

    const handleOpenDialogRemove = () => { setOpenDialogRemove(true) }

    const handleCloseDialogRemove = () => { setOpenDialogRemove(false) }

    const handleRemove = () => {
        AnnounceService.removeAnnounce(selectedSlug)
            .then(() => {
                dispatchModal({ msg: 'Announce successfully removed' })
                window.location.reload()
            }).catch(err => {
                dispatchModalError({ err }) })
    }

    const announceMinted = (announce) => {
        let minted = false
        for (let i = 0; i < state.announcesMinted.length; i++) {
            const item = state.announcesMinted[i]

            if (item.id.includes(announce.raw.id)) {
                minted = true
                break
            }
        }
        return minted
    }

    const onTabChange = (tab) => {
        const href = router.pathname.replace('[username]', router.query.username)
        router.push(`${href}?activeTab=${tab}`)
    }

    const updateSorter = (sorter) => {
        setState(state1 => ({
            ...state1,
            sorter
        }))
    }
    return (
        <Container>
            <Row>
                <div style={{ width:'103%' }}>

                    <Tabs updateFilters={updateFilters} defaultActive={0} active={activeTab} className={classes.tabs} handleClickTab={onTabChange} style={{ width:'101%' }} >
                        <Tabs.Item id="home-tab" title="Vitrine">
                            {isMobile ? (
                                <div style={{ width:'100%' }}>
                                    <section className={filtersOpened ? 'filter-is-visible' : ''}>
                                        <Row className="my-2 d-flex justify-content-center">
                                            {profile.getCountGarage !== 0 ? profile.getGarage.map((announce, index) => (
                                                announceMinted(announce) ?
                                                    <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                        <AnnounceCard
                                                            announceRaw={announce.getRaw}
                                                            onSelectSlug={setSelectedSlug}
                                                            onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                        />
                                                    </div>
                                                    : null
                                            )) : (
                                                <div className="d-flex flex-column align-items-center smy-2">
                                                    <p>{t('vehicles:no-found-announces')}</p>
                                                </div>
                                            )}
                                        </Row>
                                    </section>
                                </div>

                            ):(
                                <section className={filtersOpened ? 'filter-is-visible' : ''}>
                                    <Row className="my-2 d-flex justify-content-center">

                                        {profile.getCountGarage !== 0 ? profile.getGarage.map((announce, index) => (
                                            announceMinted(announce) ?
                                                <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                    <AnnounceCard
                                                        announceRaw={announce.getRaw}
                                                        onSelectSlug={setSelectedSlug}
                                                        onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                    />
                                                </div>
                                                : null
                                        )) : (
                                            <div className="d-flex flex-column align-items-center smy-2">
                                                <p>{t('vehicles:no-found-announces')}</p>
                                            </div>
                                        )}
                                    </Row>
                                </section>
                            )}

                        </Tabs.Item>

                        {isSelf && (
                            <Tabs.Item id="favoris-tab" title={t('vehicles:favorites')}>
                                {isMobile ? (
                                    <div style={{ width:'100%' }}>
                                        <Row className="my-2 d-flex justify-content-center">
                                            {profile.getFavorites.length ? profile.getFavorites.map((announceRaw, index) => (
                                                announceMinted(announceRaw) ?
                                                    <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                        <AnnounceCard
                                                            announceRaw={announceRaw.getRaw}
                                                            onSelectSlug={setSelectedSlug}
                                                            onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                        />
                                                    </div>
                                                    : null
                                            )) : (
                                                <div className="d-flex flex-column align-items-center smy-2">
                                                    <p>{(t('vehicles:no-favorite-announces'))}</p>
                                                </div>
                                            )}
                                        </Row>
                                    </div>

                                ):(
                                    <Row className="my-2 d-flex justify-content-center">
                                        {profile.getFavorites.length  ? profile.getFavorites.map((announceRaw, index) => (
                                            <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                announceMinted(announceRaw) ?
                                                <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                    <AnnounceCard
                                                        announceRaw={announceRaw.getRaw}
                                                        onSelectSlug={setSelectedSlug}
                                                        onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                    />
                                                </div>
                                                : null
                                            </div>
                                        )) : (
                                            <div className="d-flex flex-column align-items-center smy-2">
                                                <p>{(t('vehicles:no-favorite-announces'))}</p>
                                            </div>
                                        )}
                                    </Row>
                                )}
                            </Tabs.Item>
                        )}
                    </Tabs>
                </div>
            </Row>

            <Dialog open={openDialogRemove} onClose={handleCloseDialogRemove}>
                <DialogTitle id="alert-dialog-title" disableTypography>{t('vehicles:confirm-suppression')}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialogRemove} color="primary" autoFocus>{t('vehicles:cancel')}</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<DeleteIcon/>}
                        onClick={handleRemove} >
                        {t('vehicles:remove-announce')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Profile
