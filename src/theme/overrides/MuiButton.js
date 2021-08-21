import palette from "../palette"

export default {
    contained: {
        boxShadow:
      'none',
        backgroundColor: '#FFFFFF'
    },
    containedPrimary: {
      color: palette.primary.contrastText,
      backgroundColor: palette.primary.main,
      '&:hover': {
        color: palette.primary.contrastText,
        backgroundColor: palette.primary.dark,
        boxShadow: 'none',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: palette.primary.main
        }
      }
    },
}
