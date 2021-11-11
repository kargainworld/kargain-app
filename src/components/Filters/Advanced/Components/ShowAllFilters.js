import clsx from "clsx"
import { Col } from "reactstrap"
import { NewIcons } from "../../../../assets/icons"
import React from "react"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import useTranslation from "next-translate/useTranslation"
import { useStyles } from "./styles"


const ShowAllFilters = (props) => {
    const isMobile = useMediaQuery('(max-width:768px)')
    const { t } = useTranslation()
    const classes = useStyles(props)

    return (
        isMobile ? (
            <div className={clsx(!props.hiddenFormMobile && classes.filtersHidden)} style={{ width:'100%', display:'flex' }}>
                <Col className={clsx(!props.hiddenFormMobile && classes.filtersHidden)} sm={5} xs={1}> </Col>
                <Col
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        transform: 'translate(25px, -44px)'

                    }}>
                    <div className={clsx(!props.hiddenFormMobile && classes.filtersHidden)} style={{
                        backgroundColor: '#ffffffeb',
                        width: '40px'
                    }}/>
                    <div className={clsx(!props.hiddenFormMobile && classes.filtersHidden, classes.filterbutton)} onClick={() => props.toggleFiltersMobile()} style={{ transform: 'translate(-25px, 0px)', width: '232px' }}>
                        <NewIcons.filter alt='filter' style={{ marginRight:'10px' }} />
                        {t('filters:select-filters')}
                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')}/>
                    </div>
                </Col>
            </div>
        )
            :
            <div className={clsx(!props.hiddenForm && classes.filtersHidden)} style={{ width:'100%', display:'flex' }}>
                <div className={clsx(!props.hiddenForm && classes.filtersHidden)} style={{ width:'70.5%' }}> </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        transform: 'translate(25px, -44px)',
                        width:"29.5%"
                    }}>
                    <div className={clsx(!props.hiddenForm && classes.filtersHidden)} style={{ backgroundColor: '#ffffffeb', width: '40px' }}/>
                    <div className={clsx(!props.hiddenForm && classes.filtersHidden, classes.filterbutton)} onClick={() => props.toggleFilters()} style={{ transform: 'translate(-25px, 0px)' }}>
                        <NewIcons.filter alt='filter' style={{ marginRight:'10px' }} />
                        {t('filters:select-filters')}
                        <i className={clsx('ml-2', 'arrow_nav', 'is-bottom')}/>
                    </div>
                </div>
            </div>

    )
}

export default ShowAllFilters
