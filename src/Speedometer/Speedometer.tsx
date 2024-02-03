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
} from '@shopify/react-native-skia'

import Slider from '@react-native-community/slider'
import { useSharedValue } from 'react-native-reanimated'

const ticks = [0, 5, 10, 20, 30, 50, 75, 100]

const Speedometer = () => {
  const { width, height } = useWindowDimensions()

  const [_speed, setSpeed] = useState(10)
  const speed = useSharedValue(10)

  useEffect(() => {
    speed.value = _speed
  }, [_speed])

  const strokeWidth = 25
  const r = width / 3 // Radius of the speedometer
  const cx = width / 2 // Center x-coordinate
  const cy = height / 2 // Center y-coordinate

  const startAngle = 135
  const endAngle = 405

  const maxValue = 100 // Maximum value of the speedometer

  const paint = Skia.Paint()
  paint.setAntiAlias(true)

  // Background arc paint
  const bgPaint = paint.copy()
  bgPaint.setColor(Skia.Color('rgba(255,255,255,0.2)'))
  bgPaint.setStyle(PaintStyle.Stroke)
  bgPaint.setStrokeWidth(strokeWidth)

  // Active value arc paint
  const activeArcPaint = paint.copy()
  activeArcPaint.setColor(Skia.Color('#00ABE7'))
  activeArcPaint.setStyle(PaintStyle.Stroke)
  activeArcPaint.setStrokeWidth(strokeWidth)

  const shadowArcPaint = activeArcPaint.copy()
  //   const shadowArcShader = Skia.Shader.MakeLinearGradient(
  //     Skia.XYWHRect(0, 0, 100, 100),
  //     Skia.XYWHRect(0, 0, 100, 100),
  //     [Skia.Color('red'), Skia.Color('blue')],
  //     [0, 1],
  //     TileMode.Clamp
  //   )
  shadowArcPaint.setAlphaf(0.2)
  //   shadowArcPaint.setShader(shadowArcShader)

  //   shadowArcPaint.setColor(Skia.Color('red'))

  // Text paint
  const textPaint = paint.copy()
  textPaint.setColor(Skia.Color('#fff'))
  //   textPaint.setTextSize(20)

  const drawSpeedometer = useDrawCallback(
    canvas => {
      // Draw background arc
      const bgPath = Skia.Path.Make()
      bgPath.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        endAngle - startAngle
      )
      canvas.drawPath(bgPath, bgPaint)

      // Draw active value arc
      const activeArcPath = Skia.Path.Make()
      const sweepAngle = (endAngle - startAngle) * (speed.value / maxValue)
      activeArcPath.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        sweepAngle
      )
      canvas.drawPath(activeArcPath, activeArcPaint)

      // Shadow arc
      const shadowArcPath = Skia.Path.Make()
      const shadowArcR = r - strokeWidth
      shadowArcPath.addArc(
        { x: cx - shadowArcR, y: cy - shadowArcR, width: shadowArcR * 2, height: shadowArcR * 2 },
        startAngle,
        sweepAngle
      )
      canvas.drawPath(shadowArcPath, shadowArcPaint)

      //   // Paint for ticks
      //   const tickPaint = paint.copy()
      //   tickPaint.setColor(Skia.Color('#FFFFFF'))
      //   tickPaint.setStrokeWidth(2) // Thin lines for ticks

      //   // Draw ticks
      //   ticks.forEach(value => {
      //     const tickAngle = startAngle + (endAngle - startAngle) * (value / 100)
      //     const innerTickRadius = r - strokeWidth / 2
      //     const outerTickRadius = r + 10 // Extend 10 pixels out from the arc
      //     const tickPath = Skia.Path.Make()
      //     tickPath.moveTo(
      //       cx + innerTickRadius * Math.cos((tickAngle * Math.PI) / 180),
      //       cy + innerTickRadius * Math.sin((tickAngle * Math.PI) / 180)
      //     )
      //     tickPath.lineTo(
      //       cx + outerTickRadius * Math.cos((tickAngle * Math.PI) / 180),
      //       cy + outerTickRadius * Math.sin((tickAngle * Math.PI) / 180)
      //     )
      //     canvas.drawPath(tickPath, tickPaint)
      //   })

      const paint = Skia.Paint()
      paint.setAntiAlias(true)
      paint.setStyle(PaintStyle.Fill) // Fill the path with the gradient

      // Define the gradient for the needle
      const start = Skia.Point(0, 0) // Start point of the gradient
      const end = Skia.Point(0, 100) // End point of the gradient
      const colors = [Skia.Color('#FFFFFF'), Skia.Color('#0000FF')] // Gradient colors
      const positions = [0, 1] // Position of gradient colors

      // Create the gradient shader
      const shader = Skia.Shader.MakeLinearGradient(start, end, colors, positions, TileMode.Clamp)

      // Apply the gradient to the paint
      paint.setShader(shader)

      // Create the path for the needle shape
      const path = Skia.Path.Make()
      // Define the needle shape according to the image provided
      // Below is an example; adjust points to match the desired needle shape
      path.moveTo(cx - 20, cy) // Starting point
      path.lineTo(cx + 20, cy) // Top edge of the needle
      path.lineTo(cx, cx) // Bottom right corner of the needle
      path.lineTo(cx, cx) // Bottom left corner of the needle
      const matrix = Skia.Matrix()

      matrix.rotate(45)
      path.transform(matrix)

      //   path.rMoveTo(10, 10)

      const needleR = r - 40

      const needleAngle = startAngle + sweepAngle
      //   path.lineTo(
      //     cx + needleR * Math.cos((needleAngle * Math.PI) / 180),
      //     cy + needleR * Math.sin((needleAngle * Math.PI) / 180)
      //   ) // Tip of the needle
      path.close() // Close the path to create a solid shape

      // Draw the needle
      canvas.drawPath(path, paint)

      // Draw needle
      // Calculate the needle angle and position based on the current value
      //   const needlePath = Skia.Path.Make()
      //   needlePath.moveTo(cx, cy) // Center

      //   // Needle paint
      //   const needlePaint = paint.copy()
      //   needlePaint.setColor(Skia.Color('#fff'))
      //   needlePaint.setAntiAlias(true)
      //   needlePaint.setStyle(PaintStyle.Stroke)
      //   needlePaint.setStrokeWidth(5)

      //   const needleShader = Skia.Shader.MakeLinearGradient(
      //     vec(0, width),
      //     vec(height, 0),
      //     [Skia.Color('rgba(255,255,255,1)'), Skia.Color('rgba(255,255,0,0.2)')],
      //     [0, 1],
      //     TileMode.Clamp
      //   )
      //   needlePaint.setShader(needleShader)

      //   const needleR = r - 40

      //   const needleAngle = startAngle + sweepAngle
      //   needlePath.lineTo(
      //     cx + needleR * Math.cos((needleAngle * Math.PI) / 180),
      //     cy + needleR * Math.sin((needleAngle * Math.PI) / 180)
      //   ) // Tip of the needle
      //   canvas.drawPath(needlePath, needlePaint)

      // Draw numeric value
      //   canvas.drawText(`${speedometerValue.toFixed(2)} Mbps`, cx - r / 2, cy + r * 0.75, textPaint)
    },
    [speed.value]
  )

  return (
    <View style={{ flex: 1, backgroundColor: 'rgb(20,25,32)' }}>
      <SkiaView style={{ flex: 1 }} onDraw={drawSpeedometer} />

      <View style={{ flex: 1 / 3 }}>
        <Slider
          style={{ width: width / 2, height: 40, left: width / 4 }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor='#FFFFFF'
          maximumTrackTintColor='#000000'
          value={speed.value}
          onValueChange={setSpeed}
        />
      </View>
    </View>
  )
}

export default Speedometer

const styles = StyleSheet.create({})
