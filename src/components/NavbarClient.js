import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { Input } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import clsx from 'clsx'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import { Collapse, Container,  Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import ChatIcon from '@material-ui/icons/Chat'
import DashboardIcon from '@material-ui/icons/Dashboard'
import SearchIcon from '@material-ui/icons/Search'
import HomeIcon from '@material-ui/icons/Home'
import CloseIcon from '@material-ui/icons/Close'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import SettingsIcon from '@material-ui/icons/Settings'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import FaceIcon from '@material-ui/icons/Face'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import IconButton from '@material-ui/core/IconButton'
import { getLogo } from '../libs/utils'
import { useAuth } from '../context/AuthProvider'
import NotificationsNav from '../components/Notifications/NotificationsNav'
import CTALink from './CTALink'

import { SearchContext } from '../context/SearchContext'
import { ClickAwayListener } from "@material-ui/core"

const Root = styled.header`
  
`

const SearchInput = styled(Input)(({ theme }) => `
  width: 100% !important;
  max-width: 250px;
  
  input {
    padding-right: 30px;
  }
  
  ${theme.breakpoints?.down('md')} {
    width: 200px
  }
`)

const SearchInputContainer = styled.div`
    position: relative;
    
  svg {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.3;
  }
`

const NavbarClient = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleNavbar = () => setIsOpen(!isOpen)
    const { isAuthenticated } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')

    return (
        <Root className="header">
            <Container>
                <Navbar light expand="md" className="navbar position-relative">
                    <NavbarBrand href="/">
                        <img src={getLogo()} width="150" alt="logo"/>
                    </NavbarBrand>
                    <NavbarToggler
                        className="m-2"
                        onClick={toggleNavbar}
                    />
                    <Collapse isOpen={isOpen} navbar>
                        {(!isMobile || isOpen) && (
                            <>
                                {isMobile ? (
                                    <div className={clsx("sidebar", isOpen && 'open')}>
                                        <div className="sidebar_controls">
                                            <Button
                                                startIcon={<CloseIcon/>}
                                                onClick={toggleNavbar}
                                            />
                                        </div>
                                        {isAuthenticated ? <LoggedInUserNav vertical/> : <VisitorNav vertical/>}
                                        <NavbarAction vertical={true}/>
                                    </div>
                                ) : (
                                    <div className={clsx("d-flex", "navbar-menu")}>
                                        <NavbarAction/>
                                        {isAuthenticated ? <LoggedInUserNav/> : <VisitorNav/>}
                                    </div>
                                )}
                            </>
                        )}
                    </Collapse>

                    <NavItem className="p-2" style={{ listStyle: 'none' }}>
                        <NewAdButtonCTAStyled isDesktop={!isMobile}/>
                    </NavItem>
                </Navbar>
            </Container>
        </Root>
    )
}

const NewAdButtonCTA = ({ isDesktop, className }) => {
    const { t } = useTranslation()

    return (
        <CTALink
            title={isDesktop && t('layout:create-announce')}
            icon={!isDesktop && AddIcon}
            href="/deposer-une-annonce"
            className={className}
            variant="contained"
            color="primary"
        />
    )
}

const NewAdButtonCTAStyled = styled(NewAdButtonCTA)`
  border-radius: 5px;
  border: 1px solid #000 !important;
  background-color: #000;
  color: #fff;

  .header &:hover {
    background-color: #fff;
    color: #000 !important;
  }
`

const NavbarAction = ({ vertical }) => {
    const { t } = useTranslation()
    const { dispatchSearchQuery } = useContext(SearchContext)

    const [searchQuery, setSearchQuery] = useState('')

    const onSubmitSearch = (event) => {
        event.preventDefault();
        if (searchQuery) {
            dispatchSearchQuery(searchQuery)
        }
    }

    return (
        <Nav navbar className={clsx("my-2", vertical ? "flex-column" : "flex-row-nav")}>
            <NavItem className="p-2">
                <form className="search-form" onSubmit={onSubmitSearch}>
                    <SearchInputContainer>
                        <SearchInput
                          value={searchQuery}
                          onChange={({ target }) => setSearchQuery(target.value)}
                          name="query"
                          type="search"
                          placeholder={t('layout:search')}
                          iconright={<Search />}
                        />
                        <SearchIcon />
                    </SearchInputContainer>

                    <button
                        type="submit"
                        className="search-button">
                        <SearchIcon/>
                    </button>
                </form>
            </NavItem>
        </Nav>
    )
}

