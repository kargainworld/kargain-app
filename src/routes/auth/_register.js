import React, { useContext, useEffect } from 'react'
import { Container } from 'reactstrap'

import useTranslation from 'next-translate/useTranslation'
// import { MessageContext } from 'context/MessageContext'
import AuthService from '../../services/AuthService'

import { useWeb3Modal } from 'context/Web3Context'
import CTAButton from '../../components/CTAButton'
import clsx from 'clsx'
import customColors from '../../theme/palette'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Grid } from '@material-ui/core'
import { useAuth } from 'context/AuthProvider'
import { useRouter } from 'next/router'
import UserModel from '../../models/user.model'
import { useMessage } from 'context/MessageContext'

const useStyles = makeStyles(() => ({

    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        background: customColors.gradient.main
    }

}))

const RegisterPage = () => {
    const { dispatchModal, dispatchModalError } = useMessage()
    const { connect, address, disconnect, web3Modal } = useWeb3Modal()
    const { initializeAuth } = useAuth()
    const router = useRouter()

    const { t } = useTranslation()
    const classes = useStyles()
    const { redirect } = router.query

    const onSubmit = (data) => {
        AuthService.register({ wallet: data.wallet })
            .then(async (user) => {
                dispatchModal({
                    persist: true,
                    msg: t('layout:account_created')
                })
                
                await initializeAuth()

                const User = new UserModel(user)
                if (redirect) {
                    router.push(`/auth/callback?redirect=${redirect}`)
                } else {
                    const isAdmin = User.getIsAdmin
                    if (isAdmin) {
                        router.push(`/auth/callback?redirect=/admin`)
                    } else {
                        router.push(`/auth/callback?redirect=/profile/${User.getUsername}`)
                    }
                }
            })
            .catch((err) => {
                dispatchModalError({ err })
            })
    }

    const handleConnect = () => {
        connect().then(({ chainId, wallet }) => {
            if (chainId === Number(process.env.NEXT_PUBLIC_MAIN_CHAIN_ID)) {
                onSubmit({ wallet })
            }
        })
    }

    const handleDisconnect = () => {
        disconnect()
    }
    console.log(address)
    useEffect(() => {
        if (!address && web3Modal.cachedProvider) {
            handleConnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [web3Modal, address])

    return (
        <Container>
            <h1 style={{ fontSize: '24px', marginTop: '40px' }}>{t('vehicles:register')}</h1>
            <Grid container justifyContent='center'>
                {!address ?
                    (
                        <CTAButton className={clsx('btn', classes.button)} title={t('vehicles:connect')} onClick={handleConnect} />
                    ) : (
                        <CTAButton className={clsx('btn', classes.button)} title={t('vehicles:disconnect')} onClick={handleDisconnect} />
                    )
                }

            </Grid>
        </Container>
    )
}

export default RegisterPage
