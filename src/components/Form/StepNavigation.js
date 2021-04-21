import React from 'react'
import { Row } from 'reactstrap'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import useTranslation from 'next-translate/useTranslation'


const StepNavigation = ({ prev, prevLabel, next, nextLabel, submit, submitLabel, ...defaultProps }) => {
    const {defaultPrevLabel, defaultNextLabel, defaultSubmitLabel } = defaultProps
    const { t } = useTranslation()

    return (
        <Row className="form_navigation justify-content-around" style={{ marginTop: 30 }}>

            {prev && (
                <Button variant="outlined" type="button" onClick={() => prev()}>
                    {prevLabel || t(`vehicles:${defaultPrevLabel}`)}
                </Button>
            )}

            {next && !submit && (
                <Button variant="outlined" type="button" onClick={e => next(e)}>
                    {nextLabel || t(`vehicles:${defaultNextLabel}`)}
                </Button>
            )}

            {!next && submit && (
                <Button variant="contained" color="primary" type="submit">
                    {submitLabel || t(`vehicles:${defaultSubmitLabel}`)}
                </Button>
            )}

        </Row>
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
