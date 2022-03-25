import React, { useReducer, createContext, useContext } from 'react'
import UserModel from '../models/user.model'
import AnnounceModel from '../models/announce.model'

const defaultValues = {
    //followersModal
    openModalFollowers : false,
    modalFollowersProfiles : [],
    modalFollowersTitle : null,
    isFollowing: false,
    
    //ShareAnnounceModal
    openModalShare : false,
    modalShareAnnounce : null,
    
    //MessagingModal
    openModalMessaging : false,
    modalMessagingProfile : new UserModel(),
    modalMessaginAnnounce : new AnnounceModel(),
    isOwner: false,
    handleUnSubscription: () => {}
}

export const ModalContext = createContext(defaultValues)

const reducer = (state, action) => ({
    ...state,
    ...action.payload
})

export const ModalContextProvider = ({ children }) => {
    const [modalStateContext, setModalStateContext] = useReducer(reducer, defaultValues)
    
    const dispatchModalState = (updates) => {
        setModalStateContext({
            payload: updates
        })
    }
    
    return (
        <ModalContext.Provider value={{
            modalStateContext,
            dispatchModalState
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('ModalContext must be used within an ModalProvider')
    }
    return context
}

// export { ModalContext, ModalContextProvider }
