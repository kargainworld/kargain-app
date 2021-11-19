import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Input } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import clsx from 'clsx'
import Link from 'next-translate/Link'
import useTranslation from 'next-translate/useTranslation'
import { Collapse, Container,  Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap'
import Button from '@material-ui/core/Button'
import LanguageIcon from '@material-ui/icons/Language'
import AddIcon from '@material-ui/icons/Add'
import { Emoji } from 'react-apple-emojis'

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
import { useAuth } from '../context/AuthProvider'
import NotificationsNav from '../components/Notifications/NotificationsNav'
import CTALink from './CTALink'

import { SearchContext } from '../context/SearchContext'
import { ClickAwayListener } from "@material-ui/core"
import AutocompleteDropdown from '../components/Search/AutoSearchDropdown'
import Metamask from './Wallet/Metamask'

import { NewIcons } from '../assets/icons';
import makeStyles from '@material-ui/core/styles/makeStyles'
import customColors from '../theme/palette'

const useStyles = makeStyles(() => ({
   btn_header_mobile:{
       marginRight:'-25px',
       '& .m-2':{
           borderColor: 'white !important'
       },
       '& span':{
           width:'24px',
           height:'24px'
       },
       '& button':{
           width:'30px',
           height:'30px'
       }
   },

   SearchHidden:{
       display:'block'
   },

   Searchcustom:{
       '& span':{
           display:'none',
       },
       '& fieldset':{
           borderColor:'#ffffff !important'
       }
   },

   btnClose:{
        border: "none !important",
        // padding: '1px 1px',
        width:'19px',
        height:'19px',
        borderRadius: '25px',
        color: 'white',
        background: customColors.gradient.main,
   },

   removeMark:{
       '& li':{
            listStyleType: 'none'
       }
   }

   


}))

const Root = styled.header`
  position: sticky;
  padding: 10px 0 12px 0;
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
    const classes = useStyles()
    const [isOpen, setIsOpen] = useState(false)
    const toggleNavbar = () => setIsOpen(!isOpen)    
    const router = useRouter()
    const { authenticatedUser, logout } = useAuth()
    const { t } = useTranslation()

    const [state, setState] = useState({
        isOpen1: false,
        isOpen2: false,
        isSOpen: false
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
        isOpen2: false,
        isSOpen: false
    })


    const [isSOpen, setIsSOpen] = useState(false)
    const toggleSearch = () => {
        setIsSOpen((isSOpen) => !isSOpen);
    };

    const { isAuthenticated } = useAuth()
    const isMobile = useMediaQuery('(max-width:768px)')
    return (
        <Root className="header">
            <Container>
                <Navbar light expand="md" className="navbar position-relative">
                    <NavbarBrand href="/">
                        <NewIcons.logo width="150" alt="logo" />
                    </NavbarBrand>
                    <div style={{display:'flex', marginRight:'15px'}}>
                        {isMobile && 
                            <div style={{width:'30px', height:'30px', marginTop:'13px', marginRight:'-10px'}} 
                            onClick={() => toggleSearch()}>
                                <SearchIcon style={{color:'#999999'}}/>
                            </div>
                        }
                        <div className={clsx(classes.btn_header_mobile)}>
                            <NavbarToggler
                                className="m-2"
                                onClick={toggleNavbar}
                            />
                        </div>  
                    </div>
                    {(!isMobile || isSOpen) && (
                        <>
                        {isMobile && (
                            <div className={clsx(isSOpen && classes.SearchHidden)}>
                                <div className={clsx("sidebar", isSOpen && 'open')} style={{display:'flex', width:'100%', height:'auto', borderColor:'white'}}>
                                    <div style={{width:'90%', display:'flex'}}>
                                        <SearchIcon style={{ color:'#2C65F6', width:'24px', height:'24px', marginTop:'8px', marginLeft:'15px'}}/>
                                        <div className={clsx(classes.Searchcustom)} style={{marginTop:'-7px', marginBottom:'12px'}}>
                                            <AutocompleteDropdown />
                                        </div>
                                    </div>
                                    <div className="sidebar_controls" style={{width:'10%'}}>
                                        <div className={clsx(classes.btnClose)} onClick={() => toggleSearch()} style={{marginTop:'9px', marginRight:'15px'}}>
                                            <CloseIcon style={{color:'white', width:'15px', height:'15px', marginTop:'-5.55px', marginLeft:'2px'}}/>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                        )}
                        </>
                    )}
                            
                    <Collapse isOpen={isOpen} navbar>
                        {(!isMobile || isOpen) && (
                            <>
                                {isMobile ? (
                                    <>
                                    
                                    <div className={clsx("sidebar", isOpen && 'open')} style={{width:'100%'}}>
                                        <NavbarBrand href="/" style={{marginLeft:'35px'}}>
                                            <NewIcons.logo width="150" alt="logo" />
                                        </NavbarBrand>
                                        <div className="sidebar_controls" style={{marginTop: '-45px', marginBottom: '25px'}}>
                                            <Button
                                                startIcon={<CloseIcon/>}
                                                onClick={toggleNavbar}
                                            />
                                        </div>
                                        {isAuthenticated ? (
                                                <>
                                                    {/* <div >
                                                        <LoggedInUserNav vertical/> 
                                                    </div> */}

                                        

                                                    <li className="px-0 dropdown-item" style={{padding: '0px', marginLeft: '5px', marginBottom: '-2px'}}>
                                                        <Link href="/feed" prefetch={false}>
                                                            <a>
                                                                <IconButton color="inherit">
                                                                    <NewIcons.home/>
                                                                    <span className="m-2" style={{marginLeft:'5px', fontSize:'23.5px'}} >
                                                                        Home
                                                                    </span>
                                                                </IconButton>
                                                            </a>
                                                        </Link>
                                                    </li>


                                                    {/* <li className="px-0 dropdown-item"> */}
                                                    <div className={clsx(classes.removeMark)} style={{display: 'flex', marginLeft:'6px'}}>
                                                        <NotificationsNav isOpen={state.isOpen1} keyName="isOpen1" toggle={toggle}/>
                                                        <span className="mr-2 mt-1" style={{marginLeft:'-2px', fontSize:'23.5px'}}>
                                                            Notifications
                                                        </span>
                                                    </div>
                                                    {/* </li> */}
                                                    <li className="px-0 dropdown-item">
                                                        <Link href={`${authenticatedUser.getProfileLink}?activeTab=2`} prefetch={false}>
                                                            <a className="nav-link text-left"><NewIcons.favorite width="24" height="24"/>
                                                                <span className="m-2" style={{marginLeft:'5px', fontSize:'23.5px'}}>
                                                                    {t('layoutC:favorites')}
                                                                </span>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li className="px-0 dropdown-item">
                                                        <Link href="/profile/messages" prefetch={false}>
                                                            <a className="nav-link text-left"><NewIcons.message width="24" height="24"/>
                                                                <span className="m-2" style={{marginLeft:'5px', fontSize:'23.5px'}}>
                                                                    {t('layoutC:messaging')}
                                                                </span>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li className="px-0 dropdown-item">
                                                        <Link href={authenticatedUser.getProfileEditLink} prefetch={false}>
                                                            <a className="nav-link text-left"><NewIcons.setting width="24" height="24"/>
                                                                <span className="m-2" style={{marginLeft:'5px', fontSize:'23.5px'}}>
                                                                    {t('layoutC:settings')}
                                                                </span>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li className="px-0 dropdown-item">
                                                        <Link href="" prefetch={false}>
                                                            <a className="nav-link text-left" onClick={() => {
                                                                router.push('/')
                                                                logout()
                                                            }}>
                                                                <NewIcons.signout width="24" height="24"/>
                                                                <span className="m-2" style={{marginLeft:'5px', fontSize:'23.5px'}}>
                                                                    {t('layoutC:logout')}
                                                                </span>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    
                                                </>
                                            
                                            ) : (
                                                <div className={clsx(classes.removeMark)} style={{display:'row', textAlign:'center'}}>                                                   
                                                    <NavItem className="p-2">
                                                        <Link href="/auth/login" prefetch={false}>
                                                            <a className="nav-link py-0" style={{ color: "#666666" }} onClick={toggleNavbar}>
                                                               Login {/* {t('layoutC:login')} */}
                                                            </a>
                                                        </Link>
                                                    </NavItem>
                                                    <NavItem className="p-2">
                                                        <Link href="/auth/register" prefetch={false}>
                                                            <a className="nav-link py-0" style={{ color: "#666666" }} onClick={toggleNavbar}>
                                                                Sign up {/* {t('layoutC:register')} */}
                                                            </a>
                                                        </Link>
                                                    </NavItem>
                                                    <div onClick={toggleNavbar}> 
                                                        <CTALink
                                                            // title={t('layoutC:create-announce')}
                                                            title="CREATE AN ANNOUNCE"
                                                            href="/deposer-une-annonce"
                                                            style={{marginTop:'2px', borderRadius: 25, height: 33, fontWeight: "bold", fontFamily: "Roboto", fontSize: 14, lineHeight: "150%", fontStyle: "normal", padding: '6px 16px 5px 16px' }}
                                                            variant="contained"
                                                            color="primary"
                                                        />
                                                    </div>
                                                    
                                                    {/* <VisitorNav vertical/> */}
                                                </div>
                                            ) 
                                            
                                            
                                        }
                                        {isAuthenticated && !isMobile && <Metamask />}
                                    </div>
                                    </>
                                ) : (
                                    <div className={clsx("d-flex", "navbar-menu")}>
                                        <AutocompleteDropdown />
                                        {isAuthenticated && <Metamask />}
                                        {isAuthenticated ? <LoggedInUserNav/> : <VisitorNav/>}
                                    </div>
                                )}
                            </>
                        )}
                    </Collapse>
                   
                    {!isMobile && 
                        <NavItem className="p-2" style={{ listStyle: 'none' }}>
                            <NewAdButtonCTAStyled isDesktop={!isMobile}/>
                        </NavItem>
                    }
                   
                    {!isMobile && 
                        <Link
                            href="https://kargain.world"
                            prefetch={false}>
                            <a target="_blank" variant="text" style={{color: "#2C6BFC"}}>
                                <Emoji name="globe-with-meridians" width={24} style={{marginLeft:'10px'}} />
                            </a>
                        </Link>
                    }
                    
                </Navbar>
            </Container>
        </Root>
    )
}

const NewAdButtonCTA = ({ isDesktop, className }) => {
    const { t } = useTranslation()
    return (
        <CTALink
            title={isDesktop && t('layoutC:create-announce')}
            icon={!isDesktop && AddIcon}
            href="/deposer-une-annonce"
            className={className}
            style={{ borderRadius: 25, height: 33, fontWeight: "bold", fontFamily: "Roboto", fontSize: 14, lineHeight: "150%", fontStyle: "normal", padding: '6px 16px 5px 16px' }}
            variant="contained"
            color="primary"
        />
    )
}

const NewAdButtonCTAStyled = styled(NewAdButtonCTA)`
border-radius: 20px;
`

const NavbarAction = ({ vertical }) => {
    const { t } = useTranslation()
    const { dispatchSearchQuery } = useContext(SearchContext)

    const [searchQuery, setSearchQuery] = useState('')

    const onSubmitSearch = (event) => {
        event.preventDefault()
        if (searchQuery) {
            dispatchSearchQuery(searchQuery)
        }
    }

    const setSearchQueryByKeyUp = (value) => {
        setSearchQuery(value)
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
                          onKeyUp={({ target }) => setSearchQueryByKeyUp(target.value)}
                          name="query"
                          type="search"
                          placeholder={t('layoutC:search')}
                          iconright={<Search />}
                        />
                        <SearchIcon />
                    </SearchInputContainer>

                    <button
                        type="submit"
                        className="search-button">
                        <SearchIcon />
                    </button>
                </form>
            </NavItem>
        </Nav>
    )
}

const DropdownUser = ({ isOpen, keyName, toggle }) => {
    const router = useRouter()
    const { authenticatedUser, logout } = useAuth()
    const { t } = useTranslation()

    return (
        <li className="nav-item navbar-dropdown">
            <IconButton color="inherit"
                data-toggle="dropdownUser"
                aria-haspopup="true"
                aria-expanded="true"
                onClick={() => toggle(keyName)}>
                <NewIcons.navuser style={{width:'21px', height:'21px'}}/>
            </IconButton>

            <ul className={clsx('dropdown', isOpen && 'show')} id="dropdownUser">
                {authenticatedUser.getIsAdmin && (
                    <li className="px-0 dropdown-item">
                        <Link href={`/admin/ads`} prefetch={false}>
                            <a className="nav-link text-left"><DashboardIcon style={{width:'16px', height:'17px'}}/><span className="m-2" style={{marginLeft:'10px'}}>Admin</span></a>
                        </Link>
                    </li>
                )}
                <li className="px-0 dropdown-item">
                    <Link href={authenticatedUser.getProfileLink} prefetch={false}>
                        <a className="nav-link text-left"><NewIcons.user />
                            <span className="m-2" style={{marginLeft:'5px'}}>
                                {t('layoutC:my-profile')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href={`${authenticatedUser.getProfileLink}?activeTab=2`} prefetch={false}>
                        <a className="nav-link text-left"><NewIcons.favorite />
                            <span className="m-2" style={{marginLeft:'5px'}}>
                                {t('layoutC:favorites')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href="/profile/messages" prefetch={false}>
                        <a className="nav-link text-left"><NewIcons.message />
                            <span className="m-2" style={{marginLeft:'5px'}}>
                                {t('layoutC:messaging')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href={authenticatedUser.getProfileEditLink} prefetch={false}>
                        <a className="nav-link text-left"><NewIcons.setting />
                            <span className="m-2" style={{marginLeft:'5px'}}>
                                {t('layoutC:settings')}
                            </span>
                        </a>
                    </Link>
                </li>
                <li className="px-0 dropdown-item">
                    <Link href="" prefetch={false}>
                        <a className="nav-link text-left" onClick={() => {
                            router.push('/')
                            logout()
                        }}>
                            <NewIcons.signout />
                            <span className="m-2" style={{marginLeft:'5px'}}>
                                {t('layoutC:logout')}
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
        isOpen2: false,
        isSOpen: false
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
        isOpen2: false,
        isSOpen: false
    })

    return (
        <ClickAwayListener onClickAway={closeAll}>
            <div style={{ marginLeft: 'auto' }}>
                <Nav navbar className={clsx("my-2", "justify-content-center", vertical ? "flex-column" : "flex-row-nav")}>
                    <NavItem>
                        <Link href="/feed" prefetch={false}>
                            <a>
                                <IconButton color="inherit">
                                    <NewIcons.home style={{width:'21px', height:'21px'}}/>
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
                    <a className="nav-link py-0" style={{ color: "#666666" }}>
                        {t('layoutC:login')}
                    </a>
                </Link>
            </NavItem>
            <NavItem className="p-2">
                <Link href="/auth/register" prefetch={false}>
                    <a className="nav-link py-0" style={{ color: "#666666" }}>
                        {t('layoutC:register')}
                    </a>
                </Link>
            </NavItem>
        </Nav>
    )
}

export default NavbarClient
