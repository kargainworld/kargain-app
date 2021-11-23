import {colors} from '@material-ui/core'

const white = '#FFFFFF'
const black = "#00000"
const grey = "#AAAAAA"
const green = "#2ECC40"
const blue = "#2C6BFC"
const yellow = "#FFDC00"
const orange = "#FF851B"
const red = "#FF4136"

export default {
    black,
    white,
    primary: {
        contrastText: white,
        light: "#2060FF",
        main: "#2C65F6",
        dark: "#2060FF"
    },
    secondary: {
        contrastText: white,
        dark: colors.grey[900],
        main: '#FE73F1',
        light: colors.grey['A400']
    },
    customgray: {
        contrastText: white,
        dark: "#999999",
        main: '#EAEAEA',
        light: '#FBFBFB'
    },
    gradient: {
        contrastText: white,
        dark: "linear-gradient(180deg, #DB00FF 0%, #5200FF 100%)",
        main: "linear-gradient(94.54deg, rgba(44, 101, 246, 0.69) 6.32%, rgba(105, 158, 248, 0.87) 31.3%, #A291F3 57.1%, rgba(237, 128, 235, 0.81) 83.75%)",
        light: "linear-gradient(180deg, #0070F3 -21.43%, #00D9D9 116.67%)",
    },
    success: {
        contrastText: white,
        dark: colors.green[900],
        main: colors.green[600],
        light: colors.green[400]
    },
    info: {
        contrastText: white,
        dark: colors.blue[900],
        main: colors.blue[600],
        light: colors.blue[400]
    },
    warning: {
        contrastText: white,
        dark: colors.orange[900],
        main: colors.orange[600],
        light: colors.orange[400]
    },
    error: {
        contrastText: white,
        dark: colors.red[900],
        main: colors.red[600],
        light: colors.red[400]
    },
    text: {
        primary: colors.grey[900],
        secondary: colors.grey[600],
        link: colors.blue[600]
    },
    background: {
        default: '#F4F4F4',
        paper: white
    },
    icon: colors.blueGrey[600],
    divider: colors.grey[200]
}

export const themeColors = {
    black,
    white,
    grey,
    green,
    blue,
    yellow,
    orange,
    red
}
