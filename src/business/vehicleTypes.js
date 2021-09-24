import useTranslation from 'next-translate/useTranslation';

const vehicleTypesDefault = () => {

    const { t } = useTranslation();

    return [
        {
            "value": "car",
            "label": t('vehicles:car'),
            "img": "car-camaro.png",
            "imgSelected": "car-camaro-blue.png"
        },
        {
            "value": "motorcycle",
            "label": t('vehicles:moto'),
            "img": "moto.png",
            "imgSelected": "moto-blue.png"
        },
        {
            "value": "truck",
            "label": t('vehicles:utility'),
            "img": "utilitaire.png",
            "imgSelected": "utilitaire-blue.png"

        },
        {
            "value": "camper",
            "label": t('vehicles:camper'),
            "img": "car-camping.png",
            "imgSelected": "car-camping-blue.png"
        }
    ]
}
export default vehicleTypesDefault;

export const vehicleTypeRefModels = {
    car : "cars",
    motorcycle : "motorcycles",
    truck : "trucks",
    camper : "campers"
}

export const vehicleTypes = {
    car : "car",
    moto : "motorcycle",
    utility : "truck",
    camper : "camper"
}

