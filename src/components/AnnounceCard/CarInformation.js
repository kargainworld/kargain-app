import { Col, Row } from 'reactstrap';
import { Avatar } from './components';
import Link from 'next-translate/Link';
import Typography from '@material-ui/core/Typography';
import { NewIcons } from '../../assets/icons';
import GalleryViewer from '../Gallery/GalleryViewer';
import React, { useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const CarInformation = (props) => {
  const { getOnlineStatusByUserId } = useSocket();
  const refImg = useRef();
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <>
      {isMobile ? (
        <div className="top" style={{ marginTop: '25px', marginBottom: '15px', marginLeft: '15px', display: 'flex' }}>
          <Row>
            <div className="pic" style={{ width: '32%' }}>
              <Avatar
                className="img-profile-wrapper avatar-preview"
                src={props?.announce?.getAuthor.getAvatar || props?.announce?.getAuthor.getAvatarUrl}
                isonline={getOnlineStatusByUserId(props?.announce?.getAuthor.getID)}
                alt={props?.announce?.getTitle}
                style={{ width: 120, height: 120 }}
              />
            </div>

            <div style={{ marginLeft: '10px', width: '65%' }}>
              <Link href={`/profile/${props?.announce?.getAuthor.getUsername}`}>
                <a>
                  <Typography
                    style={{
                      paddingLeft: 4,
                      fontWeight: '600',
                      fontSize: '16px !important',
                      lineHeight: '150%',
                    }}
                  >
                    {props?.announce?.getAuthor.getFullName}
                  </Typography>
                </a>
              </Link>

              {props?.announce?.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                <div className="top-profile-location">
                  <a href={props?.announce?.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                    <span
                      className="top-profile-location"
                      style={{ fontWeight: 'normal', fontSize: '16px', lineHeight: '150%', color: '#999999' }}
                    >
                      <NewIcons.card_location style={{ marginRight: '5px' }} />
                      {props?.announce?.getAdOrAuthorCustomAddress()}
                    </span>
                  </a>
                </div>
              )}
            </div>
          </Row>
        </div>
      ) : (
        <Col sm={12} md={6}>
          <div className="top" style={{ marginTop: '10px', marginBottom: '30px', marginLeft: '15px' }}>
            <Row>
              <div className="pic">
                <Avatar
                  className="img-profile-wrapper avatar-preview"
                  src={props?.announce?.getAuthor.getAvatar || props?.announce?.getAuthor.getAvatarUrl}
                  isonline={getOnlineStatusByUserId(props?.announce?.getAuthor.getID)}
                  alt={props?.announce?.getTitle}
                  style={{ width: 120, height: 120 }}
                />
              </div>

              <div style={{ marginLeft: '10px' }}>
                <Link href={`/profile/${props?.announce?.getAuthor.getUsername}`}>
                  <a>
                    <Typography
                      style={{
                        paddingLeft: 4,
                        fontWeight: '600',
                        fontSize: '16px !important',
                        lineHeight: '150%',
                      }}
                    >
                      {props?.announce?.getAuthor.getFullName}
                    </Typography>
                  </a>
                </Link>

                {props?.announce?.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                  <div className="top-profile-location">
                    <a href={props?.announce?.buildAddressGoogleMapLink()} target="_blank" rel="noreferrer">
                      <span
                        className="top-profile-location"
                        style={{ fontWeight: 'normal', fontSize: '16px', lineHeight: '150%', color: '#999999' }}
                      >
                        <NewIcons.card_location style={{ marginRight: '5px' }} />
                        {props?.announce?.getAdOrAuthorCustomAddress()}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </Row>
          </div>

          <div className="pics">
            {props?.announce?.getCountImages > 0 && <GalleryViewer images={props?.announce?.getImages} ref={refImg} />}
          </div>
        </Col>
      )}
    </>
  );
};

export default CarInformation;
