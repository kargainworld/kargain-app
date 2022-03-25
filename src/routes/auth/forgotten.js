import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import EmailInput from '../../components/Form/Inputs/EmailInput'
import FieldWrapper from '../../components/Form/FieldWrapper'
import AuthService from '../../services/AuthService'
// import { MessageContext } from 'context/MessageContext'
import CTAButton from '../../components/CTAButton'
import { useAuth } from '../../context/AuthProvider'
import useTranslation from 'next-translate/useTranslation'

import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import customColors from '../../theme/palette'
import { useMessage } from 'context/MessageContext'

const useStyles = makeStyles(() => ({
    gradientbox: {
        display: "flex",
        alignItems: "center",
        //width: 50vw;
        width: "90%",
        backgroundClip: 'padding-box', /* !importanté */
        border: 'solid 3px transparent', /* !importanté */
        borderRadius: 20,
        '&:before': {
            content: '',
            position: "absolute",
            top: 0, right: 0, bottom: 0, left: 0,
            zIndex: -1,
            margin: -3, /* !importanté */
            borderRadius: "inherit", /* !importanté */
            background: customColors.gradient.main
        }
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        font: '14px',
        fontWeight: 'bold',
        fontStyle: "normal",

        background: customColors.gradient.main
    }

}))


const ForgottenForm = () => {
    const { t } = useTranslation()
    const { authenticatedUser } = useAuth()
    const { dispatchModal, dispatchModalError } = useMessage()
    const { control, errors, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues: authenticatedUser.getRaw
    })
    const classes = useStyles()
    const onSubmit = (form) => {
        AuthService.forgotPassword(form.email)
            .then(() => {
                dispatchModal({
                    msg: t('vehicles:email_had_been_sent_to_{email}', { email : form.email }),
                    persist: true
                })
            }).catch(err => {
                dispatchModalError({ err })
            })
    }

    return (
        <main>
            <h3 style={{ textAlign: "center", fontSize:"24px", marginTop:"40px" }}>{t('vehicles:password-forgotten')}</h3>
            <form className="mt-3 mx-auto"
                onSubmit={handleSubmit(onSubmit)}
                style={{ maxWidth: '400px' }}>

                <FieldWrapper label={t('vehicles:email_address')} center>
                    <EmailInput
                        name="email"
                        errors={errors}
                        control={control}
                        rules={{ required: t('form_validations:required') }}
                    />
                </FieldWrapper>

                <div className="submit">
                    <CTAButton
                        className={clsx("btn", classes.button)}
                        title={t('vehicles:ask_new_password')}
                        submit
                    />
                </div>
            </form>
        </main>
    )
}

export default ForgottenForm
