import makeStyles from "@material-ui/core/styles/makeStyles"
import customColors from "../../../../theme/palette"


const useStyles = makeStyles(() => ({
    borderGradientButton:{
        height:'39px',
        borderRadius: '100rem',
        fontSize: '14px',
        padding: '8px 30px 2px',
        border: 'solid 2px transparent',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #2C65F6, #ED80EB)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'content-box, border-box',
        boxShadow: '2px 1000px 1px #fff inset',
        '&:hover': {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #0244ea, #e81ae5)'
        },
        '& label':{
            background: '-webkit-linear-gradient(#2C65F6, #ED80EB); -webkit-background-clip: text; -webkit-text-fill-color: transparent',
            backgroundImage: 'linear-gradient(60deg, #2C65F6, #ED80EB)',
            backgroundClip: 'text',
            color: 'transparent'
        }
    },
    button: {
        border: "none !important",
        padding: '6px 2rem',
        borderRadius: '20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: "bold",
        marginRight: "5px",
        height: '39px',
        background: customColors.gradient.main
    },
    filtersContainer: {
        padding: '.5rem'
    },
    buttondropdown:{
        '& button':{
            borderRadius: '26.8293px !important',
            borderColor:'#dcd7d7 !important',
            backgroundColor: '#c4c4c400 !important',
            color: 'black !important',
            cursor: 'pointer',
            fontSize:"17.1707px",
            marginRight: '6px !important',
            marginTop: '5px !important',
            '& button:clicked': {
                borderRadius: '25px !important',
                backgroundColor: '#c4c4c447 !important',
                color: 'black !important',
                fontSize:"17.1707px !important"
            },
            '&::after': {
                display: 'none !important'
            },
            '& .propTypes':{
                disabled: 'PropTypes.bool',
                direction: 'PropTypes.oneOf([`up`, `down`, `left`, `right`])',
                group: 'PropTypes.bool',
                isOpen: 'PropTypes.bool',
                tag: 'PropTypes.string',
                toggle: 'PropTypes.func'
            }
        }
    },
    dropdowntoggle:{
        '& .propTypes':{
            caret: 'PropTypes.bool',
            color: 'PropTypes.string',
            disabled: 'PropTypes.bool',
            onClick: 'PropTypes.func',
            dataToggle: 'PropTypes.string',
            ariaHaspopup: 'PropTypes.bool'
        }
    },
    rowbuttons:{
        position: 'relative',
        backgroundColor: '#fff',
        marginTop:'20px'
    },
    overflow:{
        overflowX:'auto'
    },
    filterbutton:{
        backgroundColor: 'white', /* Green */
        color: 'black',
        padding: '8px 15px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '26.8293px',
        border: 'solid #dcd7d7',
        borderWidth: '1px'
    },
    dropdownmenu: {
        position: 'absolute',
        width: '250px',
        right: '220px',
        top: '225.49px',
        padding: '5px 5px'
    },
    label:{
        textAlign:'left',
        fontSize:'14px',
        fontWeight: 'normal',
        lineHeight: '150%',
        color: 'black',
        marginLeft:'5px',
        marginBottom: '-10px'
    },
    dropdownmenuslide:{
        position: 'absolute',
        width: '250px',
        // height: 105px;
        right: '220px',
        top: '225.49px',
        padding: '15px 10px 20px'
    },
    btnfontsize:{
        '& button':{
            fontSize:'15.15px !important'
        },
        '& img':{
            width:'11px'
        }
    },
    buttonDropdown: {
        '& button':{
            borderRadius: '26.8293px !important',
            borderColor:'#dcd7d7 !important',
            backgroundColor: '#c4c4c400 !important',
            color: 'black !important',
            cursor: 'pointer',
            fontSize:"17.1707px",
            marginRight: '6px !important',
            marginTop: '5px !important',
            '& button:clicked': {
                borderRadius: '25px !important',
                backgroundColor: '#c4c4c447 !important',
                color: 'black !important',
                fontSize:"17.1707px !important"
            },
            '&::after': {
                display: 'none !important'
            },
            '& .propTypes':{
                disabled: 'PropTypes.bool',
                direction: 'PropTypes.oneOf([`up`, `down`, `left`, `right`])',
                group: 'PropTypes.bool',
                isOpen: 'PropTypes.bool',
                tag: 'PropTypes.string',
                toggle: 'PropTypes.func'
            }
        }
    },
    dropdownMenu: {
        position: 'absolute',
        width: '250px',
        right: '220px',
        top: '225.49px',
        padding: '5px 5px'
    },
    filtersHidden: {
        display: 'none !important'
    }
}))


export { useStyles }
