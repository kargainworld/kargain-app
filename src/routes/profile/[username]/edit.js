import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next-translate/Link'
import { useForm } from 'react-hook-form'
import Alert from '@material-ui/lab/Alert'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DeleteIcon from '@material-ui/icons/Delete'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import useTranslation from 'next-translate/useTranslation'
import { Col, Nav, NavItem, Row, TabContent, TabPane, Container } from 'reactstrap'

import { NewIcons } from 'assets/icons'
import { useWeb3Modal } from 'context/Web3Context'
import { providers } from 'ethers'

import TextInput from '../../../components/Form/Inputs/TextInput'
import EmailInput from '../../../components/Form/Inputs/EmailInput'
import TelInput from '../../../components/Form/Inputs/TelInput'
import TextareaInput from '../../../components/Form/Inputs/TextareaInput'
import NumberInput from '../../../components/Form/Inputs/NumberInput'
import SelectCountryFlags from '../../../components/Form/Inputs/SelectCountryFlags'
import SearchLocationInput from '../../../components/Form/Inputs/SearchLocationInput'
import ValidationErrors from '../../../components/Form/Validations/ValidationErrors'
import AvatarPreviewUpload from '../../../components/Avatar/AvatarPreviewUpload'
// import OffersPurchaseForm from '../../../components/Stripe/OffersPurchaseForm'
import FieldWrapper from '../../../components/Form/FieldWrapper'
import CTALink from '../../../components/CTALink'
import { MessageContext } from 'context/MessageContext'
import { useAuth } from '../../../context/AuthProvider'
import UsersService from '../../../services/UsersService'

import UserModel from '../../../models/user.model'
import Error from '../../_error'
import customColors from '../../../theme/palette'
import { CircularProgress, DialogContent } from '@material-ui/core'



const useStyles = makeStyles(() => ({
    stickyNav: {
        position: 'fixed'
    },

    nav: {
        padding: 0,
        width: '100%',
        maxWidth: '260px'
    },

    navMobile: {
        display: 'flex'
    },

    navList: {
        width: '100%',
        boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
        borderRadius: '20px'
    },

    // button: {
    //     margin: '1rem'
    // },

    navItem: {
        border: 'none',
        padding: '1rem',
        borderRadius: 0,
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',

        '&.active': {
            fontWeight: '700',
            border: 'none',
            borderBottom: `4px solid #EF5DA8`,
            color: '#EF5DA8',
            textAlign: 'center',
            background: 'none'
        },

        '&:last-child': {
            borderBottom: 'unset!important'
        }
    },
    navItemMobile: {
        border: 'none',
        padding: '1rem',
        borderRadius: 0,
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        width: '33%',
        borderBottom: `2px solid #999999`,
        fontSize: '14px',
        color: '#999999',
        '&.active': {
            fontWeight: '700',
            border: 'none',
            borderBottom: `4px solid #ED80EB`,
            color: '#ED80EB',
            textAlign: 'center',
            background: 'none'
        }
    },

    formRow: {
        display: 'flex',

        '& > div': {
            margin: '1rem',
            flex: 1
        }
    },

    customize: {

        fontSize: '24px',

        '& .input-field': {
            backgroundColor: '#ffffff'
        }
    },

    RemoveColorlabel: {
        '& label': {
            marginBottom: '15px !important'
        }
    },

    bordergradientbtn: {
        borderRadius: '100rem',
        // padding: '1rem',
        fontSize: '14px',
        padding: '5px 25px',
        // boxShadow: '0 0 6px 0 rgba(157, 96, 212, 0.5)',
        border: 'solid 2px transparent',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #2C65F6, #ED80EB)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '2px 1000px 1px #fff inset',
        '&:hover': {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #0244ea, #e81ae5)'
        },

        '& span': {

            background: '-webkit-linear-gradient(#2C65F6, #ED80EB); -webkit-background-clip: text; -webkit-text-fill-color: transparent',
            backgroundImage: 'linear-gradient(60deg, #2C65F6, #ED80EB)',
            backgroundClip: 'text',
            color: 'transparent'

        }
    },
    gradienttext: {
        background: '-webkit-linear-gradient(#2C65F6, #ED80EB); -webkit-background-clip: text; -webkit-text-fill-color: transparent',
        backgroundImage: 'linear-gradient(60deg, #2C65F6, #ED80EB)',
        backgroundClip: 'text',
        color: 'transparent'
    },
    phon: {
        '& .special-label': {
            display: 'none !important'
        }
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        background: customColors.gradient.main
    }


}))

