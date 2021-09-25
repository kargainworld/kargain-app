import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import { Col } from "reactstrap"
import { getTimeAgo } from "../../libs/utils"
import React, { useContext } from "react"
import { ModalContext } from "../../context/ModalContext"
import useTranslation from "next-translate/useTranslation"


const SharedURL = (props) => {
    const { dispatchModalState } = useContext(ModalContext)
    const { lang } = useTranslation()

    return (
        <>
            <Typography as="h2" variant="h2" style={{ fontWeight: '500', fontSize: '24px', lineHeight: '150%' }}>
                {props?.announce?.getAnnounceTitle}
            </Typography>
            <div  style={{ width: '100%',marginTop:'10px' }}>
                <Box mb={2} display="flex" flexDirection="row-reverse">
                    <Col sm={3}
                        className="icons-star-prof"
                        onClick={() =>
                            dispatchModalState({
                                openModalShare: true,
                                modalShareAnnounce: props?.announce
                            })
                        }
                        style={{ display:'flex', justifyContent: 'flex-end' }}
                    >
                        <small className="mx-3" style={{ fontSize:'16px' }}> {getTimeAgo(props?.announce?.getCreationDate.raw, lang)}</small>
                        <img src="/images/share.png" alt="" />
                    </Col>
                </Box>
            </div>    
        </>
    )
}

export default SharedURL
