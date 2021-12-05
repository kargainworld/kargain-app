import makeStyles from "@material-ui/core/styles/makeStyles"
import customColors from "theme/palette"


const useStyles = makeStyles(() => ({
    image: {
        '& .image-gallery-image': {
            width: '100% !important',
            height: '241px !important',
            objectFit: 'fill !important'
        }
    },
    a_coin: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '12.2272px',
        lineHeight: '150%',
        color: '#999999'
    },
    a_info: {
        fontSize: '17.4674px',
        marginBottom: '6.54px'
    },
    avatar: {
        '& svg': {
            marginLeft: '1px !important'
        }
    },
    row: {
        display: 'flex, -webkitFlex-wrap: wrap',
        flexWrap: 'wrap',
        marginRight: '-15px'
    },
    share: {
        marginBottom: '6px',
        marginTop: '-10.5px',
        width: '25px',
        height: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: '#ececec !important'
        }
    },
    price: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '150%',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center'
    },
    priceContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '6px 16px',
        position: 'absolute',
        right: '-4%',
        bottom: '-8%',
        borderRadius: '25px',
        border: '2px solid transparent',
        background:
            'linear-gradient(#F0EEEE,#F0EEEE) padding-box, linear-gradient(180deg, #2C65F6 0%, #699EF8 36.46%, #A291F3 68.23%, #ED80EB 100%) border-box'
    },
    button: {
        border: 'none !important',
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white !important',
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '5px',
        width: '157px',
        hegiht: '33px',
        textAlign: 'center',
        background: customColors.gradient.main
    },
    modalcontent: {
        '& .modal-content': {
            borderRadius: '5px'
        }
    },
    gear: {
        height: '18px',
        width: '18px',
        '&:hover': {
            height: '20px',
            width: '20px'
        }
    }
}))


export { useStyles }
