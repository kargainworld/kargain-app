import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router"
import { Col, Container, Row } from 'reactstrap'
import clsx from 'clsx'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import Typography from '@material-ui/core/Typography'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import AnnounceCard from 'components/AnnounceCard'
import AnnounceService from 'services/AnnounceService'
import { MessageContext } from 'context/MessageContext'
import { useAuth } from 'context/AuthProvider'
import AdvancedFilters from './Filters/Advanced/AdvancedFilters'
import Loading from 'components/Loading'
import CTALink from './CTALink'
import { InfiniteScroll } from 'react-simple-infinite-scroll'
import useKargainContract from 'hooks/useKargainContract'
import usePriceTracker from 'hooks/usePriceTracker'
import AnnounceModel from 'models/announce.model'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import customColors from 'theme/palette'
import { injected } from "connectors"
import { useWeb3React } from "@web3-react/core"


const useStyles = makeStyles(() => ({
    row:{
        position: 'relative',
        backgroundColor: '#fff',
        marginTop:'10px'
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '30px',
        background: customColors.gradient.main
    },
    filtersHidden: {
        display: 'none !important'
    }
}))

const SearchPage = ({ fetchFeed, ...props }) => {
    const classes = useStyles()
    const isMobile = useMediaQuery('(max-width:768px)')
    const { getPriceTracker } = usePriceTracker()
    const { activate } = useWeb3React()
    const { fetchTokenPrice, isContractReady } = useKargainContract()
    const { t } = useTranslation()
    const { query } = useRouter()
    const { dispatchModalError } = useContext(MessageContext)
    const { isAuthenticated } = useAuth()
    const [filtersOpened] = useState(false)
    const [state, setState] = useState({
        loading: true,
        sorter: {},
        filters: {},
        page: 1,
        pages: 1,
        announces: [],
        total: 0,
        isScrollLoding: false,
        announcesMinted: []
    })

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

    const [hiddenFormMore, hideForm] = useState(true)
    const toggleFilters = () => {
        hideForm((hiddenFormMore) => !hiddenFormMore)
    }
    const defaultFilters = query? { TYPE_AD: query.adType, VEHICLE_TYPE: query.vehicleType } : {}

    const fetchAnnounces = useCallback(async () => {
        const { sorter, filters, page } = state
        const { size } = props
        let nextPage = 1
        if(!filters?.TYPE_AD && query) filters.TYPE_AD = query.adType
        if(!filters?.VEHICLE_TYPE && query) filters.VEHICLE_TYPE = query.vehicleType
        if(state.isScrollLoding) nextPage = page

        const params = {
            ...filters,
            sort_by: sorter.key,
            sort_ord: sorter.asc ? 'ASC' : null,
            page: nextPage,
            size
        }

        setState(state => ({
            ...state,
            loading: true
        }))

        try {
            const result = fetchFeed ?
                await AnnounceService.getFeedAnnounces(params)
                : await AnnounceService.getSearchAnnounces(params)
            let total_rows = []
            if(state.isScrollLoding){
                state.announces.map((row, index) => {
                    total_rows.push(row)
                })
                result.rows.map((row, index) => {
                    total_rows.push(row)
                })
            } else {
                total_rows = result.rows
            }
            setState(state => ({
                ...state,
                announces: total_rows || [],
                total: result.total || 0,
                page: nextPage,
                pages: result.pages || 0,
                isScrollLoding: false,
                loading: false
            }))
        } catch (err) {
            setState(state => ({
                ...state,
                isScrollLoding: false,
                loading: false
            }))
            dispatchModalError({ err })
        }
    }, [state.page, state.filters, state.sorter, AnnounceService, setState])

    const handlePageChange = (page) => {
        if(state.page >= state.pages) return
        page = state.page + 1
        setState(state => ({
            ...state,
            isScrollLoding: true,
            page
        }))
    }

    const updateFilters = (filters) => {
        setState(state => ({
            ...state,
            filters
        }))
    }

    const updateSorter = (sorter) => {
        setState(state => ({
            ...state,
            sorter
        }))
    }

    useEffect(() => {
        fetchAnnounces()
    }, [fetchAnnounces])

    useEffect(() => {

        if (!isContractReady || state.announces.length < 0 || !state.loading)
            return
        const fetchMintedAnnounces = async () => {
            let tokensMinted = []
            try {
                for (const announce of state.announces) {
                    const ad = new AnnounceModel(announce)
                    const tokenId = ad.getTokenId
                    fetchTokenPrice(tokenId)
                        .then((price) => {
                            const token = {
                                isMinted: !!price,
                                tokenPrice: price,
                                id: announce.id
                            }
                            if (token.isMinted) {
                                tokensMinted.push(token)
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            } catch (err) {
                console.log(err)
            }
            setState(state => ({
                ...state,
                announcesMinted: tokensMinted
            }))
        }

        fetchMintedAnnounces()
    }, [state.announces, isContractReady, fetchTokenPrice, state.loading, setState])

    return (
        <Container>
            <NextSeo
                title="Kargain"
                description="Vos meilleurs annonces automobiles"
            />
            <Row>
                <Col sm={12} md={12}>
                    <AdvancedFilters updateFilters={updateFilters} defaultFilters={defaultFilters}/>
                </Col>

                <Col sm={12} md={12}>
                    <section className={clsx(filtersOpened && 'filter-is-visible')} style={{ padding:'10px 1% !important' }}>
                        <InfiniteScroll
                            throttle={100}
                            threshold={300}
                            isLoading={state.loading}
                            hasMore={!!state.total}
                            onLoadMore={handlePageChange}
                        >
                            <>
                                {state.announces.length > 0 ? (
                                    <>
                                        {isMobile ? (
                                            <div style={{ marginLeft:'15px' }}>
                                                {state.announces.map((announceRaw, index) => {
                                                    const announceMinted = state.announcesMinted.find(x=>x.id === announceRaw.id)
                                                    if (announceMinted) {
                                                        return (
                                                            <div key={index}>
                                                                {index > '2' ? (
                                                                    <div>
                                                                        {index == '3' &&
                                                                        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-20px' }}>
                                                                            <div className={clsx(!hiddenFormMore && classes.filtersHidden)} style={{ width:'142px' }}>
                                                                                <div className={clsx(classes.button)} onClick={() => toggleFilters()} >LOAD MORE</div>
                                                                            </div>
                                                                        </div>
                                                                        }

                                                                        <div className={clsx(hiddenFormMore && classes.filtersHidden)}>
                                                                            <div style={{ width:'90%', marginTop: '20px' }} >
                                                                                <AnnounceCard
                                                                                    announceRaw={announceRaw}
                                                                                    tokenPrice={announceMinted?.tokenPrice}
                                                                                    detailsFontSize={'13px'}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div  style={{ width:'90%', marginTop: '20px' }}>
                                                                        <AnnounceCard
                                                                            announceRaw={announceRaw}
                                                                            tokenPrice={announceMinted?.tokenPrice}
                                                                            detailsFontSize={'13px'}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        ) : (
                                            <Row className="my-2 d-flex justify-content-center">
                                                {state.announces.map((announceRaw, index) => {
                                                    const announceMinted = state.announcesMinted.find(x=>x.id === announceRaw.id)
                                                    if (announceMinted) {
                                                        return (
                                                            <div key={index} style={{ width:'30%', marginRight:'3%', marginTop: '2%' }}>
                                                                <AnnounceCard
                                                                    announceRaw={announceRaw}
                                                                    tokenPrice={announceMinted?.tokenPrice}
                                                                    detailsFontSize={'13px'}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </Row>
                                        )}
                                    </>
                                ): (
                                    <>
                                        {!isAuthenticated ? (
                                            <CTALink
                                                title={t('layout:login')}
                                                href="/auth/login">
                                            </CTALink>
                                        ) : (
                                            <>
                                                <div className="d-flex align-items-center my-3">
                                                    <FindInPageIcon />
                                                    <Typography variant="h3">
                                                        {t('layout:no_result')}
                                                    </Typography>
                                                </div>
                                                <div className="text-center">
                                                    <CTALink
                                                        title={t('layout:news_feed')}
                                                        href="/advanced-search">
                                                    </CTALink>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        </InfiniteScroll>
                        {state.loading && (
                            <Loading />
                        )}
                    </section>
                </Col>
            </Row>
        </Container>
    )
}

SearchPage.defaultProps = {
    fetchFeed: false,
    paginate: 3,
    size: 5
}

export default SearchPage
