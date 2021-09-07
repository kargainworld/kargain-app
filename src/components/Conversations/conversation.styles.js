import { makeStyles } from '@material-ui/styles'

export default makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius : '5px',
        border: '1px solid gainsboro',
        boxShadow: theme.shadows[5],
        padding: '.5rem',
        width: '100%',
        maxWidth: '80vw',
        height : '90vh',
    
        [theme.breakpoints.up('xl')]: {
            maxWidth: '60%'
        },
        
        [theme.breakpoints.down('xs')]: {
            width: '350px'
        }
    },

    conversations: {
        display: 'flex',
        flexWrap: 'wrap',
        height: '100%'
    },

    conversationsList: {
        margin: 0,
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        width: '100%',
        borderRight: '1px solid',
        border: '1px solid gainsboro',
    
        [theme.breakpoints.up('md')]: {
            width: '30%',
            borderRight: '1px solid #e6ebef'
        }
    },

    styleScroller: {
        height: '100%',
        position: 'relative'
    },

    scrollerContainer: {
        position: 'relative',
        maxHeight: '100vh',
        overflow: 'auto',
        willChange: 'transform'
    },

    conversationListItem: {
        display: 'flex',
        alignItems : 'normal',
        padding: '1rem',
        cursor: 'pointer',
        flexDirection: 'row',
        overflow: 'hidden',
        borderTop: '1px solid gainsboro',

        '&:hover': {
            backgroundColor: '#d9e6f7',
            color: '#369'
        }
    },

    itemDetails: {
        verticalAlign: 'top',
        overflow: 'hidden',
        width: '50%'
    },

    itemDetailsPreview: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: '100%',
        display: 'block',
        overflow: 'hidden'
    },

    conversation: {
        position: 'relative',
        zIndex: '2',
        top: 0,
        left: 0,
        height: '100%',
        overflow: 'hidden',
        // border: '1px solid gainsboro',
        background: '#fff',

        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            width: '100%',
            zIndex: 1
        }
    },

    conversationCloseMobile: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    conversationHeader: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        height: '4rem',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        background: '#fff',
        zIndex: 1,
        boxShadow: '0 0.2rem 0.2rem 0 rgba(0,0,0,.1)',
        borderBottom: '1px solid #cad1d9'
    },

    conversationContent: {
        height: 'calc(60vh - 1rem)',
        display: 'block',
        overflowY: 'auto',
        border: '1px solid #EAEAEA',
        // backgroundColor: 'gainsboro',
        padding : '.5rem'
    },

    messageContainer: {
        display: 'block',
        wordWrap: 'break-word',
        margin: '0 .5rem'
    },

    headerUsername: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        padding: '0 1.2rem',
        justifyContent: 'space-between',

        '& a': {
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',

            '&:hover': {
                color: '#ff5e14'
            }
        }
    },

    pointerClose: {
        display: 'flex',
        cursor: 'pointer'
    },

    textJustifiedStart: {
        display: 'flex',
        justifyContent: 'flex-start'
    },

    textJustifiedEnd: {
        display: 'flex',
        justifyContent: 'flex-end'
    },

    basicMessage: {
        display: 'flex',
        alignItems : 'center',
        maxWidth: '70%'
    },

    messageBubble: {
        borderRadius: '25px',
        textAlign: 'left',
        whiteSpace: 'pre-line',
        padding: '.5rem 2rem',
        margin: '.5rem',
        // backgroundColor: '#d9e6f7',
        backgroundColor: '#A291F3',
        // color: '#369',
        color: '#fff',
        fontWeight: 400,
        fontSize:'16px',
    },

    messageBubbleLeft: {
        borderRadius: '25px',
        textAlign: 'left',
        whiteSpace: 'pre-line',
        padding: '.5rem 2rem',
        margin: '.5rem ',
        fontWeight: 400,
        backgroundColor: '#EAEAEA',
        color: '#000000',
        fontSize:'16px',
    },

    conversationFooter: {
        background: '#fff',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        // borderTop: '1px solid #e6ebef',
        marginTop:'15px'
    },

    conversationForm: {
        display: 'flex',
        position: 'relative',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },

    conversationTextarea: {
        height:'40px',
        margin: 0,
        minWidth: 'unset',
        width: '87%'
    },

    conversationInputButton: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        padding: '10px',
        textDecoration: 'none',
        border:'1px solid white',
        marginTop:'-5px',
    },

}))
