import useTranslation from 'next-translate/useTranslation';

const Named = () => {
    const { t } = useTranslation();

    return [
        {
            "value": "sale",
            "label": t('vehicles:sale')
        },
        {
            "value": "sale-pro",
            "label": t('vehicles:sale-pro')
        },
        {
            "value": "rent",
            "label": t('vehicles:rental')
        },
        {
            "value": "deal",
            "label": t('vehicles:deal')
        }
    ]
}

export default Named
