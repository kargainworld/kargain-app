import React from 'react'
import clsx from 'clsx'
import Link from 'next-translate/Link'
import { Nav, Navbar } from 'reactstrap'
import useTranslation from 'next-translate/useTranslation'
import { makeStyles } from '@material-ui/core/styles'
import DropdownSwitchLangFlags from './Locales/DropdownSwitchLang'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { Emoji } from 'react-apple-emojis'

const useStyles = makeStyles((theme) => ({
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row!important',

        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column!important'
        }
    },

    link: {
        color: '#999999',
        fontWeight: 'normal',
        paddingRight : '10px',
        textDecoration: 'none !important'
    }
}))

const FooterLight = () => {
    
    const isMobile = useMediaQuery('(max-width:768px)')
    const { t } = useTranslation()
    const classes = useStyles()
    const links = [
        {
            label: t('layoutC:about-us'),
            link: '/static/about'
        },
        {
            label: t('layoutC:confidentiality'),
            link: '/static/confidentiality'
        },
        {
            label: t('layoutC:terms'),
            link: '/static/conditions'
        }
    ]

    return (
        <footer>
            <div className="container">
                <Navbar>
                {isMobile ?( 
                    <div style={{display:'flex'}}>
                    <Nav navbar >  
                        <Link
                            href="https://kargain.world"
                            prefetch={false}>
                            <a target="_blank" variant="text" style={{color: "#2C6BFC", marginRight:'10px' }}>
                                <Emoji name="globe-with-meridians" width={13} />
                            </a>
                        </Link>
                        {links && links.map((link, index) => {
                            return (
                                <li key={index} >
                                    <Link href={link.link}>
                                        <a className={classes.link} style={{fontSize:'14px'}}>{link.label}</a>
                                    </Link>
                                </li>
                            )
                        })}

                        <DropdownSwitchLangFlags dropdownStyle={{top : 'unset', bottom : '-40px'}}/>
                    </Nav>
                    </div>
                ) : ( 
                    <>
                    <Nav navbar className={clsx(classes.footerLinks, 'my-2', 'py-2', 'mx-auto')}>
                        {links && links.map((link, index) => {
                            return (
                                <li key={index} className="mx-2">
                                    <Link href={link.link}>
                                        <a className={classes.link}>{link.label}</a>
                                    </Link>
                                </li>
                            )
                        })}
                        <DropdownSwitchLangFlags dropdownStyle={{ top : 'unset', bottom : '-40px' }}/>
                    </Nav>
                    </>
                )}
                </Navbar>
            
            </div>
        </footer>
    )
}

export default FooterLight
