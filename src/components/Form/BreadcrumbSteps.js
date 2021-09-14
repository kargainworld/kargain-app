import React, { memo } from 'react'
import clsx from 'clsx'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import makeStyles from '@material-ui/core/styles/makeStyles'
import customColors from '../../theme/palette'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles(()=>({
    breadcrumb: {
        '& ol': {
            backgroundColor: "#fff",
            marginTop: '10px',
            '& li + li::before': {    
                content: "'|' !important",
            }
        },
    },
    active:{
        backgroundColor: '#fff !important',
        padding: '0 0rem !important',
        borderRadius: '10px',
        color: '#ED80EB !important',
    }
  
}))

const BreadcrumbSteps = ({ steps, activeStepIndex, maxActiveStep, setStep }) => {
    const isMobile = useMediaQuery('(max-width:768px)')

	const classes = useStyles()
    return (
        <section id="header">
            {isMobile ? (
                <Breadcrumb id="breadcrumb" className={clsx('navigation-bar', classes.breadcrumb)} > 
                    {steps.length > 0 && steps.map((step, index) => {
                        return (
                            <BreadcrumbItem 
                                key={index}
                                active={index === activeStepIndex}
                                className={clsx(classes.slash, index <= activeStepIndex && 'valid')}
                                onClick={(e) => {
                                    if (index === activeStepIndex) e.preventDefault()
                                    // if (index <= maxActiveStep) setStep(index)
                                }}>
                                <a href="#" className={clsx('bread-link text', index <= activeStepIndex && classes.active)} style={{fontSize:'8.61714px', width:'25%'}} >
                                    {step.props.title}
                                </a>
                            </BreadcrumbItem>
                        )
                    })}
                </Breadcrumb>
            ) : (
                <Breadcrumb id="breadcrumb" className={clsx('navigation-bar', classes.breadcrumb)} > 
                    {steps.length > 0 && steps.map((step, index) => {
                        return (
                            <BreadcrumbItem 
                                key={index}
                                active={index === activeStepIndex}
                                className={clsx(classes.slash, index <= activeStepIndex && 'valid')}
                                onClick={(e) => {
                                    if (index === activeStepIndex) e.preventDefault()
                                    // if (index <= maxActiveStep) setStep(index)
                                }}>
                                <a href="#" className={clsx('bread-link text', index <= activeStepIndex && 'active')} >
                                    {step.props.title}
                                </a>
                            </BreadcrumbItem>
                        )
                    })}
                </Breadcrumb>
            )}
        
        </section>
    )
}

export default memo(BreadcrumbSteps)
