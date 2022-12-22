import React, {useEffect, useRef, useState} from 'react';
import {Container, Center, Paper, Group, Stack, Text, Divider, Button} from '@mantine/core';
import {FloorButton} from './components/FloorButton';
import {ElevatorButton} from './components/ElevatorButton';
import {IndicatorBadge} from './components/IndicatorBadge';

const defaultIndicatorsState = [false, false, true, false, false]
const defaultCalls = [false, false, false, false, false, false]

function App() {
  const [calls, setCalls] = useState(defaultCalls)

  const [floorCalls, setFloorCalls] = useState(defaultCalls)
  const floorCallsRef = useRef(floorCalls)
  floorCallsRef.current = floorCalls

  const [elevatorCalls, setElevatorCalls] = useState(defaultCalls)
  const elevatorCallsRef = useRef(elevatorCalls)
  elevatorCallsRef.current = elevatorCalls

  const [indicatorsState, setIndicatorsState] = useState(defaultIndicatorsState)

  const [currentFloor, setCurrentFloor] = useState(0)
  const currentFloorRef = useRef(currentFloor)
  currentFloorRef.current = currentFloor

  useEffect(() => {
    console.log('engine: ', indicatorsState[1])

    if (indicatorsState[1]) {
      const interval = setInterval(async () => {
        setCurrentFloor(currentFloor => indicatorsState[2] ? currentFloor + 1 : currentFloor - 1)

        const tCurrentFloor = indicatorsState[2] ? currentFloorRef.current + 1 : currentFloorRef.current - 1
        console.log(tCurrentFloor)

        if (calls[tCurrentFloor]) {
          console.log('here')
          //выключить движок
          setIndicatorsState(a => ([
            a[0],
            a[1] = false,
            ...a.slice(2, 5)
          ]))
          let t = [...elevatorCalls]
          t[tCurrentFloor] = false
          setElevatorCalls(t)
          t = [...floorCalls]
          t[tCurrentFloor] = false
          setFloorCalls(t)
          t = [...calls]
          t[tCurrentFloor] = false
          setCalls(t)

          //открыть двери
          setIndicatorsState(a => ([
            a[0] = true,
            ...a.slice(1, 5)
          ]))

          await timeout(5000)

          //закрыть двери
          setIndicatorsState(a => ([
            a[0] = false,
            ...a.slice(1, 5)
          ]))

        }
      }, 2000)
      return () => clearInterval(interval);
    }
  }, [indicatorsState])

  useEffect(() => {
    const checkElevator = elevatorCallsRef.current.reduce(
      (a, curr) => a || curr
    )
    const checkFloors = floorCallsRef.current.reduce(
      (a, curr) => a || curr
    )

    // console.log('floorCalls: ', floorCallsRef.current)
    // console.log('useEffect2: ', !indicatorsState[1], checkElevator, checkFloors)

    if (!indicatorsState[1] && (checkElevator || checkFloors)) {
      const interval = setInterval(() => {
        // console.log('in interval 2')
        //проверить направление движения
        checkDirection()

        //включить двигатель
        setIndicatorsState(a => ([
          a[0],
          a[1] = true,
          ...a.slice(2, 5)
        ]))

      }, 1000)
      return () => clearInterval(interval);
    }

  }, [indicatorsState, elevatorCalls, floorCalls])


  const breakCableClick = () => {
    setFloorCalls(a => a.map(e => false))
    setElevatorCalls(a => a.map(e => false))
    setCalls(a => a.map(e => false))

    setIndicatorsState(a => ([
      a[0] = false,
      a[1] = false,
      a[2],
      a[3] = true,
      a[4] = true
    ]))
  }

  const checkDirection = () => {
    const currentDirection = indicatorsState[2]
    console.log('curr dir: ', currentDirection)
    const t = currentDirection ? calls.slice(currentFloorRef.current, 6) :
      currentFloorRef.current === 0 ? calls.slice(0, currentFloorRef.current + 1) :
      calls.slice(0, currentFloorRef.current)
    const checkT = t.reduce(
      (a, curr) => a || curr
    )
    if (!checkT) {
      setIndicatorsState(a => ([
        ...a.slice(0, 2),
        a[2] = !currentDirection,
        ...a.slice(3, 5)
      ]))
    }
  }

  const timeout = (delay: number) => {
    return new Promise(res => setTimeout(res, delay))
  }


  const onButtonClick = (floor: number, isInElevator: boolean) => {
    if (isInElevator) {
      const t = [...elevatorCalls]
      t[floor - 1] = true
      setElevatorCalls(t)
    } else {
      const t = [...floorCalls]
      t[floor - 1] = true
      setFloorCalls(t)
    }
    const t = [...calls]
    t[floor - 1] = true
    setCalls(t)
    // console.log(t)
  }


  return (
    <Container sx={{height: '100vh'}}>
      <Center sx={{height: '100%'}}>
        <Paper shadow={'md'} p={'md'} withBorder sx={{minWidth: '450px'}}>
          <Text align={'center'} fz={30} weight={300}>
            {currentFloor + 1} этаж
          </Text>
          <Divider my={10}/>
          <Text mb={0} align={'center'} fz={20} weight={300}>
            Кнопки вызова
          </Text>
          <Group position={'center'} align={'flex-start'} spacing={50}>
            <Stack>
              <Text align={'center'} fz={20} weight={300}>
                На этажах
              </Text>
              {
                floorCalls.map((floor, index) => {
                  const buttonNumber = index + 1
                  return (
                    <FloorButton onClick={() => onButtonClick(buttonNumber, false)} active={floor}
                                 buttonNumber={buttonNumber} key={index}/>
                  )
                })
              }
            </Stack>
            <Stack>
              <Text align={'center'} fz={20} weight={300}>
                В лифте
              </Text>
              {
                elevatorCalls.reduce(
                  function (accumulator, currentValue, currentIndex, array) {
                    if (currentIndex % 2 === 0) { // @ts-ignore
                      accumulator.push(array.slice(currentIndex, currentIndex + 2));
                    }
                    return accumulator;
                  }, []).map((floor, index) => {
                  const buttonNumber1 = index + (index + 1)
                  const buttonNumber2 = index + (index + 2)
                  return (
                    <Group key={index}>
                      <ElevatorButton onClick={() => onButtonClick(buttonNumber1, true)} active={floor[0]}
                                      buttonNumber={buttonNumber1}/>
                      <ElevatorButton onClick={() => onButtonClick(buttonNumber2, true)} active={floor[1]}
                                      buttonNumber={buttonNumber2}/>
                    </Group>
                  )
                })
              }
            </Stack>
          </Group>
          <Divider mt={20} mb={10}/>
          <Text mb={10} align={'center'} fz={20} weight={300}>
            Индикаторы
          </Text>
          <Group position={'apart'}>
            <Stack>
              <IndicatorBadge active={indicatorsState[0]} title={'Дверь'}/>
              <IndicatorBadge active={indicatorsState[1]} title={'Движок'}/>
              <Group spacing={5} mb={20}>
                <IndicatorBadge active={indicatorsState[2]} title={'Вверх'}/>
                <IndicatorBadge active={!indicatorsState[2]} title={'Вниз'}/>
              </Group>
              <IndicatorBadge active={indicatorsState[3]} title={'Торможение'} emergency={true}/>
              <IndicatorBadge active={indicatorsState[4]} title={'Тревога'} emergency={true}/>
            </Stack>
            <Center sx={{width: '50%'}}>
              <Button onClick={breakCableClick} color={'red'} variant={'outline'} uppercase>Оборвать трос</Button>
            </Center>
          </Group>
        </Paper>
      </Center>
    </Container>
  );
}

export default App;
