import styled from "styled-components"
import { Share } from '@material-ui/icons'
import {Avatar as MuiAvatar, Link, Card, CardActions, lighten} from '@material-ui/core'
import { LazyLoadImage } from "react-lazy-load-image-component"
import CommentsList from "../Comments/CommentsList"

export const Root = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const User = styled.div`
  display: flex;
`

export const Avatar = styled(MuiAvatar)`
  body & {
    margin-right: ${({ theme }) => theme.spacing(1)}px !important;
    width: 52px;
    height: 52px;
  }
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
  overflow: hidden;
`

export const AuthorName = styled(Link)`
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Location = styled(Link)`
  margin-top: 4px !important;
  display: flex !important;
  align-items: center !important;
  font-size: 16px !important;
  color: ${({ theme: { palette } }) => palette.primary.light} !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing(0.5)}px;
    margin-left: -${({ theme }) => theme.spacing(0.5)}px;
  }
`

export const Meta = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const CreationDate = styled.span`
  color: ${({ theme: { palette } }) => palette.primary.light};
  font-weight: 400;
  white-space: nowrap;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing(1)}px;
  }
`

export const ShareIcon = styled.img`
  cursor: pointer;
  width: 24px;
  height: auto;
  margin-top: 8px;
`

export const SubHeader = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3.5)}px;
  display: flex;
`

export const Action = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
  cursor: pointer;
  color: ${({ theme: { palette } }) => palette.secondary.main}
`

export const Price = styled.span`
  margin-left: auto;
  color: ${({ theme: { palette } }) => palette.primary.main}
`

export const Body = styled.div`
  
`

export const ImageWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3.5)}px;
  position: relative;
`

export const Image = styled(LazyLoadImage)`
  height: 240px;
  object-fit: cover;
`

export const ImagePlaceholder = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.primary.light};
  background-color: ${({ theme }) => lighten(theme.palette.primary.light, 0.9)};
  height: 240px;
  width: 100%;
`

export const ImageCounter = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)}px;
  right: ${({ theme }) => theme.spacing(2)}px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing(1)}px;
  }
`

export const Title = styled.h3`
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme: { palette } }) => palette.primary.main}
`

export const CommentListStyled = styled(CommentsList)`
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  
  li:first-child {
    margin-top: 0 !important;
  }
`

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
`
