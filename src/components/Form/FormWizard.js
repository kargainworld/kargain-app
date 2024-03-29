import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { ProgressBar } from 'react-step-progress-bar'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'
import ControlledStep from './ControlledStep'
import BreadcrumbSteps from './BreadcrumbSteps'
import useIsMounted from 'hooks/useIsMounted'
import DebugLocalStorage from '../DebugLocalStorage'
import { FormContext } from 'context/FormContext'
import { Emoji } from 'react-apple-emojis'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(() => ({
    div: {
        marginTop: '-10px',
        marginBottom: '40px',
        '& .RSPBprogressBar': {
            height: '6px !important'
        }
    }
}))

const calculatePercentage = (current, length) => {
    return ((current + 1) / (length + 1)) * 100
}

const Root = styled.main`
  max-width: 1140px;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
`

const FormWizard = ({ debug, formKey, onFinalSubmit, children }) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const isMounted = useIsMounted()
    const { t } = useTranslation()
    const steps = Array.isArray(children)
        ? children.filter((child) => child.props.hidden !== true)
        : children
            ? [children]
            : []
    const { formDataContext, dispatchFormUpdate } = useContext(FormContext)
    const [activeStep, setActiveStep] = useState(formDataContext.currentStep || 0)
    const [maxActiveStep, setMaxActiveStep] = useState(steps.length)
    const [percentage, setPercentage] = useState(() => calculatePercentage(activeStep, steps.length))
    const [endForm, setEndForm] = useState(false)
    const classes = useStyles()
    const setStep = useCallback((index) => {
        setActiveStep(index)
    }, [])

    const prevStep = useCallback(() => {
        setActiveStep((activeStep) => activeStep - 1)
    }, [])

    const nextStep = useCallback(() => {
        setActiveStep((activeStep) => activeStep + 1)
    }, [])

    const triggerDispatchFormData = (data) => {
        dispatchFormUpdate(data)
    }

    const onSubmitStep = useCallback((data) => {
        triggerDispatchFormData(data)
        nextStep()
    }, [])

    const handleSubmitForm = (data) => {
        triggerDispatchFormData(data)
        setEndForm(true)
    }

    useEffect(() => {
        dispatchFormUpdate({ vehicleType: formKey.toLowerCase() })
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
        if (isMounted) {
            setMaxActiveStep((maxStep) => Math.max(maxStep, Number(activeStep)))
            dispatchFormUpdate({ currentStep: activeStep })
            setPercentage(calculatePercentage(activeStep, steps.length))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep])

    useEffect(() => {
        if (isMounted && endForm) {
            onFinalSubmit(formDataContext)
            setEndForm(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endForm])
    
    return (
        <Root>
            <div className="formWizardContainer">
                {isMobile ? (
                    <div>
                        <BreadcrumbSteps
                            activeStepIndex={activeStep}
                            steps={steps}
                            setStep={setStep}
                            maxActiveStep={maxActiveStep}
                            style={{ marginTop: '-15px' }}
                        />
                        <div className={clsx(classes.div)}>
                            <ProgressBar percent={percentage} filledBackground="linear-gradient(to right, #699EF8, #ED80EB)" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <BreadcrumbSteps
                            activeStepIndex={activeStep}
                            steps={steps}
                            setStep={setStep}
                            maxActiveStep={maxActiveStep}
                        />
                        <ProgressBar percent={percentage} filledBackground="linear-gradient(to right, #699EF8, #ED80EB)" />
                    </div>
                )}
                {/* <Header as="h4" center={false} text={[t('layout:form'), t(`vehicles:${formKey.toLowerCase()}`)].join(' ')}/> */}

                <h4>
                    {/* <img src={`/icons/`+formKey.toLowerCase()+`-icon.png`} style={{marginRight: '15px', width: '20px', height: '27px', marginBottom: '8px'}}/> */}

                    <Emoji style={{ marginRight: '15px', marginBottom: '3px' }} name="automobile" width={18} />
                    {[t('layout:form'), t(`vehicles:${formKey.toLowerCase()}`)].join(' ')}
                </h4>
                <ControlledStep
                    step={steps[activeStep]}
                    onSubmitStep={onSubmitStep}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    handleSubmitForm={handleSubmitForm}
                />

                {debug && (
                    <Row>
                        <Col>
                            <div>
                                <h2> formContext </h2>
                                <pre>{JSON.stringify(formDataContext, null, 2)}</pre>
                            </div>
                        </Col>
                        <Col>
                            <DebugLocalStorage value="formData" />
                        </Col>
                    </Row>
                )}
            </div>
        </Root>
    )
}

FormWizard.propTypes = {
    formKey: PropTypes.string.isRequired,
    debug: PropTypes.bool,
    enableResume: PropTypes.bool
}

FormWizard.defaultProps = {
    formKey: '',
    debug: false,
    enableResume: false
}

export default FormWizard
