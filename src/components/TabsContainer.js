import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import { useAuth } from "../context/AuthProvider"
import React, { useContext, useState } from "react"
import { MessageContext } from "../context/MessageContext"
import { ModalContext } from "../context/ModalContext"
import AnnounceService from "../services/AnnounceService"
import { Container, Row } from "reactstrap"
import Tabs from "./Tabs/Tabs"
import AnnounceCard from "./AnnounceCard"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/icons/Delete"

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
