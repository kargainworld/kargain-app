import React, { useContext } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Portis from "@portis/web3"
import Fortmatic from 'fortmatic'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import { MessageContext } from 'context/MessageContext'
import AuthService from '../../services/AuthService'
import TextInput from '../../components/Form/Inputs/TextInput'
import EmailInput from '../../components/Form/Inputs/EmailInput'
import RCheckBoxInput from '../../components/Form/Inputs/RCheckBoxInput'
import RPasswordInput from '../../components/Form/Inputs/RPasswordInput'
import FieldWrapper from '../../components/Form/FieldWrapper'
import CTAButton from '../../components/CTAButton'



import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'
import customColors from '../../theme/palette'

const useStyles = makeStyles(() => ({

    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        background: customColors.gradient.main
    }

}))

const formConfig = {
    mode: 'onChange',
    validateCriteriaMode: 'all'
}  

const RegisterPage = () => {
    const { dispatchModal, dispatchModalError } = useContext(MessageContext)
    const { control, errors, getValues, handleSubmit } = useForm(formConfig)
    const { t } = useTranslation()
    const router = useRouter()
    const classes = useStyles()
    const onSubmit = (form) => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { confirm, confirmPwd, ...data } = form
        AuthService.register(data)
	    .then(() => {
                router.push('/auth/login')

                dispatchModal({
		    persist: true,
		    msg: t('layout:account_created')
                })
	    }).catch(err => {
                dispatchModalError({ err })
	    }
	    )
    }

    const providerOptions = {        
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "de98845889164596b64d51908b361ce2" // required
          }
        },
        fortmatic: {
            package: Fortmatic, // required
            options: {
              key: "pk_live_BD5D4B8351A4F63A" // required
            }
        },
        portis: {
            package: Portis, // required
            options: {
                id: "d29d2427-0c9b-4b6e-bcde-799f6fd0e833" // required
            }
        }
    };
    
    const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });
    
    const provider = web3Modal.connect();
    const web3 = new Web3(provider);

    return (
        <Container>
            <h1 style={{ fontSize:"24px", marginTop:'40px' }}>{t('vehicles:register')}</h1>
            {/* <Row>
                <Col className="m-auto" sm="12" md="10">                    

                    <form className="p-3 mx-auto"
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
				    borderRadius: '5px',
				    maxWidth: '500px'
                        }}>
                        <FieldWrapper label={t('vehicles:firstname')}>
                            <TextInput
                                name="firstname"
                                errors={errors}
                                control={control}
                                rules={{ required: t('form_validations:required') }}
			    />
                        </FieldWrapper>

                        <FieldWrapper label={t('vehicles:lastname')}>
                            <TextInput
                                name="lastname"
                                errors={errors}
                                control={control}
                                rules={{ required: t('form_validations:required') }}
			    />
                        </FieldWrapper>

                        <FieldWrapper label="Email" required>
                            <EmailInput
                                name="email"
                                errors={errors}
                                control={control}
                                rules={{ required: t('form_validations:required') }}
			    />
                        </FieldWrapper>

                        <FieldWrapper label={t('vehicles:password')}>
                            <RPasswordInput
                                name="password"
                                errors={errors}
                                control={control}
                                rules={{
				    required: t('form_validations:required'),
				    pattern: {
                                        value : /^(?=.*\d).{4,16}$/,
                                        message : t('form_validations:regexPwd{min}{max}',{
					    min : 4, max : 16
                                        })
				    } }
                                }

			    />
                        </FieldWrapper>

                        <FieldWrapper label={t('vehicles:password_confirm')}>
                            <RPasswordInput
                                style={{ fontSize:"14px", fontWeight:"normal" }}
                                name="confirmPwd"
                                errors={errors}
                                control={control}
                                rules={{
				    required: t('form_validations:required'),
				    pattern: {
                                        value : /^(?=.*\d).{4,16}$/,
                                        message : t('form_validations:regexPwd{min}{max}',{
					    min : 4, max : 16
                                        })
				    },
				    validate: {
                                        matchesPreviousPassword: (value) => {
					    const { password } = getValues()
					    return password === value || t('form_validations:form_validations')
                                        }
				    }
                                }}
			    />
                        </FieldWrapper>

                        <FieldWrapper>
                            <RCheckBoxInput

                                name="confirm"
                                label={t('vehicles:accept-cgu')}
                                errors={errors}
                                control={control}
                                rules={{ required: t('form_validations:required') }}

			    />
                        </FieldWrapper>

                        <div className="submit">
                            <CTAButton
                                className = {clsx('btn', classes.button)}
                                title={t('vehicles:register')}
                                submit
			    />
                        </div>
                    </form>
                </Col>
            </Row> */}
        </Container>
    )
}

export default RegisterPage
