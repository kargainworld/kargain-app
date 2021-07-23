import CarFilters from './vehiclesNewFilters/CarFilters'
import MotoFilters from './vehiclesNewFilters/MotoFilters'
import CamperFiltersNFT from './vehiclesNewFilters/CamperFiltersNFT'
import UtilityFilters from './vehiclesNewFilters/UtilityFilters'

export default function SwitchFiltersVehicleType (type) {
    switch (type) {
    case 'car' :
        return CarFilters
    case 'camper' :
        return CamperFiltersNFT
    case 'utility' :
        return UtilityFilters
    case 'moto':
        return MotoFilters
    default:
        return CarFilters
    }
}
