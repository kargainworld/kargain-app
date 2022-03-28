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
import { useBackdrop } from '../../context/BackdropContext'

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

const ConnectPage = () => {
    const { dispatchModalError } = useMessage()
    const { connect, address, disconnect } = useWeb3Modal()
    const { initializeAuth } = useAuth()
    const router = useRouter()
    const backdrop = useBackdrop()
    const { t } = useTranslation()
    const classes = useStyles()
    const { redirect } = router.query


    const onSubmit = (data) => {
        backdrop.fetch(true)
        AuthService.login({ wallet: data.wallet })
            .then(async (user) => {
                
                await initializeAuth()
                backdrop.fetch(false)
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
                disconnect()
                dispatchModalError({ err })
                backdrop.fetch(false)
            })
    }

    const handleConnect = () => {
        connect().then(({ chainId, wallet }) => {
            if (chainId === Number(process.env.NEXT_PUBLIC_MAIN_CHAIN_ID)) {
                onSubmit({ wallet })
            }
        }).catch((error) => {
            dispatchModalError(error?.message)
        })
    }

    const handleDisconnect = () => {
        disconnect()
    }

    useEffect(() => {
        handleConnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>
            <Grid container justifyContent='center' className='mt-4'>
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

export default ConnectPage
