import React from 'react'
import {Button} from '@mantine/core';

interface IFloorButtonProps {
  buttonNumber: number
  active: boolean,
  onClick: () => any
}

export const FloorButton: React.FC<IFloorButtonProps> =
  ({
     buttonNumber,
     active,
     onClick
  }) => {

  //Render
  return (
    <Button uppercase color={active ? 'green' : 'gray'} radius={'md'} onClick={onClick}>
      {buttonNumber} этаж
    </Button>
  )


}