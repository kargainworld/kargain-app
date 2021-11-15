import React from 'react';
import Link from 'next-translate/Link';
import { Nav, Navbar } from 'reactstrap';
import useTranslation from 'next-translate/useTranslation';
import { makeStyles } from '@material-ui/core/styles';
import DropdownSwitchLangFlags from './Locales/DropdownSwitchLang';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Emoji } from 'react-apple-emojis';

const useStyles = makeStyles((theme) => ({
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 16,
    },
  },
  footerContainer: {
    marginBottom: 16,
  },
  link: {
    color: '#999999',
    fontWeight: 'normal',
    textDecoration: 'none !important',
    fontSize: '14px',
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
      <div className={classes.footerContainer}>
        <Navbar>
          <Nav navbar className={classes.footerLinks}>
            {isMobile && (
              <li key={'kargain-world-link'} className="mx-2" style={{ textAlign: 'center' }}>
                <Link href="https://kargain.world" prefetch={false}>
                  <a target="_blank" variant="text" style={{ color: '#2C6BFC', marginRight: '10px' }}>
                    <Emoji name="globe-with-meridians" width={13} />
                  </a>
                </Link>
              </li>
            )}
            {links &&
              links.map((link, index) => {
                return (
                  <li key={index} className="mx-2" style={{ textAlign: 'center' }}>
                    <Link href={link.link}>
                      <a className={classes.link}>{link.label}</a>
                    </Link>
                  </li>
                );
              })}

            <DropdownSwitchLangFlags dropdownStyle={{ top: 'unset', bottom: '-40px' }} />
          </Nav>
        </Navbar>
      </div>
    </footer>
  );
};

export default FooterLight;
