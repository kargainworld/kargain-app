import Typography from "@material-ui/core/Typography"
import CarInfos from "../Products/car/CarInfos"
import { Col, Row } from "reactstrap"
import DamageViewerTabs from "../Damages/DamageViewerTabs"
import React from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import useTranslation from "next-translate/useTranslation"
import useMediaQuery from '@material-ui/core/useMediaQuery'

const useStyles = makeStyles(() => ({
    wysiwyg: {
        margin: '1rem'
    }
}))

const VehicleEquipments = (props) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width:768px)')

    return (
        <div style={{ marginTop: '50px' }}>
        <section className="my-2" style={{ marginTop: '15px' }}>
          <Typography component="h3" variant="h3">
            {t('vehicles:vehicle-data')}
          </Typography>
          <CarInfos announce={props?.announce} enableThirdColumn />
        </section>

        <section className="my-2" style={{ marginTop: '15px' }}>
          <Typography component="h3" variant="h3">
            {t('vehicles:equipments')}
          </Typography>
          <Row>
            {props?.announce?.getVehicleEquipments.map((equipment, index) => {
              return (
                <Col sm={6} md={3} key={index}>
                  <div className="equipment m-3">
                    <Typography>{equipment.label}</Typography>
                  </div>
                </Col>
              );
            })}
          </Row>
        </section>

        <section className="my-2" style={{ marginTop: '15px' }}>
          <Typography component="h3" variant="h3">
            {t('vehicles:description')}
          </Typography>
          <div className={classes.wysiwyg}>
            <Typography>{props?.announce?.getDescription}</Typography>
          </div>
        </section>

        <section className="my-2" style={{ marginTop: '15px' }}>
          <Typography component="h3" variant="h3">
            {t('vehicles:data-sheet')}
          </Typography>
          {isMobile ? (
            <div style={{ marginTop: 40 }}>
              <DamageViewerTabs
                tabs={props?.announce?.getDamagesTabs}
                vehicleType={props?.announce?.getVehicleType}
              />
            </div>
          ) : (
            <DamageViewerTabs tabs={props?.announce?.getDamagesTabs} vehicleType={props?.announce?.getVehicleType} />
          )}
        </section>
      </div>

    )
}

export default VehicleEquipments
