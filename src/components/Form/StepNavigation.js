import React from 'react'
import { Row } from 'reactstrap'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import useTranslation from 'next-translate/useTranslation'

import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import customColors from '../../theme/palette'

import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles(() => ({
		button: {
			border: "none !important",
			padding: '6px 2rem',
			borderRadius: '20px',
			color: 'white',
			fontSize: '14px',
			fontWeight: "bold",
            height:'33px',
            marginLeft:'10px',
			background: customColors.gradient.main
            
		},
		
	}))

const StepNavigation = ({ prev, prevLabel, next, nextLabel, submit, submitLabel, ...defaultProps }) => {
    const {defaultPrevLabel, defaultNextLabel, defaultSubmitLabel } = defaultProps
    const { t } = useTranslation()
    const classes = useStyles()
	const isMobile = useMediaQuery('(max-width:768px)')

    return (
        <>
            {isMobile ? (
                <Row className="form_navigation justify-content-around" style={{ marginTop: 30 }}>
                    <div style={{width:'80%'}}>
                        {prev && (
                            <Button variant="outlined" type="button" className={clsx("btn", classes.button)} onClick={() => prev()}>
                                {prevLabel || t(`vehicles:${defaultPrevLabel}`)}
                            </Button>
                        )}

                        {next && !submit && (
                            <Button variant="outlined" type="button" className={clsx("btn", classes.button)} onClick={e => next(e)}>
                                {nextLabel || t(`vehicles:${defaultNextLabel}`)}
                            </Button>
                        )}

                        {!next && submit && (
                            <Button variant="contained" color="primary" className={clsx("btn", classes.button)} type="submit">
                                {submitLabel || t(`vehicles:${defaultSubmitLabel}`)}
                            </Button>
                        )}
                    </div>
                </Row>
    
                ):(
                    <Row className="form_navigation justify-content-around" style={{ marginTop: 30 }}>
                        {prev && (
                            <Button variant="outlined" type="button" className={clsx("btn", classes.button)} onClick={() => prev()}>
                                {prevLabel || t(`vehicles:${defaultPrevLabel}`)}
                            </Button>
                        )}

                        {next && !submit && (
                            <Button variant="outlined" type="button" className={clsx("btn", classes.button)} onClick={e => next(e)}>
                                {nextLabel || t(`vehicles:${defaultNextLabel}`)}
                            </Button>
                        )}

                        {!next && submit && (
                            <Button variant="contained" color="primary" className={clsx("btn", classes.button)} type="submit">
                                {submitLabel || t(`vehicles:${defaultSubmitLabel}`)}
                            </Button>
                        )}
                        
                    </Row>
                
                )
            }
        </>
        
    )
}

StepNavigation.propTypes = {
    prev: PropTypes.func,
    next: PropTypes.func
}

StepNavigation.defaultProps = {
    defaultPrevLabel: 'previous',
    defaultNextLabel: 'following',
    defaultSubmitLabel: 'following'
}

export default StepNavigation
