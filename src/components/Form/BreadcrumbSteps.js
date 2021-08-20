import React, { memo } from 'react'
import clsx from 'clsx'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap'

const BreadcrumbSteps = ({ steps, activeStepIndex, maxActiveStep, setStep }) => {
    return (
        <section id="header" style={{backgroundColor: "white"}}>
            <Breadcrumb id="breadcrumb" className="navigation-bar" style={{backgroundColor: "white"}}>
                
                {steps.length > 0 && steps.map((step, index) => {
                    return (
                        <BreadcrumbItem
                            style={{backgroundColor: "white"}}
                            key={index}
                            active={index === activeStepIndex}
                            className={clsx(index <= activeStepIndex && 'valid')}
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
