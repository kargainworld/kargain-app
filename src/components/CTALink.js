import React from 'react'
import Link from 'next-translate/Link'
import { Button } from '@material-ui/core'


const CTALink = ({ href, icon: Icon, title, id, className, variant, color, style }) => (
    <Link href={href} prefetch={false} passHref>
        <Button style={style} component="a" id={id} className={className} color={color} variant={variant || 'outlined'}>
            {Icon && (
                <span className="mx-2">
                    <Icon />
                </span>
            )}
            {/* <NewIcons.recycle /> */}
            {title}
        </Button>
    </Link>
)

CTALink.defaultProps = {
    href: '/'
}
export default CTALink
