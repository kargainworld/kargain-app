import styled from "styled-components"
import * as g from "@geist-ui/react"
import * as i from "@geist-ui/react-icons"
import { LazyLoadImage } from "react-lazy-load-image-component"
import CommentsList from "../Comments/CommentsList"

export const Root = styled(g.Card)`
  display: flex;
  flex-direction: column;
`

export const User = styled.div`
  display: flex;
`

export const Avatar = styled(g.Avatar)`
    margin-right: ${({ theme }) => theme.spacing(1, 'px')} !important;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const AuthorName = styled(g.Link)`
  font-size: 16px;
`

export const Location = styled(g.Link)`
  display: flex !important;
  align-items: center !important;
  font-size: 16px !important;
  color: ${({ theme }) => theme.colors.primary3} !important;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing(1, 'px')};
  }
`

export const Meta = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const CreationDate = styled.span`
  color: ${({ theme }) => theme.colors.primary3};
  font-weight: 400;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing(1, 'px')};
  }
`

export const ShareIcon = styled(i.Share2)`
  color: ${({ theme }) => theme.colors.primary3} !important;
  cursor: pointer;
`

export const SubHeader = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3.5, 'px')};
  display: flex;
`

export const Action = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing(1, 'px')};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary6}
`

export const Price = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.primary6}
`

export const Body = styled.div`
  
`

export const ImageWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3.5, 'px')};
  position: relative;
`

export const Image = styled(LazyLoadImage)`
  height: 240px;
  object-fit: cover;
`

export const ImageCounter = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2, 'px')};
  right: ${({ theme }) => theme.spacing(2, 'px')};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing(1, 'px')};
  }
`

export const Title = styled.h3`
  margin-top: ${({ theme }) => theme.spacing(3, 'px')};
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary8}
`

export const CommentListStyled = styled(CommentsList)`
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing(3, 'px')};
  
  li:first-child {
    margin-top: 0 !important;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-left: -${({ theme }) => theme.spacing(1, 'px')};
  margin-right: -${({ theme }) => theme.spacing(1, 'px')};
  
  & > * {
    margin: 0 ${({ theme }) => theme.spacing(1, 'px')};
  }
`
