import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next-translate/Link';
import i18nConfig from '../../../i18n.json';
import useTranslation from 'next-translate/useTranslation';
import startsWithLang from 'next-translate/_helpers/startsWithLang';
import Button from '@material-ui/core/Button';
import { Menu, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/styles';

import customColors from 'theme/palette'

const useStyles = makeStyles(() => ({
  button: {
    whiteSpace: 'nowrap',
    background: customColors.gradient.main,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    display: 'flex',
    padding: 0,
    minWidth: 'auto',
    '&:hover': {
      opacity: 0.8,
    },
  },
  arrowDown: {
    fontSize: '26px',
    lineHeight: 1,
    marginTop: -10,
  },
}));

const DropdownSwitchLang = () => {
  const classes = useStyles();
  const router = useRouter();
  const { allLanguages, allLanguagesLabel } = i18nConfig;
  const { lang } = useTranslation();
  const replaceLang = (href) =>
    startsWithLang(href, allLanguages)
      ? href
          .split('/')
          .filter((part) => part !== lang)
          .join('/') || '/'
      : href;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button className={classes.button} aria-controls="language-menu" aria-haspopup="true" onClick={handleClick}>
        文A{' '}
        <span className={classes.arrowDown}>
          <ExpandMoreIcon
            style={{
              position: 'relative',
              top: 3,
              fontSize: '20px',
              color: '#9e6ffa',
            }}
          />
        </span>
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {allLanguages &&
          allLanguages.map((lng, index) => {
            if (lng === lang) return null;
            return (
              <MenuItem key={index} onClick={handleClose}>
                <Link href={replaceLang(router.asPath)} prefetch={false} lang={lng}>
                  <a>{allLanguagesLabel[lng]}</a>
                </Link>
              </MenuItem>
            );
          })}
      </Menu>
    </>
  );
};

export default DropdownSwitchLang;
