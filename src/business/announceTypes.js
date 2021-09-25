import useTranslation from 'next-translate/useTranslation'

const Named = () => {
    const { t } = useTranslation()

    return [
        {
            "value": "sale",
            "label": t('vehicles:sale')
        },
        {
            "value": "rent",
            "label": t('vehicles:rental')
        }
    ]
}

export default Named
