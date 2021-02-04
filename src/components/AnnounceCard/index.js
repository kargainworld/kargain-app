import React, { useContext, useState } from 'react'
import * as i from '@geist-ui/react-icons'
import PropTypes from 'prop-types'
import Link from 'next-translate/Link'
import useDimensions from 'react-use-dimensions'
import useTranslation from 'next-translate/useTranslation'

import { MessageContext } from '../../context/MessageContext'
import AnnounceService from '../../services/AnnounceService'
import { useAuth } from '../../context/AuthProvider'
import TagsList from '../Tags/TagsList'
import CTALink from '../CTALink'
import { ModalContext } from '../../context/ModalContext'
import AnnounceModel from '../../models/announce.model'
import { getTimeAgo } from "../../libs/utils"
import {
    Root,
    User,
    Avatar,
    Info,
    AuthorName,
    Location,
    Meta,
    CreationDate,
    ShareIcon,
    SubHeader,
    Action,
    Price,
    Body,
    ImageWrapper,
    Image,
    Title,
    CommentListStyled,
    Footer

} from './components'


const Index = ({ announceRaw, featuredImgHeight }) => {
    const { t, lang } = useTranslation()
    const announce = new AnnounceModel(announceRaw)
    const [refWidth, { width }] = useDimensions()
    const { dispatchModalError } = useContext(MessageContext)
    const { dispatchModalState } = useContext(ModalContext)
    const [likesCounter, setLikesCounter] = useState(announce.getCountLikes)
    const { isAuthenticated, authenticatedUser, setForceLoginModal } = useAuth()
    const isAuthor = isAuthenticated && authenticatedUser.getID === announce.getAuthor?.getID

    const checkIfAlreadyLike = () => {
        const matchUserFavorite = authenticatedUser.getFavorites.find(favorite => favorite.getID === announce.getID)
        const matchAnnounceLike = announce.getLikes.find(like => like.getAuthor.getID === authenticatedUser.getID)
        return !!matchUserFavorite || !!matchAnnounceLike
    }

    const alreadyLikeCurrentUser = checkIfAlreadyLike()

    const handleClickLikeButton = async () => {
        if (!isAuthenticated) return setForceLoginModal(true)
        try {
            if (alreadyLikeCurrentUser) {
                await AnnounceService.addLikeLoggedInUser(announce.getID)
                setLikesCounter(likesCount => likesCount + 1)
            } else {
                await AnnounceService.removeLikeLoggedInUser(announce.getID)
                setLikesCounter(likesCount => Math.max(likesCount - 1))
            }
        } catch (err) {
            dispatchModalError({ err })
        }
    }

    return (
        <Root>
            <User>
                <Avatar src={announce.getAuthor.getAvatar} size="medium" />

                <Info>
                    <AuthorName href={announce.getAuthor.getProfileLink}>
                        {announce.getAuthor.getFullName}
                    </AuthorName>

                    {announce.getAdOrAuthorCustomAddress(['city', 'postCode', 'country']) && (
                        <Location
                            href={announce.buildAddressGoogleMapLink()}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <i.MapPin size={18} />
                            {announce.getAdOrAuthorCustomAddress(['city', 'country'])}
                        </Location>
                    )}
                </Info>

                <Meta>
                    <CreationDate>
                        <i.Clock />

                        {getTimeAgo(announce.getCreationDate.raw, lang)}
                    </CreationDate>

                    <ShareIcon
                        // onClick={TODO}
                    />
                </Meta>
            </User>

            <SubHeader>
                <Action
                    title={t('vehicles:i-like')}
                    onClick={() => handleClickLikeButton()}
                >
                    <i.Bookmark
                        style={{
                            color: alreadyLikeCurrentUser ? '#DB00FF' : '#444444'
                        }}
                    />
                    <span>{likesCounter}</span>
                </Action>

                <Action
                    title={t('vehicles:comment_plural')}
                >
                    <i.MessageCircle />
                    <span>{announce.getCountComments}</span>
                </Action>

                <Action
                    onClick={() => dispatchModalState({
                        openModalMessaging : true,
                        modalMessagingProfile : announce.getAuthor
                    })}
                >
                    <i.Mail />
                </Action>

                <Price>€ {announce.getPrice}</Price>
            </SubHeader>

            <Body>
                {announce.getFeaturedImg && (
                    <ImageWrapper>
                        <Link href={announce.getAnnounceLink} prefetch={false}>
                            <a>
                                <Image
                                    effect="blur"
                                    src={announce.getFeaturedImg.getLocation}
                                    // src="https://media.wired.com/photos/5d09594a62bcb0c9752779d9/1:1/w_1500,h_1500,c_limit/Transpo_G70_TA-518126.jpg"
                                    alt={announce.getFeaturedImg.getName}
                                    height={featuredImgHeight}
                                    width="100%"
                                />
                            </a>
                        </Link>

                        <ImageCounter>
                            <i.Camera />
                            {announce.getCountImages}
                        </ImageCounter>
                    </ImageWrapper>
                )}

                <Link href={announce.getAnnounceLink}>
                    <a>
                        <Title>{announce.getAnnounceTitle}</Title>
                    </a>
                </Link>

                {announce.getTags?.length > 0 && <TagsList tags={announce.getTags}/>}

                {announce.getCountComments > 0 && (
                    <CommentListStyled
                        comments={announce.getComments.slice(0, 1)}
                        moreLink={announce.getCountComments > 1
                            ? <Link href={announce.getAnnounceLink}>more</Link>
                            : null
                        }
                    />
                )}
            </Body>

            <Footer>
                <CTALink
                    title={t('vehicles:see-announce')}
                    href={announce.getAnnounceLink}
                />

                {isAuthor && (
                    <CTALink
                        title={t('vehicles:edit-announce')}
                        href={announce.getAnnounceEditLink}
                    />
                )}
            </Footer>
        </Root>
    )
}

Index.propTypes = {
    announceRaw: PropTypes.any.isRequired,
    featuredImgHeight: PropTypes.number
}

Index.defaultProps = {
    featuredImgHeight: 500
}

export default Index
