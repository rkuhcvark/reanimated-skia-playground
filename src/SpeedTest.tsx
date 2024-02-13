/** @format */

import { StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Reactotron from 'reactotron-react-native'
import {
  Canvas,
  Fill,
  useDrawCallback,
  Skia,
  PaintStyle,
  SkiaView,
  Group,
  Circle,
  FillType,
  BlendMode,
  TileMode,
  vec,
  Path,
  LinearGradient,
  SweepGradient,
  Paint,
  RadialGradient,
  Shadow,
  BlurMask,
  Turbulence,
  Blend,
  Shader,
  Vertices,
  Text,
  matchFont,
  useFonts,
  useFont,
  clamp,
  Paragraph,
  TextAlign,
  SkTextStyle,
  interpolateColors,
  interpolate,
  Rect,
  TwoPointConicalGradient,
} from '@shopify/react-native-skia'

import Slider from '@react-native-community/slider'
import { runOnUI, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'

const ticks = [0, 1, 5, 10, 20, 30, 50, 75, 100]

const SpeedTest = () => {
  const { width, height } = useWindowDimensions()
  const speed = useSharedValue(0)

  const customFontMgr = useFonts({
    Gauge: [require('../assets/fonts/Gauge-Regular.ttf')],
    Montserrat: [require('../assets/fonts/Montserrat-Bold.ttf')],
  })

  const strokeWidth = 25
  const _r = width / 3 + 15 // Radius of the speedometer
  const cx = width / 2 // Center x-coordinate
  const cy = height / 2 // Center y-coordinate

  const startAngle = 135
  const endAngle = 405

  const cLength = endAngle - startAngle

  const maxValue = 100 // Maximum value of the speedometer

  const calculateTickPosition = (value: number, index: number) => {
    const startAngle = -Math.PI - 1 // Starting from the left
    const endAngle = 1 // To the right (half-circle)

    // let angle = (index / ticks.length) * (endAngle - startAngle) + startAngle

    const diff = endAngle - startAngle
    const singleTickAngle = diff / ticks.length
    const ticksLength = ticks.length

    let angle = startAngle + singleTickAngle * index

    angle = interpolate(index, [0, ticksLength], [startAngle, endAngle]) + singleTickAngle / 2

    Reactotron.log('DEBUG', {
      startAngle,
      endAngle,
      diff,
      singleTickAngle,
      value,
      angle,
      ticksLength,
    })

    const r = _r - strokeWidth - 5

    const x = cx - 20 + r * Math.cos(angle)
    const y = cy - 10 + r * Math.sin(angle)
    return { x, y, angle }
  }

  const tickData = ticks.reduce((acc, tick, index) => {
    acc[tick] = calculateTickPosition(tick, index)

    return acc
  }, {})

  const backgroundColor = 'rgb(20,25,32)'

  const sweepAngle = useDerivedValue(() => {
    // const startAngle = -Math.PI - 1 // Starting from the left
    // const endAngle = 1 // To the right (half-circle)

    let angle = (endAngle - startAngle) * (speed.value / maxValue)

    let slice = 270 / (ticks.length - 1)

    console.log('slice', slice)

    let arr = ticks.map((_, i) => i * slice)

    console.log('arr', arr)

    angle = interpolate(speed.value, ticks, arr)

    console.log('angle', angle)

    return angle
    const iAngle = interpolate(angle, [], [])

    return iAngle
  })

  const BackgroundArc = () => {
    const path = useDerivedValue(() => {
      const r = _r
      const path = Skia.Path.Make()
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        endAngle - startAngle
      )
      return path
    })

    return (
      <Path
        path={path}
        style='stroke'
        strokeWidth={strokeWidth}
        color={Skia.Color('rgba(255,255,255,0.2)')}
      />
    )
  }

  const ActiveArc = () => {
    const path = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const r = _r
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        sweepAngle.value
      )

      return path
    })

    return (
      <Path path={path} style='stroke' strokeWidth={strokeWidth}>
        <LinearGradient
          start={vec(0, cy)}
          end={vec(width, cy)}
          colors={['rgba(0, 171, 231, 1)', 'blue']}
        />
      </Path>
    )
  }

  const NegativeArc = () => {
    const path = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const r = _r - strokeWidth
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        -(360 - sweepAngle.value)
      )

      return path
    })

    const outerPath = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const r = _r + strokeWidth
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        sweepAngle.value
      )

      return path
    })

    const color = backgroundColor

    return (
      <Group>
        <Path path={path} style='stroke' strokeWidth={strokeWidth * 5} color={color} />
        <Path path={outerPath} style='stroke' strokeWidth={strokeWidth} color={color} />
      </Group>
    )
  }

  const ShadowArc = () => {
    const path = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const r = _r - strokeWidth / 2
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        sweepAngle.value
      )

      return path
    })

    return (
      <Path
        path={path}
        style='stroke'
        strokeWidth={strokeWidth * 1.5}
        opacity={0.5}
        color='rgba(0, 171, 231, 1)'>
        <LinearGradient
          start={vec(0, cy)}
          end={vec(width, cy)}
          colors={['rgba(0, 171, 231, 1)', 'blue']}
        />
        <BlurMask blur={30} respectCTM={false} />
      </Path>
    )
  }

  const Needle = () => {
    const topWidth = 10
    const bottomWidth = topWidth / 2
    const height = 100

    const path = useDerivedValue(() => {
      const path = Skia.Path.Make()

      path.moveTo(cx - topWidth, cy)
      path.lineTo(cx + topWidth, cy)
      path.lineTo(cx + bottomWidth, cy - height)
      path.lineTo(cx - bottomWidth, cy - height)

      return path
    })

    const transform = useDerivedValue(() => {
      const startAngleRadians = startAngle * (Math.PI / 180)
      const currentAngleRadians = (sweepAngle.value + startAngle) * (Math.PI / 180)
      const rotate = currentAngleRadians - startAngleRadians * 2

      return [
        {
          rotate,
        },
      ]
    })

    return (
      <Group transform={transform} origin={{ x: cx, y: cy }}>
        <Path path={path} origin={{ x: cx, y: cy }}>
          <LinearGradient
            start={vec(cx, cy)} // Start point of gradient
            end={vec(cx, cy - 130)} // End point of gradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} // Colors for the gradient
          />
        </Path>
      </Group>
    )
  }

  const Tick = ({ number }: { number: number }) => {
    const alpha = useSharedValue(0.5)
    const paragraph = useDerivedValue(() => {
      if (!customFontMgr) {
        return null
      }

      const paragraphStyle = {
        textAlign: TextAlign.Center,
      }

      alpha.value = interpolate(speed.value, [0, number - 10, number], [0.5, 0.5, 1])

      const textStyle = {
        color: Skia.Color(`rgba(255,255,255,${alpha.value})`),
        fontFamilies: ['Montserrat'],
        fontSize: 16,
      }

      return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
        .pushStyle(textStyle)
        .addText(number.toString())
        .build()
    }, [customFontMgr])

    const { x, y } = tickData[number]

    return <Paragraph x={x} y={y} width={40} paragraph={paragraph} />
  }

  const SpeedParagraph = () => {
    if (!customFontMgr) {
      return null
    }

    const r = (_r * 0.75) / 2

    const paragraph = useDerivedValue(() => {
      if (!customFontMgr) {
        return null
      }

      const paragraphStyle = {
        textAlign: TextAlign.Center,
      }

      const textStyle: SkTextStyle = {
        color: Skia.Color('white'),
        fontFamilies: ['Gauge'],
        fontSize: 42,
      }

      const text = `${speed.value.toFixed(2).toString()}`

      return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
        .pushStyle(textStyle)
        .addText(text)
        .pushStyle(textStyle)
        .build()
    }, [customFontMgr])

    return <Paragraph paragraph={paragraph} x={cx - r + 5} y={cy + r + 20} width={100} />
  }

  const SpeedCounter = () => {
    const font = useFont(require('../assets/fonts/Gauge-Regular.ttf'), 42)

    const r = _r * 0.75

    const text = useDerivedValue(() => {
      return `${speed.value.toFixed(2).toString()}`
    })

    const d = 7,
      base = 29

    const transform = useDerivedValue(() => {
      const digitLength = speed.value.toFixed(0).toString().length
      const translateX = cx - base - d * clamp(digitLength - 1, 0, Infinity)

      return [
        {
          translateX,
        },
      ]
    })

    return (
      <Text
        y={cy + 5 + r}
        font={font}
        text={text}
        color='rgba(255,255,255,1)'
        transform={transform}
      />
    )
  }

  const Dummy = () => {
    const path = Skia.Path.Make()

    path.addCircle(cx - 20, cy + _r, 5)

    path.addRect({ x: cx - 60, y: cy + _r, height: 50, width: 10 })
    path.addRect({ x: cx + 50, y: cy + _r, height: 50, width: 10 })

    return <Path path={path} color='red' />
  }

  const handleValueChange = (value: number) => {
    speed.value = value
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Canvas style={{ flex: 1 }}>
        <ActiveArc />
        <ShadowArc />
        <NegativeArc />
        <Needle />
        <BackgroundArc />
        <SpeedParagraph />
        {ticks.map((tick, i) => (
          <Tick key={i} number={tick} />
        ))}

        {/* <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, cy)}
            end={vec(width, cy)}
            colors={['rgba(0, 171, 231, 1)', 'blue']}
          />
        </Rect> */}

        {/* <Dummy /> */}
      </Canvas>

      <View style={{ flex: 1 / 3 }}>
        <Slider
          style={{ width: width / 2, height: 40, left: width / 4 }}
          minimumValue={0}
          maximumValue={maxValue}
          minimumTrackTintColor='#FFFFFF'
          maximumTrackTintColor='#000000'
          value={speed.value}
          onValueChange={handleValueChange}
        />
      </View>
    </View>
  )
}

export default SpeedTest

const styles = StyleSheet.create({
  tickLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  speedLabel: {
    fontSize: 32,
    fontWeight: 'bold',
  },
})
