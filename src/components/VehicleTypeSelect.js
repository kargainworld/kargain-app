import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

const VehicleTypesWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  cursor: pointer;
  user-select: none;
`

const VehicleTypeContainer = styled.div`
  border: 1px solid ${({ selected, theme: { palette: { primary } } }) => selected ? primary.main : primary.light};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`

export const VehicleTypeSelect = ({ items = [], value, onChange, style }) => (
    <VehicleTypesWrapper style={style}>
        {items.map(({ label, value: itemValue, img, imgSelected }) => {
            const isActive = itemValue === value

            return (
                <VehicleTypeContainer selected={isActive} onClick={() => onChange(itemValue)}>
                    <img
                        src={isActive ? `/images/${imgSelected}` : `/images/${img}`}
                        alt={label}
                        title={label}
                    />

                    <Typography
                        variant="h3"
                        style={{
                            color: isActive ? '#000' : '#999',
                            marginTop: 20
                        }}
                    >
                        {label}
                    </Typography>
                </VehicleTypeContainer>
            )
        })}
    </VehicleTypesWrapper>
)

export default VehicleTypeSelect
