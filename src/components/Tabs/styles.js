import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles((theme) => ({
    slider:{
        border: "none",
        borderBottom: '3px solid #FE74F1',
        marginBottom: '-1px !important',
        color: '#999999 !important',
        fountSize: '16px !important',
        textAlign: 'center',
        background: 'none',
        width: '33.33% !important'
    },
    sliderborder:{
        border: 'none !important',
        borderBottom: '3px solid #FE74F1 !important',
        // marginTop: '1px !important',
        color:'#FE74F1 !important',
        textAlign: 'center !important',
        background: 'none !important',
        fontSize: '16px !important',
        width:  '33.33% !important'

    },
    subscriptionWrapper: {
        display: 'flex'
    },
    userName: {
        color: theme.palette.primary.light
    },
    tabs: {
        '& > .nav': {
            display: 'flex',
            flexWrap: 'nowrap'
        }
    },
    followContainer: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        '& > div': {
            display: 'flex',
            alignItems: 'center'
        },
        '&:not(:last-child)': {
            marginRight: theme.spacing(3)
        }
    },
    followItem: {
        display: "block",
        lineHeight: 1
    },
    filters: {
        padding: '0 !important',
        '& .FieldWrapper': {
            marginRight: '0 !important',
            marginLeft: '0 !important'
        },
        '& #new_feed':{
            display: 'none !important'
        }
    },
    btnFollow: {
        padding: '3px 8px',
        fontSize: '12px',
        marginRight: '15px'
    },
    button: {
        margin: '1rem'
    }
}))


export { useStyles }
