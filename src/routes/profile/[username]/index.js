import React, { useCallback, useContext, useEffect, useState } from 'react'
import {  Container } from 'reactstrap'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import ChatIcon from '@material-ui/icons/Chat'
import Button from '@material-ui/core/Button'
import TransactionsService from "services/TransactionsService"
import { useAuth } from 'context/AuthProvider'
// import { MessageContext } from 'context/MessageContext'
import { ModalContext } from 'context/ModalContext'
import UsersService from 'services/UsersService'
import AnnounceService from 'services/AnnounceService'
import UserModel from 'models/user.model'
import AvatarPreview from 'components/Avatar/AvatarPreview'
import Error from '../../_error'
import { makeStyles } from "@material-ui/styles"
import clsx from "clsx"
import customColors from 'theme/palette'
import { NewIcons } from 'assets/icons'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import TabsContainer from "../../../components/TabsContainer"
import AnnounceModel from 'models/announce.model'
import { useMessage } from '../../../context/MessageContext'

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
    const classes = useStyles()
    const { t } = useTranslation()
    const router = useRouter()
    const { username } = router.query
    const { authenticatedUser, isAuthenticated } = useAuth()
    const { dispatchModalError } = useMessage()
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
            setFilterState(filterState => ({
                ...filterState,
                loading: true
            }))
            const result = await UsersService.getUserByUsername(username)
            const { user, isAdmin, isSelf } = result
            setState(state => ({
                ...state,
                stateReady: true,
                profile: new UserModel(user),
                isAdmin,
                isSelf
            }))
            setFilterState(filterState => ({
                ...filterState,
                loading: false
            }))
        } catch (err) {
            console.log("Error Login")
            console.log(err)
            setState(state => ({
                ...state,
                stateReady: true,
                err
            }))
        }
    }, [username])

    const fetchAnnounces = useCallback(async () => {
        try {
            setFilterState(filterState => ({
                ...filterState,
                loading: true
            }))

            const { sorter, filters, page } = filterState


            const params = {
                page,
                sort_by: sorter.key,
                sort_ord: sorter.asc ? 'ASC' : null,
                ...filters,
                user: profile.getID
            }

            const result = await AnnounceService.getProfileAnnounces(params)
            state.profile.updateAnnounces(result.rows)

            /*setState(state => ({
                ...state,
                profile: new UserModel({
                    ...state.profile.getRaw,
                    garage: result.rows
                }),
                stateAnnounces: true
            }))*/

            let tokensMinted = []
            for (const announce of result.rows) {
                const ad = new AnnounceModel(announce)
                let isTokenMinted = false
                const data = await TransactionsService.getTransactionsByAnnounceId(ad.getID)
                if (data[0] && ad.getID === data[0].announce && data[0].status === 'Approved' && data[0].action === 'TokenMinted') {
                    isTokenMinted = true
                }
                if (data[0] && ad.getID === data[0].announce && data[0] && data[0].status === 'OfferAccepted') {
                    isTokenMinted = false
                }

                if (isTokenMinted) {
                    const token = {
                        tokenPrice: data[0].data,
                        id: announce.id
                    }
                    tokensMinted.push(token)
                }
            }

            setState(state => ({
                ...state,
                announcesMinted: tokensMinted
            }))

            setFilterState(filterState => ({
                ...filterState,
                loading: false
            }))
            
        } catch (err) {
            console.error(err)
        }
    }, [filterState.sorter, filterState.filters, filterState.page])

    const updateFilters = (filters) => {
        setFilterState(filterState => ({
            ...filterState,
            filters: filters
        }))
    }

    useEffect(() => {
        setFollowersCounter(profile.getCountFollowers)
        setAlreadyFollowProfile(!!profile.getFollowers.find(follower =>
            follower.getID === authenticatedUser.getID))
    }, [authenticatedUser, profile])

    useEffect(() => {
        fetchProfile()
        window.scrollTo(0, 0)
    }, [fetchProfile])

    // useEffect(() => {
    //     if (filterState.loading) return <Loading />

    // }, [filterState.loading])

    useEffect(() => {
        if (state.stateReady) {
            setFilterState(filterState => ({
                ...filterState,
                loading: false
            }))
            fetchAnnounces()
        }
    }, [fetchAnnounces, state.stateReady])

    if (!state.stateReady) return null
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
                <TabsContainer  profile={state.profile}
                    isSelf = {state.isSelf}
                    announceMinted = {state.announcesMinted}
                    filterState ={filterState}
                    updateFilters = {updateFilters}
                />

            </Container>

        </>
    )
}



export default Profile
