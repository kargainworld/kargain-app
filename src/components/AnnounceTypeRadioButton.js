import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

const AnnounceTypeRadioButtonContainer = styled.div`
  flex: 1;
  position: relative;
  margin-bottom: 39px;
`

const AnnounceTypeRadioButtonLabel = styled.label`
  border-bottom: 2px solid ${({ theme }) => theme.palette.customgray.main};
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding: 8px;
  
  & * {
    color: ${({ theme }) => theme.palette.customgray.dark} !important;
  }
  
  input:checked + & {
    border-bottom: 3px solid ${({ theme }) => theme.palette.secondary.main};

    & * {
      color: ${({ theme }) => theme.palette.secondary.main} !important;
    }
  }
`

export const AnnounceTypeRadioButton = ({ register, name, id, value, label }) => (
    <AnnounceTypeRadioButtonContainer>
        <input
            id={id}
            type="radio"
            name={name}
            value={value}
            ref={register}
            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
        />

        <AnnounceTypeRadioButtonLabel component="label" htmlFor={id}>
            <Typography variant="h3">
                {label}
            </Typography>
        </AnnounceTypeRadioButtonLabel>
    </AnnounceTypeRadioButtonContainer>
)

export default AnnounceTypeRadioButton
