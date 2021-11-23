import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, {  useContext, useEffect, useState } from "react"
import { MessageContext } from "context/MessageContext"
import AnnounceService from "../services/AnnounceService"
import { Container, Row } from "reactstrap"
import Tabs from "./Tabs/Tabs"
import AnnounceCard from "./AnnounceCard"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/icons/Delete"
import { makeStyles } from "@material-ui/styles"
import customColors from "../theme/palette"
import Loading from "./Loading"


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

const TabsContainer = ({ profile, isSelf, announceMinted, filterState, updateFilters }) => {

    const isMobile = useMediaQuery('(max-width:768px)')
    const router = useRouter()
    const classes = useStyles()
    const { t } = useTranslation()
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const [filtersOpened] = useState(false)
    const { activeTab = 0 } = getParams()
    const [selectedSlug, setSelectedSlug] = useState("")
    const [openDialogRemove, setOpenDialogRemove] = useState(false)

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

    const garageAnnounceMint = profile.getGarage.filter(x=>  announceMinted.find( y => y.id === x.getID))
    const favoritesAnnounceMint = profile.getFavorites.filter(x=> announceMinted.find( y => y.id === x.getID))

    const getPriceGarageToken = (id) => {
        const tokenPrice = announceMinted.find( y => y.id === id).tokenPrice
        return tokenPrice
    }

    const onTabChange = (tab) => {
        const href = router.pathname.replace('[username]', router.query.username)
        router.push(`${href}?activeTab=${tab}`)
    }

    useEffect(() => {
        if (filterState.loading) return <Loading />
    }, [filterState.loading])
    return (
        <Container>
            <Row>
                <div style={{ width:'103%' }}>
                    <Tabs updateFilters={updateFilters} defaultActive={0} active={activeTab} total={announceMinted.length} className={classes.tabs} handleClickTab={onTabChange} style={{ width:'101%' }} >
                        <Tabs.Item id="home-tab" title="Vitrine">
                            {isMobile ? (
                                <div style={{ width:'100%' }}>
                                    <section className={filtersOpened ? 'filter-is-visible' : ''}>
                                        <Row className="my-2 d-flex justify-content-center">
                                            {garageAnnounceMint.length !== 0 && garageAnnounceMint.map((announce, index) => (
                                                <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                    <AnnounceCard
                                                        announceRaw={announce.getRaw}
                                                        tokenPrice={getPriceGarageToken(announce.getID)}
                                                        onSelectSlug={setSelectedSlug}
                                                        onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                    />
                                                </div>))
                                            }
                                            {garageAnnounceMint.length === 0 &&
                                                <div className="d-flex flex-column align-items-center smy-2">
                                                    <p>{t('vehicles:no-found-announces')}</p>
                                                </div>
                                            }
                                        </Row>
                                    </section>
                                </div>

                            ):(
                                <section className={filtersOpened ? 'filter-is-visible' : ''}>
                                    <Row className="my-2 d-flex justify-content-center">
                                        {garageAnnounceMint.length !== 0 && garageAnnounceMint.map((announce, index) => (
                                            <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                <AnnounceCard
                                                    announceRaw={announce.getRaw}
                                                    tokenPrice={getPriceGarageToken(announce.getID)}
                                                    onSelectSlug={setSelectedSlug}
                                                    onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                />
                                            </div>))
                                        }
                                        {garageAnnounceMint.length === 0 &&
                                        <div className="d-flex flex-column align-items-center smy-2">
                                            <p>{t('vehicles:no-found-announces')}</p>
                                        </div>
                                        }
                                    </Row>
                                </section>
                            )}

                        </Tabs.Item>

                        {isSelf && (
                            <Tabs.Item id="favoris-tab" title={t('vehicles:favorites')}>
                                {isMobile ? (
                                    <div style={{ width:'100%' }}>
                                        <Row className="my-2 d-flex justify-content-center">
                                            {favoritesAnnounceMint.length !== 0 && favoritesAnnounceMint.map((announceRaw, index) => (
                                                <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                    <AnnounceCard
                                                        announceRaw={announceRaw.getRaw}
                                                        tokenPrice={getPriceGarageToken(announceRaw.getID)}
                                                        onSelectSlug={setSelectedSlug}
                                                        onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                    />
                                                </div>))
                                            }
                                            {favoritesAnnounceMint.length === 0 &&
                                                <div className="d-flex flex-column align-items-center smy-2">
                                                    <p>{(t('vehicles:no-favorite-announces'))}</p>
                                                </div>
                                            }
                                        </Row>
                                    </div>

                                ):(
                                    <Row className="my-2 d-flex justify-content-center">
                                        {favoritesAnnounceMint.length !== 0 && favoritesAnnounceMint.map((announceRaw, index) => (
                                            <div key={index} style={{ width: '31%', marginRight:'2.1%' }}>
                                                <AnnounceCard
                                                    announceRaw={announceRaw.getRaw}
                                                    tokenPrice={getPriceGarageToken(announceRaw.getID)}
                                                    onSelectSlug={setSelectedSlug}
                                                    onhandleOpenDialogRemove={handleOpenDialogRemove}
                                                />
                                            </div>))
                                        }
                                        {favoritesAnnounceMint.length === 0 &&
                                        <div className="d-flex flex-column align-items-center smy-2">
                                            <p>{(t('vehicles:no-favorite-announces'))}</p>
                                        </div>
                                        }
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

export default TabsContainer
