import React, { useContext, useEffect } from 'react'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { Col, Container, Row } from 'reactstrap'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import makeStyles from '@material-ui/core/styles/makeStyles'

// import { MessageContext } from 'context/MessageContext'

import CTAButton from '../../components/CTAButton'
import FieldWrapper from '../../components/Form/FieldWrapper'
import EmailInput from '../../components/Form/Inputs/EmailInput'
import PasswordInput from '../../components/Form/Inputs/PasswordInput'

import AuthService from '../../services/AuthService'
import { useAuth } from '../../context/AuthProvider'
import UserModel from '../../models/user.model'
import useSocket from '../../hooks/useSocket'


import customColors from '../../theme/palette'
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

const LoginPage = ({ forceLogout }) => {
    const router = useRouter()
    const { logout, isAuthenticatedUserAdmin, authenticatedUser } = useAuth()
    const { t } = useTranslation()
    const { initializeAuth } = useAuth()
    useSocket()
    const classes = useStyles()

    const { redirect } = router.query
    const { dispatchModalError } = useMessage()
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all'
    })

    useEffect(() => {
        if (forceLogout) logout()
    }, [])

    useEffect(() => {
        if(isAuthenticatedUserAdmin && authenticatedUser) {
            if(authenticatedUser.getIsAdmin) {
                router.push('/admin')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticatedUserAdmin, authenticatedUser])

    const onSubmit = async (form) => {
        const { email, password } = form
        try {
            const user = await AuthService.adminLogin({
                email,
                password
            })

            await initializeAuth()

            const User = new UserModel(user)

            const isAdmin = User.getIsAdmin

            if (isAdmin) {
                router.push(`/admin`)
            } else {
                dispatchModalError({ err: 'Not Admin user!!' })
            }
        }
        catch (err) {
            dispatchModalError({ err })
            if (redirect) router.push({ pathname: redirect })
        }
    }

    return (
        <Container>
            <h3 style={{ textAlign: "center", fontSize: "24px", marginTop: '40px' }}>{t('vehicles:login')}</h3>
            <Row>
                <Col className="m-auto" sm="12" md="10">

                    <form className="p-3 mx-auto"
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            borderRadius: '5px',
                            maxWidth: '500px'
                        }}
                    >

                        <FieldWrapper label="Email">
                            <EmailInput
                                name="email"
                                inline
                                errors={errors}
                                control={control}
                                rules={{ required: t('form_validations:required') }}
                            />
                        </FieldWrapper>

                        <FieldWrapper label={t('vehicles:password')}>
                            <PasswordInput
                                className={clsx('txt', classes.text)}
                                name="password"
                                errors={errors}
                                control={control}
                                rules={{
                                    required: t('form_validations:required'),
                                    pattern: {
                                        value: /^(?=.*\d).{4,16}$/,
                                        message: t('form_validations:regexPwd{min}{max}', {
                                            min: 4, max: 16
                                        })
                                    }
                                }}
                            />
                        </FieldWrapper>

                        {/* <div className="text-right">
                            <Link href="/auth/forgotten">
                                <a className="" style={{ fontSize: "14px" }}>{t('vehicles:password-forgotten')} </a>
                            </Link>
                        </div> */}

                        <div className="submit">
                            <CTAButton

                                className={clsx('btn', classes.button)}
                                title={t('vehicles:login')}
                                submit
                            />
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginPage