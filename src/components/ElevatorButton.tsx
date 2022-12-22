import React from 'react'
import {Button} from '@mantine/core';

interface IElevatorButtonProps {
  buttonNumber: number,
  active: boolean,
  onClick: () => any
}

export const ElevatorButton: React.FC<IElevatorButtonProps> =
  ({
     buttonNumber,
     active,
     onClick
  }) => {

  //Render
  return (
    <Button color={active ? 'green' : 'gray'} radius={'md'} onClick={onClick}>
      { buttonNumber }
    </Button>
  )


}