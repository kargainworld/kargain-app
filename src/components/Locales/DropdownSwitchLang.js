import React, { useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Link from 'next-translate/Link'
import i18nConfig from '../../../i18n.json'
import useTranslation from 'next-translate/useTranslation'
import startsWithLang from 'next-translate/_helpers/startsWithLang'
import Button from "@material-ui/core/Button";
import {Menu, MenuItem} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  button: {
      background: '-webkit-linear-gradient(180deg, #DB00FF 0%, #5200FF 100%)',
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      display: 'flex',

      '&:hover': {
        opacity: 0.8
      }
  },
  arrowDown: {
    fontSize: '26px',
    lineHeight: 1,
    marginTop: -10
  }
}))

const DropdownSwitchLang = ({dropdownStyle}) => {
    const classes = useStyles()
    const router = useRouter()
    const { allLanguages, allLanguagesLabel } = i18nConfig
    const { lang } = useTranslation()
    const [open, setOpen] = useState(false)
    const replaceLang = href => startsWithLang(href, allLanguages)
        ? href.split('/').filter(part => part !== lang).join('/') || '/'
        : href
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
      <div>
          <Button
            className={classes.button}
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            文A {' '}
              <span className={classes.arrowDown}>
                <ExpandMoreIcon
                    style={{
                        position: "relative",
                        top: 3,
                        fontSize: "20px",
                        color: '#9e6ffa'
                    }}
                />
              </span>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
              {allLanguages && allLanguages.map((lng, index) => {
                  if (lng === lang) return null
                  return (
                      <MenuItem key={index} onClick={handleClose}>
                          <Link
                            href={replaceLang(router.asPath)}
                            prefetch={false}
                            lang={lng}
                          >
                            <a>{allLanguagesLabel[lng]}</a>
                          </Link>
                      </MenuItem>
                  )
              })}
          </Menu>
      </div>
    );

    return (
        <li className="nav-item navbar-dropdown p-2" data-dropdown="dropdownLocale">
            <span className="dropdown-toggler rounded-circle" onClick={() => setOpen(open => !open)}
                style={{ width: '30px' }}> {allLanguagesLabel[lang]}
                <i className={clsx('ml-2', 'arrow_nav', open ? 'is-bottom' : 'is-top')}/>
            </span>
            <ul
                id="dropdownLocale"
                className={clsx('dropdown', open && 'show')}
                style={{ minWidth: 'unset', ...dropdownStyle}}>
                {allLanguages && allLanguages.map((lng, index) => {
                    if (lng === lang) return null
                    return (
                        <li key={index} className="px-0 dropdown-item">
                            <Link
                                href={replaceLang(router.asPath)}
                                prefetch={false}
                                lang={lng}>
                                <a className="nav-link text-left">
                                    <div className="dropdown-toggler" onClick={() => setOpen(open => !open)}>
                                        <span> {allLanguagesLabel[lng]} </span>
                                    </div>
                                </a>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </li>
    )
}


export default DropdownSwitchLang
