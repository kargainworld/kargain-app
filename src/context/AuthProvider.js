import React, { createContext, useContext, useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import AuthService from '../services/AuthService'
import UserModel from '../models/user.model'
import { MessageContext } from './MessageContext'

const defaultContext = {
    isAuthReady: false,
    isLoading: true,
    authenticatedUser: new UserModel(),
    isAuthenticated: false,
    isAuthenticatedUserAdmin: false,
    forceLoginModal: false,
    avoidCloseLoginModal: false,
    initializeAuth : () => {},
    logout: () => {}
}

const AuthContext = createContext(defaultContext)

export const AuthProvider = ({ children }) => {
    const { lang } = useTranslation()
    const { dispatchModalError } = useContext(MessageContext)
    const [authState, setAuthState] = useState(defaultContext)

    const updateAuthenticatedRawUser = (rawUser) => {
        setAuthState(authState => ({
            ...authState,
            authenticatedUser: new UserModel(rawUser)
        }))
    }

    const initializeAuth = async () => {
        try {
            const user = await AuthService.authorize(lang)
            const User = new UserModel(user)

            setAuthState(authState => ({
                ...authState,
                isAuthReady: true,
                isAuthenticated: !!user,
                isAuthenticatedUserAdmin: User.getIsAdmin,
                authenticatedUser: User,
                isLoading: false
            }))
        } catch (err) {
            setAuthState(authState => ({
                ...authState,
                isAuthReady: true,
                isLoading: false
            }))
        }
    }

    const resetAuthState = () => {
        setAuthState({
            ...defaultContext,
            isAuthReady: false
        })
    }

    const LogoutAction = async () => {
        try {
            await AuthService.logout()
            resetAuthState()
        } catch (err) {
            dispatchModalError({ err })
        }
    }

    useEffect(() => {
        console.log('InitializeAuth............')
        initializeAuth()
    }, [])

    return (
        <AuthContext.Provider value={{
            isAuthReady: authState.isAuthReady,
            isAuthenticated: authState.isAuthenticated,
            isAuthenticatedUserAdmin: authState.isAuthenticatedUserAdmin,
            authenticatedUser: authState.authenticatedUser,
            forceLoginModal: authState.forceLoginModal,
            avoidCloseLoginModal : authState.avoidCloseLoginModal,
            isLoading: authState.isLoading,
            initializeAuth,
            setForceLoginModal: (forceLogin, avoidClose = false) => {
                setAuthState(authState => ({
                    ...authState,
                    forceLoginModal: Boolean(forceLogin),
                    avoidCloseLoginModal: Boolean(avoidClose)
                }))
            },
            setIsAuthenticated: () => {
                setAuthState(authState => ({
                    ...authState,
                    isAuthenticated: true
                }))
            },
            updateAuthenticatedRawUser,
            logout: LogoutAction
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth () {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
