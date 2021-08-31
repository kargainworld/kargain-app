import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import ChatIcon from '@material-ui/icons/Chat'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { useAuth } from '../../../context/AuthProvider'
import { MessageContext } from '../../../context/MessageContext'
import { ModalContext } from '../../../context/ModalContext'
import UsersService from '../../../services/UsersService'
import AnnounceService from '../../../services/AnnounceService'
import UserModel from '../../../models/user.model'
import AvatarPreview from '../../../components/Avatar/AvatarPreview'
import AnnounceCard from '../../../components/AnnounceCard'
import CTALink from '../../../components/CTALink'
import Tabs from '../../../components/Tabs/Tabs'
import Loading from '../../../components/Loading'
import AdvancedFilters from '../../../components/Filters/Advanced/AdvancedFilters'


import Error from '../../_error'
import { makeStyles } from "@material-ui/styles"
import clsx from "clsx"
import customColors from '../../../theme/palette'
import { NewIcons } from '../../../assets/icons'

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
        lineHeight: 1,
        //
        // '& svg': {
        //     width: 16
        // }
    },
    filters: {
        padding: '0 !important',

        '& .FieldWrapper': {
            marginRight: '0 !important',
            marginLeft: '0 !important'
        }
    },
    btnFollow: {
        padding: '3px 8px',
        fontSize: '12px',
        marginRight: '15px'
    },
    button: {
        margin: '1rem'
    },
    pagetopdiv: {
        position: 'absolute',
        width: '100%',
        height: '126px',
        left: '0px',
        top: '-25px',
        background: '#EAEAEA',
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
        backgroundColor: 'white', /* Green */
        border: 'none',
        color: '#666666',
        padding: '4.5px 15px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        // cursor: 'pointer',
        borderRadius: '17.5px',
        border: '1px solid #C4C4C4',
        borderWidth: '1px',
    },
    
}))

