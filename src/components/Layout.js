import React, { useState } from 'react'
import FooterLight from './FooterLight'
import ScrollUpButton from 'react-scroll-up-button'
import NavbarClient from './NavbarClient'
import I18nProvider from 'next-translate/I18nProvider'
import useTranslation from 'next-translate/useTranslation'
import layoutDefault from '../locales/fr/layout.json'

const Layout = ({ children }) => {
    const { lang } = useTranslation()
    const [layoutC, setLayoutC] = useState(layoutDefault)
    import(`../locales/${lang}/layout.json`).then((m) => {setLayoutC(m.default)})

    return (
        <>
            <I18nProvider lang={lang} namespaces={{ layoutC }}>
                <NavbarClient />
            </I18nProvider>
            <MainBody>
                {children}
            </MainBody>
            <FooterLight/>
            <ScrollUpButton
                ShowAtPosition={150}
                EasingType='easeOutCubic'
                AnimationDuration={500}
                ContainerClassName="scroll_to_top"
                style={{
                    height: '30px',
                    width: '30px',
                    border: '3px solid gainsboro'
                }}>
            </ScrollUpButton>
        </>
    )
}

const MainBody = ({ children }) => (
    <main className="main">
        {children}
    </main>
)

export default Layout
