import useTranslation from 'next-translate/useTranslation';

const vehicleTypesDefault = () => {

    const { t } = useTranslation();

    return [
        {
            "value": "car",
            "label": t('vehicles:car'),
            "img": "svg/tab-car.svg",
            "imgSelected": "svg/tab-car-blue.svg"
        },
        {
            "value": "motorcycle",
            "label": t('vehicles:moto'),
            "img": "svg/tab-moto.svg",
            "imgSelected": "tab-moto-blue.png"
        },
        {
            "value": "truck",
            "label": t('vehicles:utility'),
            "img": "svg/tab-gruz.svg",
            "imgSelected": "tab-gruz-blue.png"

        },
        {
            "value": "camper",
            "label": t('vehicles:camper'),
            "img": "svg/tab-camper.svg",
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

