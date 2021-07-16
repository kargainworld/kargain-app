import { SelectOptionsUtils } from '../../../libs/formFieldsUtils'

export const RadioTypeFunction = [
    {
        label: 'Chopper',
        value: 'chopper'
    },
    {
        label: 'Cruiser',
        value: 'cruiser'
    },
    {
        label: 'Touring',
        value: 'touring'
    },
    {
        label: 'Quad',
        value: 'quad'
    },
    {
        label: 'Motoneige',
        value: 'snowmobile'
    },
    {
        label: 'Sportbike',
        value: 'sportbike'
    },
    {
        label: 'Moto legere',
        value: 'light-motorcycle'
    },
    {
        label: 'Mini bike',
        value: 'mini-bike'
    },
    {
        label: 'Scooter',
        value: 'scooter'
    },
    {
        label: 'Motosport',
        value: 'motosport'
    },
    {
        label: 'Moto Classic',
        value: 'classic-motorcycle'
    },
    {
        label: 'Autre',
        value: 'other'
    }
]

export const RadioChoicesEngine = [
    {
        label: 'Automatique',
        value: 'automatic'
    },
    {
        label: 'Manuelle',
        value: 'manual'
    },
    {
        label: 'Semi-automatique',
        value: 'semi-auto'
    }
]
export const CheckboxOptionsEquipments = SelectOptionsUtils([
    'ABS',
    'ESP',
    'Pare-brise',
    'Pot catalytique',
    'Bluetooth',
    'Soundsystem',
    'CD',
    'MP3',
    'Régulateur de vitesse adaptatif',
    'USB',
    'Sacs de voyage',
    'Kickstarter',
    'Topcase',
    'Siege chauffant',
    'Equipement handicapé',
    'Dossier passager',
    'Poignées chauffantes',
    'Support de sécurité',
    'Attache remorque',
    'Alarme',
    'Kit gros pneu'
])

export const RadioChoicesExternalColor = [
    {
        value: 'noir',
        label: 'Noir'
    },
    {
        value: 'gris',
        label: 'Gris'
    },
    {
        value: 'blanc',
        label: 'Blanc'
    },
    {
        value: 'vert',
        label: 'Vert'
    },
    {
        value: 'beige',
        label: 'Beige'
    },
    {
        value: 'doré',
        label: 'Doré'
    },
    {
        value: 'marron',
        label: 'Marron'
    },
    {
        value: 'orange',
        label: 'Orange'
    },
    {
        value: 'bronze',
        label: 'Bronze'
    },
    {
        value: 'violet',
        label: 'Violet'
    },
    {
        value: 'bleu',
        label: 'Bleu'
    },
    {
        value: 'rouge',
        label: 'Rouge'
    },
    {
        value: 'argent',
        label: 'Argent'
    },
    {
        value: 'jaune',
        label: 'Jaune'
    },
    {
        value: 'autre',
        label: 'Autre'
    }
]

export const RadioChoicesPaints = [
    {
        value: 'metallic',
        label: 'Métalique'
    },
    {
        value: 'other',
        label: 'Autre'
    }
]

export const RadioChoicesMaterials = [
    {
        value: 'Alcantre',
        label: 'alcantre'
    },
    {
        value: 'Cuir',
        label: 'cuir'
    },
    {
        value: 'Cuir partiel',
        label: 'Cuir-partiel'
    },
    {
        value: 'Tissu',
        label: 'tissu'
    },
    {
        value: 'Velours',
        label: 'velours'
    },
    {
        value: 'Autre',
        label: 'autre'
    }
]

export const RadioFunctionVehicle = [
    {
        value: 'personal-car',
        label: 'Véhicule personel'
    },
    {
        value: 'driving-school-car',
        label: 'Véhicule auto-école'
    },
    {
        value: 'post-rental',
        label: 'Après location'
    },
    {
        value: 'cab',
        label: 'Taxi'
    },
    {
        value: 'company-vehicle',
        label: 'Véhicule de société'
    },
    {
        value: 'demo-vehicle',
        label: 'Véhicule de démonstration'
    },
    {
        value: 'Pre-save-vehicle',
        label: 'Pré-enregistré'
    }
]

export const RadioChoicesGas = [
    {
        label: 'Diesel',
        value: 'diesel'
    },
    {
        label: 'Essence',
        value: 'gas'
    },
    {
        label: 'Éthanol',
        value: 'ethanol'
    },
    {
        label: 'Electrique',
        value: 'eletric'
    },
    {
        label: 'Hybride diesel',
        value: 'hybride-gas'
    },
    {
        label: 'Hydrogène',
        value: 'hydrogen'
    },
    {
        label: 'Monospace',
        value: 'minivan'
    },
    {
        label: 'Gaz compressé (GPL)',
        value: 'gpl'
    }
]
export const RadioVehicleGeneralState = SelectOptionsUtils([
    'Neuve',
    'Occasion',
    'Collection',
    'Véhicule auto-école',
    'Après location',
    'Taxi',
    'Véhicule de société',
    'Véhicule de démonstration',
    'Pré-enregistré'
])

export const RadioChoicesDefective = [
    {
        value: 'service-book',
        label: "Carnet d'entretien"
    },
    {
        value: 'guarantee',
        label: "Garantie"
    }
]

export const mileageType = [
    {
        label: 'mileage',
        value: 'mi'
    },
    {
        label: 'kilometer',
        value: 'km'
    }
]