import React, { memo } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import NiceSelect from 'react-select'
import { useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import useTranslation from 'next-translate/useTranslation'

import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
    navlink:{
        border: 'none !important',
        borderBottom: '3px solid #FE74F1 !important',
        // marginTop: '1px !important',
        color:'#FE74F1 !important',
        textAlign: 'center !important',
        background: 'none !important',
        fontSize: '16px !important',
        width: '100% !important',
        '& :hover': {
            color:'#FE74F1 !important'
        }
    }
}))

const DamagesNav = ({ activeTab, setActiveTab, damagesTabs }) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const isUpTablet = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true
    })
    const classes = useStyles()

    return (
        <div className="annoNav">
            {isUpTablet ? (
                <ul className="nav nav-tabs">
                    {damagesTabs.map((tab, indexTab) => {
                        return (
                            <li key={indexTab} className={clsx('nav-item')} style={{ width:'358px' }}>
                                <a className={clsx('nav-link', activeTab === indexTab && classes.navlink)}
                                    style={{ fontSize:'16px', width: '100%' }}
                                    onClick={() => {
                                        setActiveTab(indexTab)
                                    }}>
                                    {t(`vehicles:${tab.key}`)}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <NiceSelect
                    options={damagesTabs.map((tab, index) => ({
                        value: index,
                        label: `${t(`vehicles:${tab.key}`)} (${tab.countStages})`
                    }))}
                    onChange={({ value }) => {
                        setActiveTab(value)
                    }}

                />
            )}
        </div>
    )
}

DamagesNav.propTypes = {
    activeTab: PropTypes.number.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    damagesTabs: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        countStages: PropTypes.number
    }))
}

DamagesNav.defaultProps = {
    activeTab : 0,
    damagesTabs : []
}
export default memo(DamagesNav)

