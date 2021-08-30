import React from 'react';
import styled from 'styled-components';
import { Share } from '@material-ui/icons';
import { Avatar as MuiAvatar, Link, Card, CardActions, lighten, Badge } from '@material-ui/core';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import CommentsList from '../Comments/CommentsList';
import { withStyles } from '@material-ui/core/styles';

const StyledOnlineBadge = withStyles((theme) => ({
  badge: {
    // right: '25%',
    // bottom: '20%',
    // width: 12,
    // height: 12,
    // borderRadius: '50%',
    // backgroundColor: '#44b700',
    // color: '#44b700',
    // boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    // '&::after': {
    //   position: 'absolute',
    //   top: 0,
    //   left: 0,
    //   width: '100%',
    //   height: '100%',
    //   borderRadius: '50%',
    //   animation: '$ripple 1.2s infinite ease-in-out',
    //   border: '1px solid currentColor',
    //   content: '""',
    // },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const StyledOfflineBadge = withStyles((theme) => ({
  badge: {
    // right: '25%',
    // bottom: '20%',
    // width: 12,
    // height: 12,
    // borderRadius: '50%',
    // backgroundColor: 'red',
    // color: 'red',
    // boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    // '&::after': {
    //   position: 'absolute',
    //   top: 0,
    //   left: 0,
    //   width: '100%',
    //   height: '100%',
    //   borderRadius: '50%',
    //   animation: '$ripple 1.2s infinite ease-in-out',
    //   border: '1px solid currentColor',
    //   content: '""',
    // },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

export const Avatar = (props) => {
  const { isonline } = props;

  return isonline === 'true' ? (
    <StyledOnlineBadge
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
    >
      <MuiAvatar {...props} />
    </StyledOnlineBadge>
  ) : (
    <StyledOfflineBadge
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
    >
      <MuiAvatar {...props} />
    </StyledOfflineBadge>
  );
};

export const Root = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const User = styled.div`
  display: flex;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
`;

export const AuthorName = styled(Link)`
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Location = styled(Link)`
  margin-top: 4px !important;
  display: flex !important;
  align-items: center !important;
  font-size: 13px !important;
  color: #99999 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;

  svg {
    margin-right: ${({ theme }) => theme.spacing(0.5)}px;
    margin-left: -${({ theme }) => theme.spacing(0.5)}px;
  }
`;

export const Meta = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const CreationDate = styled.span`
  color: ${({ theme: { palette } }) => palette.primary.light};
  font-weight: 400;
  white-space: nowrap;

  svg {
    margin-right: ${({ theme }) => theme.spacing(1)}px;
  }
`;

export const ShareIcon = styled.img`
  cursor: pointer;
  width: 24px;
  height: auto;
  margin-top: 8px;
`;

export const SubHeader = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3.5)}px;
  display: flex;
`;

export const Action = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
  cursor: pointer;
  color: ${({ theme: { palette } }) => palette.secondary.main};
`;

export const Price = styled.span`
  margin-left: auto;
  color: ${({ theme: { palette } }) => palette.primary.main};
`;

export const Body = styled.div``;

export const ImageWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3.5)}px;
  position: relative;
`;

export const Image = styled(LazyLoadImage)`
  height: 240px;
  object-fit: cover;
`;

export const ImagePlaceholder = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.primary.light};
  background-color: ${({ theme }) => lighten(theme.palette.primary.light, 0.9)};
  height: 240px;
  width: 100%;
`;

export const ImageCounter = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)}px;
  right: ${({ theme }) => theme.spacing(2)}px;
  display: flex;
  align-items: center;

  svg {
    margin-right: ${({ theme }) => theme.spacing(1)}px;
  }
`;

export const Title = styled.h3`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  font-weight: bold;
  font-size: 17.4674px !important;
  font-weight: 500;
  color: ${({ theme: { palette } }) => palette.primary.main};
`;

export const CommentListStyled = styled(CommentsList)`
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing(3)}px;

  li:first-child {
    margin-top: 0 !important;
  }
`;

export const Footer = styled(CardActions)`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: ${({ theme }) => theme.spacing(2.5)}px !important;
  padding-top: 0 !important;

  & > * {
    margin: ${({ theme }) => theme.spacing(0.5)}px !important;
  }
`;
