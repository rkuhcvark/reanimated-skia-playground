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

  const ShadowArc = () => {
    const path = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const _r = r - strokeWidth
      path.addArc(
        { x: cx - _r, y: cy - _r, width: _r * 2, height: _r * 2 },
        startAngle,
        sweepAngle.value
      )

      return path
    })

    return (
      <Path path={path} style='stroke' strokeWidth={strokeWidth} color='rgba(0, 171, 231, 0.2)' />
    )
  }

  const handleValueChange = (value: number) => {
    speed.value = value
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'rgb(20,25,32)' }}>
      <Canvas style={{ flex: 1 }} mode='continuous'>
        <BackgroundArc />
        <ActiveArc />
        <ShadowArc />
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

// // Text paint
// const textPaint = paint.copy()
// textPaint.setColor(Skia.Color('#fff'))
// //   textPaint.setTextSize(20)

// const drawSpeedometer = useDrawCallback(
//   canvas => {
//     //   // Paint for ticks
//     //   const tickPaint = paint.copy()
//     //   tickPaint.setColor(Skia.Color('#FFFFFF'))
//     //   tickPaint.setStrokeWidth(2) // Thin lines for ticks

//     //   // Draw ticks
//     //   ticks.forEach(value => {
//     //     const tickAngle = startAngle + (endAngle - startAngle) * (value / 100)
//     //     const innerTickRadius = r - strokeWidth / 2
//     //     const outerTickRadius = r + 10 // Extend 10 pixels out from the arc
//     //     const tickPath = Skia.Path.Make()
//     //     tickPath.moveTo(
//     //       cx + innerTickRadius * Math.cos((tickAngle * Math.PI) / 180),
//     //       cy + innerTickRadius * Math.sin((tickAngle * Math.PI) / 180)
//     //     )
//     //     tickPath.lineTo(
//     //       cx + outerTickRadius * Math.cos((tickAngle * Math.PI) / 180),
//     //       cy + outerTickRadius * Math.sin((tickAngle * Math.PI) / 180)
//     //     )
//     //     canvas.drawPath(tickPath, tickPaint)
//     //   })

//     const paint = Skia.Paint()
//     paint.setAntiAlias(true)
//     paint.setStyle(PaintStyle.Fill) // Fill the path with the gradient

//     // Define the gradient for the needle
//     const start = Skia.Point(0, 0) // Start point of the gradient
//     const end = Skia.Point(0, 100) // End point of the gradient
//     const colors = [Skia.Color('#FFFFFF'), Skia.Color('#0000FF')] // Gradient colors
//     const positions = [0, 1] // Position of gradient colors

//     // Create the gradient shader
//     const shader = Skia.Shader.MakeLinearGradient(start, end, colors, positions, TileMode.Clamp)

//     // Apply the gradient to the paint
//     paint.setShader(shader)

//     // Create the path for the needle shape
//     const path = Skia.Path.Make()
//     // Define the needle shape according to the image provided
//     // Below is an example; adjust points to match the desired needle shape
//     path.moveTo(cx - 20, cy) // Starting point
//     path.lineTo(cx + 20, cy) // Top edge of the needle
//     path.lineTo(cx, cx) // Bottom right corner of the needle
//     path.lineTo(cx, cx) // Bottom left corner of the needle
//     const matrix = Skia.Matrix()

//     matrix.rotate(45)
//     path.transform(matrix)

//     //   path.rMoveTo(10, 10)

//     const needleR = r - 40

//     const needleAngle = startAngle + sweepAngle
//     //   path.lineTo(
//     //     cx + needleR * Math.cos((needleAngle * Math.PI) / 180),
//     //     cy + needleR * Math.sin((needleAngle * Math.PI) / 180)
//     //   ) // Tip of the needle
//     path.close() // Close the path to create a solid shape

//     // Draw the needle
//     canvas.drawPath(path, paint)

//     // Draw needle
//     // Calculate the needle angle and position based on the current value
//     //   const needlePath = Skia.Path.Make()
//     //   needlePath.moveTo(cx, cy) // Center

//     //   // Needle paint
//     //   const needlePaint = paint.copy()
//     //   needlePaint.setColor(Skia.Color('#fff'))
//     //   needlePaint.setAntiAlias(true)
//     //   needlePaint.setStyle(PaintStyle.Stroke)
//     //   needlePaint.setStrokeWidth(5)

//     //   const needleShader = Skia.Shader.MakeLinearGradient(
//     //     vec(0, width),
//     //     vec(height, 0),
//     //     [Skia.Color('rgba(255,255,255,1)'), Skia.Color('rgba(255,255,0,0.2)')],
//     //     [0, 1],
//     //     TileMode.Clamp
//     //   )
//     //   needlePaint.setShader(needleShader)

//     //   const needleR = r - 40

//     //   const needleAngle = startAngle + sweepAngle
//     //   needlePath.lineTo(
//     //     cx + needleR * Math.cos((needleAngle * Math.PI) / 180),
//     //     cy + needleR * Math.sin((needleAngle * Math.PI) / 180)
//     //   ) // Tip of the needle
//     //   canvas.drawPath(needlePath, needlePaint)

//     // Draw numeric value
//     //   canvas.drawText(`${speedometerValue.toFixed(2)} Mbps`, cx - r / 2, cy + r * 0.75, textPaint)
//   },
//   [speed.value]
// )
