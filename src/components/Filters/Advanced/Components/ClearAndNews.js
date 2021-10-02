import Link from "next-translate/Link"
import clsx from "clsx"
import { NewIcons } from "assets/icons"
import React from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import useTranslation from "next-translate/useTranslation"
import Button from "@material-ui/core/Button"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import customColors from "../../../../theme/palette"
import useMediaQuery from "@material-ui/core/useMediaQuery"


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
    }
}))

const ControlButtons = ({ ...props }) => {
    const { t } = useTranslation()
    const classes = useStyles()

    return (
        <Button
            className={ clsx(classes.button)}
            variant="contained"
            color="primary"
            startIcon={<NewIcons.recycle_white style={{ marginBottom:'3px' }}/>}
            type="button"
            onClick={e =>{ props.resetFilter(e)}}
        >
            {t('vehicles:clear-filters')}
        </Button>
    )
}


const ClearAndFeed = ({ defaultFilters }) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const router = useRouter()
    const classes = useStyles()
    const { t } = useTranslation()

    const onResetFilter = (form, e) => {
        const filters = getValues()
        for(let key in filters){
            setValue(key, "")
        }
        router.push({
            pathname: router.pathname
        })
    }

    const defaultValues = {
        ...defaultFilters
    }

    const { setValue, getValues, handleSubmit } = useForm({
        mode: 'onChange',
        validateCriteriaMode: 'all',
        defaultValues
    })

    return (
        !isMobile ? (
            <div id="new_feed" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom:'30px' }}>
                <ControlButtons
                    resetFilter={onResetFilter}
                    dynamicHandleSubmit={handleSubmit}
                />
                <Link href="/advanced-search">
                    <a className={clsx(classes.borderGradientButton)} style={{ textTransform: 'uppercase' }}>
                        <NewIcons.home_color style={{ marginRight:'10px', marginBottom:'5px' }}/>
                        <label> {t('layout:news_feed')} </label>
                    </a>
                </Link>
            </div>
        )
            : (
                <div id="new_feed" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom:'30px' }}>

                    <ControlButtons
                        resetFilter={onResetFilter}
                        dynamicHandleSubmit={handleSubmit}
                    />
                    <Link href="/advanced-search">
                        <a className={clsx(classes.borderGradientButton)} style={{ textTransform: 'uppercase' }}>
                            <NewIcons.home_color style={{ marginRight:'10px', marginBottom:'5px' }}/>
                            <label> {t('layout:news_feed')} </label>
                        </a>
                    </Link>
                </div>
            )
    )
}


export default ClearAndFeed
