import React from 'react'
import Link from 'next-translate/Link'
import { Button } from '@material-ui/core'

const CTALink = ({ href, icon: Icon, title, id, className }) => (
    <Link href={href} prefetch={false} passHref>
        <Button component="a" id={id} className={className} variant="outlined">
            {Icon && (
                <span className="mx-2">
                    <Icon />
                </span>
            )}

            {title}
        </Button>
    </Link>
)

CTALink.defaultProps = {
    href: '/'
}
export default CTALink
