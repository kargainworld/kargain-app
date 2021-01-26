import useTranslation from 'next-translate/useTranslation';

export const vehicleTypeRefModels = {
    car : "cars",
    moto : "motorcycles",
    utility : "trucks",
    camper : "campers"
}

export const vehicleTypes = {
    car : "car",
    moto : "moto",
    utility : "utility",
    camper : "camper"
}

export default () => {
    const { t } = useTranslation();

    return [
        {
            "value": "car",
            "label": t('vehicles:car'),
            "img": "tab-car.png",
            "imgSelected": "tab-car-blue.png"
        },
        {
            "value": "moto",
            "label": t('vehicles:moto'),
            "img": "tab-moto.png",
            "imgSelected": "tab-moto-blue.png"
        },
        {
            "value": "utility",
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


