import React from 'react';
import Link from 'next-translate/Link';
import { Nav, Navbar, NavItem } from 'reactstrap';
import useTranslation from 'next-translate/useTranslation';
import { makeStyles } from '@material-ui/core/styles';
import DropdownSwitchLangFlags from './Locales/DropdownSwitchLang';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Emoji } from 'react-apple-emojis';

const useStyles = makeStyles((theme) => ({
  footerLinks: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 16,
    },
  },
  link: {
    color: '#999999',
    fontWeight: 'normal',
    textDecoration: 'none !important',
    fontSize: '14px',
  },
  navItem: {
    marginRight: '10px',
    textAlign: 'center',
  },
}));

const FooterLight = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const { t } = useTranslation();
  const classes = useStyles();
  const links = [
    {
      label: t('layoutC:about-us'),
      link: '/static/about',
    },
    {
      label: t('layoutC:confidentiality'),
      link: '/static/confidentiality',
    },
    {
      label: t('layoutC:terms'),
      link: '/static/conditions',
    },
  ];

  return (
    <footer>
      <Nav navbar className={classes.footerLinks}>
        {isMobile && (
          <NavItem className={classes.navItem}>
            <Link href="https://kargain.world" prefetch={false}>
              <a target="_blank" variant="text" style={{ color: '#2C6BFC' }}>
                <Emoji name="globe-with-meridians" width={13} />
              </a>
            </Link>
          </NavItem>
        )}
        {links &&
          links.map((link, index) => {
            return (
              <NavItem className={classes.navItem}>
                <Link href={link.link}>
                  <a className={classes.link}>{link.label}</a>
                </Link>
              </NavItem>
            );
          })}
        <NavItem>
          <DropdownSwitchLangFlags />
        </NavItem>
      </Nav>
    </footer>
  );
};

export default FooterLight;
