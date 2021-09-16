import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from "@material-ui/styles"
import { Col } from 'reactstrap'
import AdvancedFilters from '../Filters/Advanced/AdvancedFilters'
import Typography from '@material-ui/core/Typography'
import Sorters from '../Sorters/Sorters'
import useTranslation from 'next-translate/useTranslation'

const useStyles = makeStyles((theme) => ({
    slider:{
        border: "none",
        borderBottom: '3px solid #FE74F1',
        marginBottom: '-1px !important',
        color: '#999999 !important',
        fountSize: '16px !important',
        textAlign: 'center',
        background: 'none',
        width: '33.33% !important'
        
    },
    sliderborder:{
        border: 'none !important',
        borderBottom: '3px solid #FE74F1 !important',
        // marginTop: '1px !important',
        color:'#FE74F1 !important',
        textAlign: 'center !important',
        background: 'none !important',
        fontSize: '16px !important',
        width:  '33.33% !important'
        
    },
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
    button: {
        margin: '1rem'
    }
}))

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

// const updateFilters = (filters) => {
//     setFilterState(filterState => ({
//         ...filterState,
//         filters: filters
//     }))
// }

const Tabs = ({ updateFilters, defaultActive, active, children, id, handleClickTab, className  }) => {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(defaultActive || 0)
    const tabs = !Array.isArray(children) ? [children] : children
    const { t } = useTranslation()


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

    const [filterState, setFilterState] = useState({
        loading: false,
        sorter: {},
        filters: {},
        page: 1,
        total: 0
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
                            // className={clsx('nav-link', className, {active: index && classes.navlink === activeTab }, classes.slider)}
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

            <Col sm={12} md={12} style={{ marginLeft: '-10px' }} id="section_1" style={{ transform:'translate(10px, 10px)' }}>
                <AdvancedFilters updateFilters={updateFilters} className={classes.filters} />
                <div style={{ marginTop:'35px' }}>
                    <Typography component="p" variant="h3" style={{ fontSize: '20px 1important', marginTop:'30px', marginLeft:'5px' }}>
                        {t('vehicles:{count}_results_search', { count: filterState.total })}
                    </Typography>
                    <div  style={{ marginTop: '-40px' }}>
                        <Sorters updateSorter={updateSorter} />
                    </div>
                </div>
            </Col>    
            
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