const DropdownUser = ({ isOpen, keyName, toggle }) => {
    const { authenticatedUser, logout } = useAuth()
    const { t } = useTranslation()

    return (
        <li className="nav-item navbar-dropdown">
            <IconButton color="inherit"
                data-toggle="dropdownUser"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => toggle(keyName)}>
                <PermIdentityIcon/>
            </IconButton>

            <ul className={clsx('dropdown', isOpen && 'show')} id="dropdownUser">
                {authenticatedUser.getIsAdmin && (
                    <li className="px-0 dropdown-item">
                        <Link href={`/admin/ads`} prefetch={false}>
                            <a className="nav-link text-left"><DashboardIcon/><span className="m-1">Admin</span></a>
                        </Link>
                    </li>
                )}
                <li className="px-0 dropdown-item">
                    <Link href={`${authenticatedUser.getProfileLink}?activeTab=2`} prefetch={false}>
                        <a className="nav-link text-left"><BookmarkIcon/>
                            <span className="m-1">
                                {t('layout:favorites')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href={authenticatedUser.getProfileLink} prefetch={false}>
                        <a className="nav-link text-left"><FaceIcon/>
                            <span className="m-1">
                                {t('layout:my-profile')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href="/profile/messages" prefetch={false}>
                        <a className="nav-link text-left"><ChatIcon/>
                            <span className="m-1">
                                {t('layout:messaging')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href={authenticatedUser.getProfileEditLink} prefetch={false}>
                        <a className="nav-link text-left"><SettingsIcon/>
                            <span className="m-1">
                                {t('layout:settings')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href="" prefetch={false}>
                        <a className="nav-link text-left" onClick={() => logout()}>
                            <ExitToAppIcon/>
                            <span className="m-1">
                                {t('layout:logout')}
                            </span>
                        </a>
                    </Link>
                </li>
            </ul>
        </li>
    )
}

const LoggedInUserNav = ({ vertical }) => {
    const [state, setState] = useState({
        isOpen1: false,
        isOpen2: false
    })

    const toggle = (toggled) => {
        setState(state => ({
            ...Object.keys(state)
                .filter(key => key !== toggled)
                .reduce((carry, key) => ({
                    ...carry,
                    [key]: false
                }), state),
            [toggled]: !state[toggled]
        }))
    }

    const closeAll = () => setState({
        isOpen1: false,
        isOpen2: false
    })

    return (
        <ClickAwayListener onClickAway={closeAll}>
            <div style={{ marginLeft: 'auto' }}>
                <Nav navbar className={clsx("my-2", "justify-content-center", vertical ? "flex-column" : "flex-row-nav")}>
                    <NavItem>
                        <Link href="/feed" prefetch={false}>
                            <a>
                                <IconButton color="inherit">
                                    <HomeIcon/>
                                </IconButton>
                            </a>
                        </Link>
                    </NavItem>
                    <NotificationsNav isOpen={state.isOpen1} keyName="isOpen1" toggle={toggle}/>
                    <DropdownUser isOpen={state.isOpen2} keyName="isOpen2" toggle={toggle}/>
                </Nav>
            </div>
        </ClickAwayListener>
    )
}

const VisitorNav = ({ vertical }) => {
    const { t } = useTranslation()

    return (
        <Nav navbar className={clsx("my-2", vertical ? "flex-column" : "flex-row-nav")}>
            <NavItem className="p-2">
                <Link href="/auth/login" prefetch={false}>
                    <a className="nav-link py-0">
                        {t('layout:login')}
                    </a>
                </Link>
            </NavItem>
            <NavItem className="p-2">
                <Link href="/auth/register" prefetch={false}>
                    <a className="nav-link py-0">
                        {t('layout:register')}
                    </a>
                </Link>
            </NavItem>
        </Nav>
    )
}

export default NavbarClient
