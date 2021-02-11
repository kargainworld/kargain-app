export default {
    input: {
        border: '1px solid #EAEAEA',
        padding: '7.5px 10px',
        borderRadius: 5,
        transition: 'all .3s',

        '&:focus': {
            border: '1px solid #000000'
        }
    },
    underline: {
        '&.Mui-focused::after, &::before': {
            display: 'none'
        },
    },
}
