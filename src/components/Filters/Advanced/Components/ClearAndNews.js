import Link from "next-translate/Link"
import clsx from "clsx"
import { NewIcons } from "assets/icons"
import React from "react"
import useTranslation from "next-translate/useTranslation"
import Button from "@material-ui/core/Button"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { useStyles } from './styles.js'


const ControlButtons = ({ ...props }) => {
    const { t } = useTranslation()
    const classes = useStyles(props)

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
