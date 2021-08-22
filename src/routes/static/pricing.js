import React, { useEffect } from 'react'
import { Container } from 'reactstrap'
import { useAuth } from '../../context/AuthProvider'
import Offers from '../../components/Stripe/Offers'
import { useRouter } from 'next/router'
import useIsMounted from '../../hooks/useIsMounted'


const Index = () => {
    const { isAuthenticated } = useAuth()
    const isMounted = useIsMounted()
    const router = useRouter()

    useEffect(()=> {
        if(isMounted){
            if (!isAuthenticated) {
                router.push({
                    pathname: '/auth/login',
                    query: { redirect: router.asPath },
                });
                return;
            }
            // setForceLoginModal(false)
        }
    },[isMounted, isAuthenticated])

    return (
        <Container>
            <div className="c-page-section-pricing__inner">
                <h2>Pricing</h2>
                <Offers/>
            </div>
        </Container>
    )
}

export default Index