const Profile = () => {
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
        isSelf: false,
        isAdmin: false,
        profile: new UserModel()
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
                query: { redirect: router.asPath },
            });
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
        await UsersService.unFollowUser(userId);
        fetchProfile();
        //remove current user in following to show in modal

        dispatchModalState({
            modalFollowersProfiles: profile.getFollowings.filter(following => following.getID !== userId)
        })
        
        return true;
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
                })
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

    useEffect(() => {
        setFollowersCounter(profile.getCountFollowers)
        setAlreadyFollowProfile(!!profile.getFollowers.find(follower =>
            follower.getID === authenticatedUser.getID))
    }, [authenticatedUser, profile])

    useEffect(() => {
        console.log('fetch profile')
        fetchProfile()
        window.scrollTo(0, 0)
    }, [fetchProfile])

    useEffect(() => {
        if (state.stateReady) {
            console.log('fetch announces')
            fetchAnnounces()
        }
    }, [fetchAnnounces])

    if (!state.stateReady) return null
    if (filterState.loading) return <Loading />
    if (state.err) return <Error statusCode={state.err?.statusCode} />
    // if (state.profile.getCountGarage === 0) dispatchModalError({ msg: "User's vitrine is empty", persist : false})
    return (
        <>
            <div className={clsx(classes.pagetopdiv)}></div>

            <Container style={{ marginTop: 25 }}>

                <NextSeo
                    title={`${profile.getFullName} - Kargain`}
                />

                {state.isAdmin && (
                    <Alert severity="info" className="mb-2">
                        Connected as Admin
                    </Alert>
                )}

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <AvatarPreview src={profile.getAvatar || profile.getAvatarUrl} />
                </div>

                <div>
                    <div className="top-profile-name-btn">
                        <div style={{display:'flex', justifyContent:'left', marginTop:'-25px'}}>
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
                                                    console.log(router.asPath);
                                                    router.push({
                                                    pathname: '/auth/login',
                                                    query: { redirect: router.asPath },
                                                    });
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

                        <div style={{textAlign:'center', marginTop:'25px'}} >
                            <h2 style={{fontSize:'36px', fontWeight:'bold', lineHeight: '150%'}}>
                                {profile.getFullName}
                                {(profile.getIsPro && profile.getIsActivated)}
                            </h2>

                            <p className={classes.userName} style={{fontSize:'16px', fontWeight:'normal', lineHeight:'150%', color:'black'}}>
                               <NewIcons.pigeon /> @ {profile.getUsername}
                            </p>
                        </div>

                        <div className={classes.subscriptionWrapper} style={{display:'flex', justifyContent:'right', marginTop:'-25px'}}>
                            <div className={classes.subscriptionbutton} 
                                onClick={() => dispatchModalState({
                                    openModalFollowers: true,
                                    modalFollowersProfiles: profile.getFollowers,
                                    modalFollowersTitle: t('vehicles:followers'),
                                    isFollowing: false,                                
                                })}
                                style={{marginRight:'5px'}}>
                                <div>
                                    {state.isSelf ? (
                                        <span>
                                                {t('vehicles:followers', { count: followerCounter })}
                                        </span>
                                    ) : (
                                        <>
                                            <span className={clsx('mx-1', classes.followItem)} onClick={(e) => {
                                                e.stopPropagation()
                                                // handleFollowProfile()
                                            }}>
                                                {
                                                    alreadyFollowProfile ?
                                                        // <StarSVGYellow/>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            className={classes.btnFollow}
                                                            onClick={() => handleFollowProfile()}>
                                                            {t('vehicles:un-subscriptions')}
                                                        </Button>
                                                        :
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            className={classes.btnFollow}
                                                            onClick={() => handleFollowProfile()}>
                                                            {t('vehicles:subscriptions')}
                                                        </Button>
                                                    // <StarSVG/>
                                                }
                                            </span>
                                            <span>
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

                                {/*{profile.getCountFollowings !== 0 && (*/}
                                {/*    <div className="my-2">*/}
                                {/*        <ul className="d-flex align-items-center list-style-none">*/}
                                {/*            {profile.getFollowings.slice(0, 3).map((user, index) => {*/}
                                {/*                return (*/}
                                {/*                    <li key={index} className="nav-item navbar-dropdown p-1">*/}
                                {/*                        <img className="dropdown-toggler rounded-circle"*/}
                                {/*                             width="30"*/}
                                {/*                             height="30"*/}
                                {/*                             src={user.getAvatar}*/}
                                {/*                             title={user.getFullName}*/}
                                {/*                             alt={user.getUsername}*/}
                                {/*                        />*/}
                                {/*                    </li>*/}
                                {/*                )*/}
                                {/*            })}*/}
                                {/*        </ul>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>

                    </div>

                    

                    {profile.getAddressParts.fullAddress && (
                        <a href={profile.buildAddressGoogleMapLink()}
                            target="_blank"
                            rel="noreferrer">
                            <span className="top-profile-location">
                                <LocationOnOutlinedIcon />
                                {profile.buildAddressString()}
                            </span>
                        </a>
                    )}

                    
                    <p className="top-profile-desc">
                        {profile.getDescription}
                    </p>

                </div>
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

    const handleOpenDialogRemove = () => {
	    setOpenDialogRemove(true)
    }

    const handleCloseDialogRemove = () => {
	    setOpenDialogRemove(false)
    }

    const handleRemove = () => {
		AnnounceService.removeAnnounce(selectedSlug)
			.then(() => {
				dispatchModal({ msg: 'Announce successfully removed' })
                window.location.reload() 
			}).catch(err => {
				dispatchModalError({ err })
	    })
    }

    const onTabChange = (tab) => {
        const href = router.pathname.replace('[username]', router.query.username)
        router.push(`${href}?activeTab=${tab}`)
    }

    return (
        <Container>
            <Row>
                <Col sm={12} md={3}>
                    <Typography component="p" variant="h2">
                        {t('vehicles:{count}_results_search', { count: filterState.total })}
                    </Typography>
                    <AdvancedFilters updateFilters={updateFilters} className={classes.filters} />
                </Col>
                <Col sm={12} md={9}>
                    <Tabs defaultActive={0} active={activeTab} className={classes.tabs} handleClickTab={onTabChange}>
                        <Tabs.Item id="home-tab" title="Vitrine">
                            <section className={filtersOpened ? 'filter-is-visible' : ''}>
                                <Row className="my-2 d-flex justify-content-center">
                                    {profile.getCountGarage !== 0 ? profile.getGarage.map((announce, index) => (
                                        <Col
                                            key={index}
                                            sm={12}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                            className="my-2"
                                        >
                                            <AnnounceCard announceRaw={announce.getRaw} onSelectSlug={setSelectedSlug} onhandleOpenDialogRemove={handleOpenDialogRemove} />
                                        </Col>
                                    )) : (
                                        <div className="d-flex flex-column align-items-center smy-2">
                                            {/*{profile.getCountGarage !== 0? */}
                                            {/*    profile?.getCountGarage : */}
                                            {/*    (*/}
                                            <p>{t('vehicles:no-found-announces')}</p>
                                            {/*     )*/}
                                            {/* }*/}
                                            {/* <CTALink
                                                title={t('vehicles:create-my-first-ad')}
                                                href="/deposer-une-annonce"
                                                className="cta_nav_link my-2"
                                            />

                                            <CTALink
                                                title={t('vehicles:explore-ads')}
                                                href={isAuthenticated ? '/feed' : '/'}
                                                className="cta_nav_link my-2"
                                            /> */}
                                        </div>
                                    )}
                                </Row>
                            </section>
                        </Tabs.Item>

                        {isSelf && (
                            <Tabs.Item id="favoris-tab" title={t('vehicles:garage')}>
                                <Row className="my-2 d-flex justify-content-center">
                                    {profile.getHiddenGarage.length ? profile.getHiddenGarage.map((announceRaw, index) => (
                                        // <Col key={index} sm={12} md={12} lg={6} xl={6} className="my-2">
                                        <div key={index} style={{maxWidth:'30%', marginRight:'3%', marginTop: '2%'}}>
                                            <AnnounceCard announceRaw={announceRaw} />
                                        </div>
                                        // </Col>
                                    )) : (
                                        <div className="d-flex flex-column align-items-center smy-2">
                                            <p>{t('vehicles:no-hidden-announces')}</p>
                                        </div>
                                    )}
                                </Row>
                            </Tabs.Item>
                        )}

                        {isSelf && (
                            <Tabs.Item id="favoris-tab" title={t('vehicles:favorites')}>
                                <Row className="my-2 d-flex justify-content-center">
                                    {profile.getFavorites.length ? profile.getFavorites.map((announceRaw, index) => (
                                        <Col key={index} sm={12} md={12} lg={6} xl={6} className="my-2">
                                            <AnnounceCard announceRaw={announceRaw.getRaw} />
                                        </Col>
                                    )) : (
                                        <div className="d-flex flex-column align-items-center smy-2">
                                            <p>{(t('vehicles:no-favorite-announces'))}</p>
                                        </div>
                                    )}
                                </Row>
                            </Tabs.Item>
                        )}
                    </Tabs>
                </Col>
            </Row>
            
            <Dialog
                open={openDialogRemove}
                onClose={handleCloseDialogRemove}
                >
                <DialogTitle id="alert-dialog-title" disableTypography>
                    {t('vehicles:confirm-suppression')}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialogRemove} color="primary" autoFocus>
                    {t('vehicles:cancel')}
                    </Button>
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
