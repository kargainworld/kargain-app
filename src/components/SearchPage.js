import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router"
import { Col, Container, Row } from 'reactstrap'
import clsx from 'clsx'
import { NextSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import Typography from '@material-ui/core/Typography'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import PaginateResults from './PaginateResults'
import Sorters from './Sorters/Sorters'
import AnnounceCard from '../components/AnnounceCard'
import AnnounceService from '../services/AnnounceService'
import { MessageContext } from '../context/MessageContext'
import { useAuth } from '../context/AuthProvider'
import AdvancedFilters from './Filters/Advanced/AdvancedFilters'
import Loading from '../components/Loading'
import CTALink from './CTALink'
import { InfiniteScroll } from 'react-simple-infinite-scroll'
import useKargainContract from 'hooks/useKargainContract'
import usePriceTracker from 'hooks/usePriceTracker'
import Web3 from 'web3'
import ObjectID from 'bson-objectid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const toBN = Web3.utils.toBN

const SearchPage = ({ fetchFeed, ...props }) => {
    const { getPriceTracker } = usePriceTracker()
    const { fetchTokenPrice, isContractReady } = useKargainContract()
    const { t } = useTranslation()
    const { query } = useRouter()
    const { dispatchModalError } = useContext(MessageContext)
    const { isAuthenticated } = useAuth()
    const [filtersOpened] = useState(false)
    const [onlyMinted, setOnlyMinted] = useState(true)
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
    const defaultFilters = query? { TYPE_AD: query.adType, VEHICLE_TYPE: query.vehicleType } : {}

    const fetchAnnounces = useCallback(async () => {
        const { sorter, filters, page } = state
        const { size } = props
        let nextPage = 1;
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
    }, [state.page, state.filters, state.sorter])

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
        // window.scrollTo(0, 0)
    }, [fetchAnnounces])

    useEffect(() => {
        if (!isContractReady && state.announces.length > 0)
            return

        const fetchMintedAnnounces = async() => {
            let tokensMinted = []

            try {
                for (const announce of state.announces) {
                    let tokenId = toBN(ObjectID(announce.id).toHexString())
                    const price = await fetchTokenPrice(tokenId)

                    const token = {
                        isMinted: !!price,
                        tokenPrice: price,
                        id: announce.id
                    }
                    if (token.isMinted) {
                        tokensMinted.push(token)
                    }
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
    }, [state.announces, isContractReady, fetchTokenPrice])

    return (
        <Container>
            <NextSeo
                title="Kargain"
                description="Vos meilleurs annonces automobiles"
            />

            <Row>
                <Col sm={12} md={12}>
                    <Typography component="p" variant="h2">
                        {t('vehicles:{count}_results_search', { count: onlyMinted ? state.announcesMinted.length : state.announces.length })}
                    </Typography>
                    <AdvancedFilters updateFilters={updateFilters} defaultFilters={defaultFilters}/>
                </Col>

                <Col sm={12} md={12}>

                    <section className="cd-tab-filter-wrapper">
                        <div className={clsx('cd-tab-filter', filtersOpened && 'filter-is-visible')} style={{ display:"flex" }}>
                            <Sorters updateSorter={updateSorter} />
                            <FormControlLabel
                                style={{ margin:0 }}
                                control={<Switch checked={onlyMinted} onChange={() => setOnlyMinted(prev => !prev)} name="show-only-minted" />}
                                label="Show only minted"
                            />
                        </div>
                    </section>


                    <section className={clsx('cd-gallery', filtersOpened && 'filter-is-visible')}>
                        <InfiniteScroll
                            throttle={100}
                            threshold={300}
                            isLoading={state.loading}
                            hasMore={!!state.total}
                            onLoadMore={handlePageChange}
                        >
                            <>
                                {state.announces.length !== 0 ? (
                                    <Row className="my-2 d-flex justify-content-center">
                                        {state.announces.map((announceRaw, index) => {
                                            const announceMinted = state.announcesMinted.find(x=>x.id === announceRaw.id)

                                            if (!onlyMinted || announceMinted) {
                                                return (
                                                    <Col key={index} sm={12} md={12} className="my-2">
                                                        <AnnounceCard
                                                            announceRaw={announceRaw}
                                                            tokenPrice={announceMinted?.tokenPrice}
                                                            detailsFontSize={'13px'}
                                                        />
                                                    </Col>
                                                )
                                            }
                                        })}
                                    </Row>
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
                                                    <FindInPageIcon fontSize="default" />
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

                        {/* {state.loading ? <Loading /> : (
                            <>
                                {state.announces.length !== 0 ? (
                                    <Row className="my-2 d-flex justify-content-center">
                                        {state.announces.map((announceRaw, index) => {
                                            const announceMinted = state.announcesMinted.find(x=>x.id === announceRaw.id)

                                            if (!onlyMinted || announceMinted) {
                                                return (
                                                    <Col key={index} sm={12} md={12} className="my-2">
                                                        <AnnounceCard
                                                            announceRaw={announceRaw}
                                                            tokenPrice={announceMinted?.tokenPrice}
                                                            detailsFontSize={'13px'}
                                                        />
                                                    </Col>
                                                )
                                            }
                                        })}
                                    </Row>
                                ) : (
                                    <>
                                        {!isAuthenticated ? (
                                            <CTALink
                                                title={t('layout:login')}
                                                href="/auth/login">
                                            </CTALink>
                                        ) : (
                                            <>
                                                <div className="d-flex align-items-center my-3">
                                                    <FindInPageIcon fontSize="default" />
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
                        )}

                        <PaginateResults
                            totalPages={state.total}
                            limit={props.size}
                            pageCount={props.paginate}
                            currentPage={state.page}
                            handlePageChange={handlePageChange}
                        /> */}
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
