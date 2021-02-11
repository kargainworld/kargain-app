import React from 'react'
import { Button } from '@material-ui/core'

const CTAButton = ({ title, id, className, onClick, submit }) => (
    <Button
        id={id}
        variant="outlined"
        className={className}
        type={submit ? "submit" : "button"}
        onClick={onClick}>
        {title}
    </Button>
)

export default CTAButton
