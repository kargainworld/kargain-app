import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useStyles } from './styles.js'
import { Col } from 'reactstrap'
import AdvancedFilters from '../Filters/Advanced/AdvancedFilters'
import Typography from '@material-ui/core/Typography'
import Sorters from '../Sorters/Sorters'
import useTranslation from 'next-translate/useTranslation'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const TabsItem = ({ activeTab, index, ...props }) => {
    return (
        <div id={props.id} className={clsx('tab-pane', 'fade',
            { show: index === activeTab },
            { active: index === activeTab },
            props.className)}>
            {props.children}
        </div>
    )
}

const Tabs = ({ updateFilters, defaultActive, active, children, id, handleClickTab, className, total, ...props  }) => {
    const classes = useStyles(props)
    const [activeTab, setActiveTab] = useState(defaultActive || 0)
    const tabs = !Array.isArray(children) ? [children] : children
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width:768px)')

    const [state1, setState] = useState({
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
        setActiveTab(+active)
    }, [active])

    const onClickTabItem = (index) => {
        setActiveTab(index)
        handleClickTab(index)
    }

    const updateSorter = (sorter) => {
        setState(state1 => ({
            ...state1,
            sorter
        }))
    }

    return (
        <section className={clsx("tabs", className)}>
            <ul className="nav nav-tabs m-2 justify-content-center" id={id}>

                {tabs && tabs.map((item, index) => {
                    if (!item) return null
                    const { title, img : ImgComponent, className } = item.props

                    return (
                        <li key={index}
                            className={clsx('nav-link', activeTab === index && classes.sliderborder, classes.slider)}
                            data-toggle="tab"
                            role="tab"
                            aria-selected={activeTab === index}
                            onClick={() => onClickTabItem(index)}>
                            {title && <label>{title}</label> }
                            {ImgComponent && ImgComponent }
                        </li>
                    )
                })}
            </ul>
            <>
                {isMobile ? (
                    <Col sm={12} md={12} id="section_1" style={{ transform:'translate(10px, 10px)' }}>
                        <AdvancedFilters updateFilters={updateFilters} className={classes.filters} />
                        <div style={{ marginTop:'10px' }}>
                            <Typography component="p" variant="h3" style={{ fontSize: '20px 1important', marginLeft:'5px' }}>
                                {t('vehicles:{count}_results_search', { count: total })}
                            </Typography>
                            <div style={{ marginBottom:'20px' }}>
                                <Sorters updateSorter={updateSorter} />
                            </div>

                        </div>
                    </Col>
                ) : (
                    <Col sm={12} md={12} id="section_1" style={{ transform:'translate(10px, 10px)' }}>
                        <AdvancedFilters updateFilters={updateFilters} className={classes.filters} />
                        <div style={{ marginTop:'35px' }}>
                            <Typography component="p" variant="h3" style={{ fontSize: '20px 1important', marginTop:'30px', marginLeft:'5px' }}>
                                {t('vehicles:{count}_results_search', { count: total })}
                            </Typography>
                            <div  style={{ marginTop: '-40px' }}>
                                <Sorters updateSorter={updateSorter} />
                            </div>
                        </div>
                    </Col>
                )}
            </>

            <div className="tab-content">
                {tabs && tabs.map((item, index) => {
                    return <TabsItem
                        key={index}
                        index={index}
                        activeTab={activeTab}
                        {...item.props}
                    />
                })}
            </div>
        </section>
    )
}

Tabs.Item = TabsItem

Tabs.propTypes = {
    defaultActiveIndex : PropTypes.number,
    handleClickTab : PropTypes.func
}

Tabs.defaultProps = {
    defaultActiveIndex : 0,
    handleClickTab : () => {}
}

export default Tabs
