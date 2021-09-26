import { Col, Row } from "reactstrap"
import { Avatar } from "./components"
import Link from "next-translate/Link"
import Typography from "@material-ui/core/Typography"
import { NewIcons } from "assets/icons"
import GalleryViewer from "../Gallery/GalleryViewer"
import React, { useRef } from "react"
import { useSocket } from "context/SocketContext"
import useMediaQuery from "@material-ui/core/useMediaQuery"


const CarInformation = (props) => {
    const { getOnlineStatusByUserId } = useSocket()
    const refImg = useRef()
    const isMobile = useMediaQuery('(max-width:768px)')


    return (
        <Col sm={12} md={6}>
            <div className="top" style={{ marginTop: '10px', marginBottom: '30px', marginLeft:'15px' }}>
                <Row>
                    <div style={{ width: isMobile ? "35%": "24%" }}>
                        <Avatar
                            className="img-profile-wrapper avatar-preview"
                            src={props?.announce?.getAuthor.getAvatar || props?.announce?.getAuthor.getAvatarUrl}
                            isonline={getOnlineStatusByUserId(props?.announce?.getAuthor.getID)}
                            alt={props?.announce?.getTitle}
                            style={{ width: 120, height: 120 }}
                        />
                    </div>

                    <div style={{ width: isMobile ? "60%": "50%", marginLeft: isMobile ? "2px" : '', marginTop: isMobile ? "2px" : '' }}>
                        <Link href={`/profile/${props?.announce?.getAuthor.getUsername}`}>
                            <a>
                                <Typography style={{ paddingLeft: 4, fontWeight:'600', fontSize: isMobile ? '15px' : '16px', lineHeight: '150%' }}>
                                    {props?.announce?.getAuthor.getFullName}
                                </Typography>
                            </a>
                        </Link>

                        {props?.announce?.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                            <a href={props?.announce?.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                                <div style={{ flexDirection: 'row', display: 'flex' }}>
                                    <div style={{ width: "10%" }}>
                                        <span className="top-profile-location" style={{ fontWeight:'normal', fontSize: isMobile ? '15px' : '16px', lineHeight: '150%', color: '#999999' }}>
                                            <NewIcons.card_location />
                                        </span>
                                    </div>
                                    <div style={{ width: "90%" }}>
                                        <span className="top-profile-location" style={{ fontWeight:'normal', fontSize: isMobile ? '15px' : '16px', lineHeight: '150%', color: '#999999' }}>
                                            {props?.announce?.getAdOrAuthorCustomAddress()}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        )}
                    </div>
                </Row>
            </div>

            <div className="">
                {props?.announce?.getCountImages > 0 && (
                    <>
                        <GalleryViewer images={props?.announce?.getImages} ref={refImg} />
                    </>
                )}
            </div>
        </Col>
    )
}

export default CarInformation
