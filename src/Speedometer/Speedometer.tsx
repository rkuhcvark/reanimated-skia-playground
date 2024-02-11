/** @format */

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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
} from '@shopify/react-native-skia'

import Slider from '@react-native-community/slider'
import { runOnUI, useDerivedValue, useSharedValue } from 'react-native-reanimated'

const ticks = [0, 5, 10, 20, 30, 50, 75, 100]

const Speedometer = () => {
  const { width, height } = useWindowDimensions()

  const speed = useSharedValue(0)

  const strokeWidth = 25
  const r = width / 3 // Radius of the speedometer
  const cx = width / 2 // Center x-coordinate
  const cy = height / 2 // Center y-coordinate

  const startAngle = 135
  const endAngle = 405
  const maxValue = 100 // Maximum value of the speedometer

  const backgroundColor = 'rgb(20,25,32)'

  const sweepAngle = useDerivedValue(() => {
    return (endAngle - startAngle) * (speed.value / maxValue)
  })

  const BackgroundArc = () => {
    const path = useDerivedValue(() => {
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
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        sweepAngle.value
      )

      return path
    })

    return <Path path={path} style='stroke' strokeWidth={strokeWidth} color='#00ABE7' />
  }

  const SolidArc = () => {
    const innerPath = Skia.Path.Make()
    const getPos = (value: number) => {
      return value - r / 2
    }

    innerPath.addArc(
      { x: getPos(cx), y: getPos(cy), width: r, height: r },
      endAngle,
      startAngle - 45
    )

    const outerPath = Skia.Path.Make()
    const _r = r + strokeWidth
    outerPath.addArc(
      { x: cx - _r, y: cy - _r, width: _r * 2, height: _r * 2 },
      startAngle,
      sweepAngle.value
    )

    const color = backgroundColor

    return (
      <Group>
        <Path path={innerPath} style='stroke' strokeWidth={r * 1.57} color={color} />
        <Path path={outerPath} style='stroke' strokeWidth={strokeWidth} color={color} />
      </Group>
    )
  }

  const ShadowArc = () => {
    const _r = r - strokeWidth / 2
    const path = useDerivedValue(() => {
      const path = Skia.Path.Make()
      path.addArc(
        { x: cx - _r, y: cy - _r, width: _r * 2, height: _r * 2 },
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

  const handleValueChange = (value: number) => {
    speed.value = value
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Canvas style={{ flex: 1 }}>
        <BackgroundArc />
        <ActiveArc />
        <ShadowArc />
        <SolidArc />
        <Needle />
      </Canvas>

      <View style={{ flex: 1 / 3 }}>
        <Slider
          style={{ width: width / 2, height: 40, left: width / 4 }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor='#FFFFFF'
          maximumTrackTintColor='#000000'
          value={speed.value}
          onValueChange={handleValueChange}
        />
      </View>
    </View>
  )
}

export default Speedometer

const styles = StyleSheet.create({})
