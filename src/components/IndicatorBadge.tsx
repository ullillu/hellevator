import React from 'react'
import {Badge} from '@mantine/core';

interface IIndicatorBadgeProps {
  active: boolean,
  title: string,
  emergency?: boolean
}

export const IndicatorBadge: React.FC<IIndicatorBadgeProps> =
  ({
     active,
    title,
     emergency = false
   }) => {

  //Render
  return (
    <Badge color={active ? emergency ? 'red' : 'green' : 'gray'} variant={active ? 'filled' : 'outline'}>
      {title}
    </Badge>
  )


}