const Edit = () => {
    const formRef = useRef()
    const theme = useTheme()
    const router = useRouter()
    const { username } = router.query
    const { isAuthReady, logout } = useAuth()
    const { offer } = router.query
    const { t } = useTranslation()
    const classes = useStyles()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const [activeTab, setActiveTab] = useState(0)
    const [state, setState] = useState({
        err: null,
        stateReady: false,
        isSelf: false,
        isAdmin: false,
        profile: new UserModel()
    })
    const [openDialogRemove, setOpenDialogRemove] = useState(false)
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true
    })

    const [open, setOpen] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    const { provider } = useWeb3Modal()

    const tabs = [
        {
            title: t('vehicles:my-profile')
        },
        {
            title: t('vehicles:payments-bills')
        },
        {
            title: t('vehicles:confidentiality-security')
        }
    ]

    const toggleModal = (status) => {
        setOpen(status)
    }

    const toggleTab = (tabIndex) => {
        if (activeTab !== tabIndex) {
            setActiveTab(tabIndex)
        }
    }

    const signMessage = async (form) => {
        try {
            const web3Provider = new providers.Web3Provider(provider)

            const signer = web3Provider.getSigner()

            const message = `
                I would like to update preferences. Username is ${form.firstname} ${form.lastname}, email is ${form.email}, phone is ${form.phone}, Country is ${form.countrySelect?.label}, about is ${form.about}
            `
            toggleModal(true)

            await signer.signMessage(message)
            toggleModal(false)
        } catch (error) {
            setOpen(false)
            throw new Error(500)
        }
    }

    const triggerSubmit = async () => {

        formRef.current.dispatchEvent(new Event('submit'))
    }

    const handleOpenDialogRemove = () => {
        setOpenDialogRemove(true)
    }

    const handleCloseDialogRemove = () => {
        setOpenDialogRemove(false)
    }

    const handleRemove = () => {
        UsersService.removeUser(state.profile.getUsername)
            .then(() => {
                dispatchModal({ msg: 'User successfully removed (disabled)' })
                router.push('/')
                logout()
            }).catch(err => {
                dispatchModalError({ err })
            }
            )
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

    useEffect(() => {
        if (offer) setActiveTab(1)
        if (isAuthReady) fetchProfile()
    }, [isAuthReady, fetchProfile])

    if (!state.stateReady) return null
    if (state.err) return <Error statusCode={state.err?.statusCode} />

    return (
        <Container>
            <Dialog
                open={openDialogRemove}
                onClose={handleCloseDialogRemove}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
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
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemove()}
                    // TODO: think it possibly not working. check this.
                    // looks like you need to call handleRemove() here
                    >
                        {t('vehicles:remove-announce')}
                    </Button>
                </DialogActions>
            </Dialog>

            {state.isAdmin && (
                <Alert severity="info" className="mb-2">
                    Connected as Admin
                </Alert>
            )}

            {!isDesktop && (
                <NavMobile {...{
                    tabs,
                    activeTab,
                    toggleTab
                }} />
            )}

            <Row className="justify-content-center">
                {isDesktop && (
                    <Col sm="12" md="3" lg="3">
                        <NavDesktop {...{
                            tabs,
                            classes,
                            activeTab,
                            toggleTab,
                            triggerSubmit,
                            profilePageLink: state.profile.getProfileLink
                        }} />
                    </Col>
                )}

                <Col xs="12" md="9" lg="9">
                    <MultiTabsForm
                        {...{
                            formRef,
                            activeTab,
                            offer,
                            triggerSubmit,
                            handleOpenDialogRemove,
                            profilePageLink: state.profile.getProfileLink,
                            defaultValues: {
                                ...state.profile.getRaw,
                                address: state.profile.getAddressParts
                            },
                            isAdmin: state.isAdmin,
                            signMessage
                        }} />
                </Col>
            </Row>

            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                style={{ minWidth: 100 }}
            >
                <DialogTitle id="alert-dialog-title" disableTypography>
                    {'Loading'}
                </DialogTitle>
                <DialogContent style={{ minWidth: 180, textAlign: 'center' }}>
                    <CircularProgress />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary" autoFocus>
                        {t('vehicles:cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

const MultiTabsForm = ({ offer, activeTab, formRef, defaultValues, triggerSubmit, handleOpenDialogRemove, profilePageLink, isAdmin, signMessage }) => {

    const isMobile = useMediaQuery('(max-width:768px)')

    const theme = useTheme()
    const classes = useStyles()
    const { t } = useTranslation()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true
    })
    const { control, watch, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })

    const onSubmit = async (form) => {
        signMessage(form).then(() => {
            UsersService.updateUser(form)
                .then(() => {
                    dispatchModal({
                        msg: 'User successfully updated'
                    })
                }).catch(err => {
                    dispatchModalError({ err })
                })
        })
    }

    return (
        <form className="p-3 mx-auto" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            {errors && <ValidationErrors errors={errors} />}
            <>
                {isMobile ? (
                    <>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId={0} >
                                <ProfilePartialForm
                                    {...{
                                        control,
                                        watch,
                                        isAdmin,
                                        errors
                                    }}
                                />
                            </TabPane>
                            {/* <TabPane tabId={1}>
                                <Typography component="h2" variant="h2" className="text-left" gutterBottom>
                                    {t('vehicles:payments-bills')}
                                </Typography>
                                <OffersPurchaseForm offer={offer} />
                            </TabPane> */}
                            <TabPane tabId={2}>
                                <Typography component="h2" variant="h2" className="text-left" gutterBottom>
                                    {t('vehicles:confidentiality-security')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    endIcon={<DeleteIcon />}
                                    onClick={handleOpenDialogRemove}
                                    style={{ marginTop: '25px' }}
                                >
                                    {t('vehicles:remove-profile')}
                                </Button>
                            </TabPane>
                        </TabContent>
                    </>
                ) : (
                    <>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId={0}>
                                <ProfilePartialForm
                                    {...{
                                        control,
                                        watch,
                                        isAdmin,
                                        errors
                                    }}
                                />
                            </TabPane>
                            {/* <TabPane tabId={1}>
                                <Typography component="h2" variant="h2" className="text-left" gutterBottom>
                                    {t('vehicles:payments-bills')}
                                </Typography>
                                <OffersPurchaseForm offer={offer} />
                            </TabPane> */}
                            <TabPane tabId={2}>
                                <Typography component="h2" variant="h2" className="text-left" gutterBottom>
                                    {t('vehicles:confidentiality-security')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    endIcon={<DeleteIcon />}
                                    onClick={handleOpenDialogRemove}
                                    style={{ marginTop: '25px' }}
                                >
                                    {t('vehicles:remove-profile')}
                                </Button>
                            </TabPane>
                        </TabContent>
                    </>
                )}
            </>

            {!isDesktop && (
                <Buttons {...{
                    profilePageLink,
                    triggerSubmit
                }} />
            )}
        </form>
    )
}

// const SimpleModal = ({ open, message }) => {
//     return (

//     )
// }

const ProfilePartialForm = ({ control, watch, isAdmin, errors }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const countrySelect = watch('countrySelect')

    const isMobile = useMediaQuery('(max-width:768px)')
    return (
        <>
            {isMobile ? (
                <Typography component="h2" variant="h2" gutterBottom className={clsx("text-center", classes.customize)} style={{ marginBottom: '10px' }}>
                    {t('vehicles:edit-my-profile')}
                </Typography>
            ) : (
                <Typography component="h2" variant="h2" gutterBottom className={clsx("text-left", classes.customize)}>
                    {t('vehicles:edit-my-profile')}
                </Typography>
            )}


            <AvatarPreviewUpload />

            {isMobile ? (
                <>
                    <FieldWrapper label={t('vehicles:firstname')}>
                        <TextInput
                            name="firstname"
                            errors={errors}
                            control={control}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>

                    <FieldWrapper label={t('vehicles:lastname')}>
                        <TextInput
                            name="lastname"
                            errors={errors}
                            control={control}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </>
            ) : (
                <div className={classes.formRow}>
                    <FieldWrapper label={t('vehicles:firstname')}>
                        <TextInput
                            name="firstname"
                            errors={errors}
                            control={control}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>

                    <FieldWrapper label={t('vehicles:lastname')}>
                        <TextInput
                            name="lastname"
                            errors={errors}
                            control={control}
                            rules={{ required: t('form_validations:required') }}
                        />
                    </FieldWrapper>
                </div>
            )}


            <FieldWrapper label="Email" className={clsx(classes.customize)}>
                <EmailInput
                    name="email"
                    errors={errors}
                    control={control}
                    rules={{ required: t('form_validations:required') }}

                />
            </FieldWrapper>

            <div className="my-3" style={{ marginLeft: '8px' }}>
                <label style={{
                    color: '#999999',
                    width: '100%',
                    padding: '0',
                    fontSize: '12px',
                    marginTop: '12px',
                    marginBottom: '15px'
                }}>{t('vehicles:password')}</label>
                <Link href="/auth/forgotten">
                    <a className={clsx(classes.bordergradientbtn)}>
                        <label className={clsx(classes.gradienttext)}> RESET PASSWORD </label>
                    </a>
                </Link>
            </div>

            <FieldWrapper label={t('vehicles:country')}>
                <SelectCountryFlags
                    name="countrySelect"
                    errors={errors}
                    control={control}
                />
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:address')}>
                <SearchLocationInput
                    name="address"
                    country={countrySelect?.value}
                    control={control}
                    errors={errors}
                    rules={{ required: t('form_validations:required') }}>
                </SearchLocationInput>
            </FieldWrapper>

            <FieldWrapper label={t('vehicles:phone')}  >
                <div className={clsx(classes.phon)} >
                    <TelInput
                        name="phone"
                        errors={errors}
                        control={control}
                        rules={{ required: t('form_validations:field-is-required') }}
                        innerProps={{
                            country: 'fr'
                        }}
                        className={clsx(classes.phon)}
                    />
                </div>
            </FieldWrapper>

            <FieldWrapper label="Description">
                <TextareaInput
                    name="about"
                    control={control}
                    errors={errors}
                />
            </FieldWrapper>
            {isAdmin && (
                <FieldWrapper label={t('vehicles:announce_approve')}>
                    <NumberInput
                        name="subscriptionOfferMaxAnnounces"
                        placeholder={t('vehicles:announce_count')}
                        control={control}
                        errors={errors}
                        rules={{ required: t('form_validations:required') }}
                    />
                </FieldWrapper>
            )}
        </>
    )
}

const NavDesktop = ({ tabs, activeTab, toggleTab, triggerSubmit, profilePageLink }) => {
    const classes = useStyles()
    return (
        <div className={clsx(classes.nav, classes.stickyNav)}>
            <div className="my-2">
                <Nav vertical>
                    {tabs && tabs.map((tab, index) => (
                        <NavItem
                            key={index}
                            className={clsx(classes.navItem, activeTab === index && 'active')}
                            onClick={() => toggleTab(index)}>
                            {tab.title}

                        </NavItem>
                    ))}
                </Nav>
            </div>

            <Buttons
                triggerSubmit={triggerSubmit}
                profilePageLink={profilePageLink}
            />
        </div>
    )
}

const NavMobile = ({ tabs, activeTab, toggleTab }) => {
    const classes = useStyles()

    return (
        <Nav >
            {tabs && tabs.map((tab, index) => (
                <NavItem
                    key={index}
                    className={clsx(classes.navItemMobile, activeTab === index && 'active')}
                    onClick={() => toggleTab(index)}>
                    {tab.title}
                </NavItem>
            ))}
        </Nav>
    )
}

const Buttons = ({ triggerSubmit, profilePageLink }) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const isMobile = useMediaQuery('(max-width:768px)')
    return (
        <>
            {isMobile ? (
                <div style={{ display: 'flex', marginTop: '20px', marginLeft: '5px' }} >
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={clsx(classes.button)}
                        endIcon={<NewIcons.save />}
                        type="submit"
                        onClick={() => {
                            triggerSubmit()
                        }}>
                        {/* {t('vehicles:save')} */}
                        RECORD
                    </Button>

                    <CTALink className={clsx(classes.bordergradientbtn)} title="BACK TO PROFILE" href={profilePageLink} />
                    {/* <CTALink className={clsx(classes.bordergradientbtn)} title={t('vehicles:back_to_profile')} href={profilePageLink} /> */}
                </div>
            ) : (
                <div className="d-flex flex-column mx-auto my-3" style={{ maxWidth: '300px', marginLeft: '30px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        className={clsx(classes.button)}
                        endIcon={<NewIcons.save style={{ marginLeft: '8px' }} />}
                        type="submit"
                        style={{ height: '35px', width: '250px', marginLeft: '10px' }}
                        onClick={() => {
                            triggerSubmit()
                        }}>
                        {t('vehicles:save')}

                    </Button>

                    <CTALink className={clsx(classes.bordergradientbtn)} title={t('vehicles:back_to_profile')} href={profilePageLink} style={{ height: '35px', marginTop: '10px', width: '250px', marginLeft: '10px' }} />
                </div>
            )}
        </>

    )
}

export default Edit
