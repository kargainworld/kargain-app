import React, { memo } from 'react'
import clsx from 'clsx'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'
import makeStyles from '@material-ui/core/styles/makeStyles'
import customColors from '../../theme/palette'

const useStyles = makeStyles(()=>({
	button: {
		border: "none !important",
		padding: '6px 2rem',
		borderRadius: '20px',
		color: 'white',
		fontSize: '14px',
		fontWeight: 'bold',
		background: customColors.gradient.main
	},
    breadcrumb: {
        '& ol': {
            backgroundColor: "#fff",
            marginTop: '10px',
            '& li + li::before': {    
                content: "'|' !important",
            }
        },
    },
  
}))

const BreadcrumbSteps = ({ steps, activeStepIndex, maxActiveStep, setStep }) => {
    
	const classes = useStyles()
    return (
        <section id="header">
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
        </section>
    )
}

export default memo(BreadcrumbSteps)
