import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { Col, Row, TabContent, TabPane } from 'reactstrap'
import makeStyles from '@material-ui/core/styles/makeStyles'
import DamagesNavResponsive from './DamagesNavResponsive'
import toggleVehicleDamagesTabs from './ToggleVehicleDamagesTabs'

import { NewIcons } from 'assets/icons'
import { Emoji } from 'react-apple-emojis'

import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles(() => ({
    annoInputs: {
        backgroundColor: '#ffffff00',
        // border: '1px solid gainsboro',
        textAlign: 'left',
        marginTop: '2rem',
        overflowX: 'auto'
    },

    annoContainer: {
        display: 'flex',
        justifyContent: 'center',
        userSelect: 'none',
        position: 'relative',
        maxWidth: '500px'
    },

    annoStage: {
        position: 'relative',
        width: '100%',
        marginTop: '1rem'
    },

    annoImg: {
        objectFit: 'contain',
        width: '100%',
        border: '1px solid'
    },

    annoInput: {
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'center',
        margin: '.6rem .4rem'
    },

    annoFloatingNumber: {
        position: 'absolute',
        cursor: 'default',
        marginLeft: '-.5rem',
        marginTop: '-.5rem'
    },

    annoNumber: {
        backgroundColor: '#A291F3',
        color: '#fff',
        fontSize: '.8rem',
        lineHeight: '1.4rem',
        fontWeight: 'bold',
        textAlign: 'center',
        borderRadius: '50%',
        width: '1.4rem',
        height: '1.4rem',
        display: 'inline-block'
    },

    annoInputField: {
        backgroundColor:'#ffffff00 !important'
    },

    annoh5tag:{
        '& h5':{
            display:'none'
        }
    },

    nav_fontcolor:{
        '& nav-link':{
            color: '#999999'
        }
    }    

}))

const DamageViewerTabs = ({ vehicleType, tabs }) => {
    
    const isMobile = useMediaQuery('(max-width:768px)')
    const classes = useStyles()

    const warningDamageRef = useRef(null)
    const [activeTab, setActiveTab] = useState(0)
    const [damagesTabs, setDamagesTabs ] = useState([])
    let annoRefs = []

    useEffect(()=>{
        const p = toggleVehicleDamagesTabs(vehicleType, tabs)
            .filter(tab => tab.display)
            .map(tab => ({
                key: tab.key,
                countStages: tab.stages.length
            }))
        setDamagesTabs(p)
    },[vehicleType,tabs])
    
    return (
        <section className="anno">

            {isMobile ? (
                <div className={clsx(classes.nav_fontcolor)}>
                    <DamagesNavResponsive
                        {...{
                            damagesTabs,
                            activeTab,
                            setActiveTab
                        }}
                    />
                </div>
            ) : (
                <DamagesNavResponsive
                    {...{
                        damagesTabs,
                        activeTab,
                        setActiveTab
                    }}
                />
            )}
            

            <TabContent ref={warningDamageRef} activeTab={activeTab}>
                {Object.keys(tabs).map((key, index) => {
                    const tab = tabs[key]

                    return (
                        <TabPane key={index} tabId={index}>
                            {isMobile ? (
                                <Row>
                                    <Col md={6} className={clsx(classes.annoh5tag)}>
                                        <DamagesList tab={tab}/>
                                    </Col>
                                    <Col md={6}>
                                        <DamagesMappedImg {...{ index, tab, annoRefs }}/>
                                    </Col>
                                </Row>
                            ):( 
                                <Row>
                                    <Col md={6}>
                                        <DamagesMappedImg {...{ index, tab, annoRefs }}/>
                                    </Col>
                                    <Col md={6}>
                                        <DamagesList tab={tab}/>
                                    </Col>
                                </Row>
                            )}
                            
                        </TabPane>
                    )
                })}
            </TabContent>
        </section>
    )
}

const DamagesMappedImg = ({ tab, index, annoRefs }) => {
    const classes = useStyles()
    return (
        <div className={clsx(classes.annoContainer)}>
            <div className={clsx(classes.annoStage)}
                id={`anno_${index}`}
                ref={annoRef => annoRefs[index] = annoRef}
            >
                <img className={clsx(classes.annoImg)} src={tab.img} alt={tab.alt}/>

                {tab.stages && tab.stages.map((stage, index) => (
                    <span key={index}
                        style={{ ...stage.position }}
                        className={clsx(classes.annoFloatingNumber, classes.annoNumber)}>
                        {index + 1}
                    </span>
                ))}
            </div>
        </div>
    )
}

const DamagesList = ({ tab }) => {
    const classes = useStyles()
    const { t } = useTranslation()
    return (
        <div className={clsx(classes.annoInputs)}>
            
            <h5 style={{ fontSize:'16px !important', marginLeft:'10px' }}><Emoji style={{ marginRight:"10px", marginBottom:"3px" }} name="cross-mark" width={12} />  {t('vehicles:damages')} :</h5>
            {tab.stages && tab.stages.map((stage, index) => {
                return (
                    <div key={index} className={classes.annoInput}>
                        <div style={{ width: '90px' }}>
                            <NewIcons.recycle style={{ marginRight:'15px', with:"18px" }}/>
                            <span className={clsx(classes.annoNumber)}>{index + 1}</span>
                        </div>
                        
                        <input type="text"
                            readOnly
                            value={stage.text}
                            className={clsx(classes.annoInputField, 'form-control form-control-sm')}
                            name={`annotation_${index + 1}`}
                            placeholder={t('vehicles:damages-{number}-description', { number : index + 1 })}

                        />
                    </div>
                )
            })}
        </div>
    )
}

DamageViewerTabs.propTypes = {
    vehicleType: PropTypes.string.isRequired
}

DamageViewerTabs.defaultProps = {
    tabs : [],
    vehicleType : 'car'
}

export default DamageViewerTabs
