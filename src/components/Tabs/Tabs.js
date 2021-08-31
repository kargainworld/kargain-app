import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles((theme) => ({
    slider:{
        border: "none",
        borderBottom: '3px solid #FE74F1',
        marginBottom: '-1px !important',
        color: '#FE74F1 !important',
        fountSize: '16px !important',
        textAlign: 'center',
        background: 'none',
        width: '33.33% !important',
        
    },
    sliderborder:{
        border: 'none !important',
        borderBottom: '3px solid #FE74F1 !important',
        // marginTop: '1px !important',
        color:'#FE74F1 !important',
        textAlign: 'center !important',
        background: 'none !important',
        fontSize: '16px !important',
        width:  '33.33% !important',
        
    }
}));

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

const Tabs = ({ defaultActive, active, children, id, handleClickTab, className }) => {
    const classes = useStyles()
    const [activeTab, setActiveTab] = useState(defaultActive || 0)
    const tabs = !Array.isArray(children) ? [children] : children

    useEffect(() => {
      setActiveTab(+active)
    }, [active])

    const onClickTabItem = (index) => {
        setActiveTab(index)
        handleClickTab(index)
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
