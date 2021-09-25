import useTranslation from 'next-translate/useTranslation';

const vehicleTypesDefault = () => {

    const { t } = useTranslation();

    return [
        {
            "value": "car",
            "label": t('vehicles:car'),
            "img": "tab-car.png",
            "imgSelected": "tab-car-blue.png"
        },
        {
            "value": "motorcycle",
            "label": t('vehicles:moto'),
            "img": "tab-moto.png",
            "imgSelected": "tab-moto-blue.png"
        },
        {
            "value": "truck",
            "label": t('vehicles:utility'),
            "img": "tab-gruz.png",
            "imgSelected": "tab-gruz-blue.png"

        },
        {
            "value": "camper",
            "label": t('vehicles:camper'),
            "img": "tab-camper.png",
            "imgSelected": "tab-camper-blue.png"
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

