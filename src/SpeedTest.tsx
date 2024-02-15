/** @format */

import { StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { FC } from 'react'
import {
  Canvas,
  Skia,
  Group,
  Circle,
  vec,
  Path,
  LinearGradient,
  Paint,
  BlurMask,
  useFonts,
  Paragraph,
  TextAlign,
  SkTextStyle,
  interpolate,
} from '@shopify/react-native-skia'

import Slider from '@react-native-community/slider'
import { runOnUI, useDerivedValue, useSharedValue } from 'react-native-reanimated'

const ticks = [0, 1, 5, 10, 20, 30, 50, 75, 100]

interface TickProps {
  value: number
  x: number
  y: number
}

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
  const arcAnglesDiff = endAngle - startAngle

  const maxValue = 100 // Maximum value of the speedometer

  const backgroundColor = 'rgba(15,15,28,1)'

  const sweepAngle = useDerivedValue(() => {
    const output = ticks.map((_, i, arr) => (i * arcAnglesDiff) / (arr.length - 1))

    return interpolate(speed.value, ticks, output)
  })

  const ArcGradient = () => {
    const x = cx - _r - strokeWidth / 2
    const _width = width - x * 2

    return (
      <LinearGradient
        start={vec(x, cy)}
        end={vec(_width, cy)}
        colors={['rgba(37, 169, 253, 1)', 'rgba(109, 255,103, 1)']}
      />
    )
  }

  const BackgroundArc = () => {
    const path = useDerivedValue(() => {
      const r = _r
      const path = Skia.Path.Make()
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        endAngle,
        -(arcAnglesDiff - sweepAngle.value)
      )
      return path
    })

    const color = Skia.Color('rgb(26,33,61)')

    return <Path path={path} style='stroke' strokeWidth={strokeWidth} color={color} />
  }

  const ActiveArc = () => {
    const active = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const r = _r
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        sweepAngle.value
      )

      return path
    })

    const shadowPath = useDerivedValue(() => {
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
      <Group>
        <Path path={active} style='stroke' strokeWidth={strokeWidth} />
        <Path path={shadowPath} style='stroke' strokeWidth={strokeWidth * 1.5} opacity={0.3}>
          <BlurMask blur={50} respectCTM={false} />
        </Path>
        <ArcGradient />
      </Group>
    )
  }

  const NegativePath = () => {
    const color = backgroundColor

    const negativeArc = useDerivedValue(() => {
      const path = Skia.Path.Make()
      const r = _r - strokeWidth
      path.addArc(
        { x: cx - r, y: cy - r, width: r * 2, height: r * 2 },
        startAngle,
        -(360 - sweepAngle.value)
      )

      return path
    })

    const circleR = _r + strokeWidth / 2

    return (
      <Group>
        <Path path={negativeArc} style='stroke' strokeWidth={strokeWidth * 5} color={color} />
        <Circle c={vec(cx, cy)} r={circleR * 1.5} color='transparent'>
          <Paint style='stroke' strokeWidth={circleR} color={backgroundColor} />
        </Circle>
      </Group>
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
            start={vec(cx, cy)}
            end={vec(cx, cy - 130)}
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          />
        </Path>
      </Group>
    )
  }

  const SpeedLabel = () => {
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
        .build()
    }, [customFontMgr])

    const r = (_r * 0.75) / 2
    const y = cy + r + 20

    return <Paragraph paragraph={paragraph} x={0} y={y} width={width} />
  }

  const Ticks = () => {
    const endAngle = 1
    const startAngle = -Math.PI - endAngle
    const angleDiff = endAngle - startAngle
    const singleTickAngle = angleDiff / ticks.length
    const r = _r - strokeWidth - 5

    return ticks.map((value, i) => {
      const angle = interpolate(i, [0, ticks.length], [startAngle, endAngle]) + singleTickAngle / 2

      const x = cx - 20 + r * Math.cos(angle)
      const y = cy - 10 + r * Math.sin(angle)

      return <Tick key={value} value={value} x={x} y={y} />
    })
  }

  const Tick: FC<TickProps> = ({ value, x, y }) => {
    const alpha = useSharedValue(0.5)
    const paragraph = useDerivedValue(() => {
      if (!customFontMgr) {
        return null
      }

      alpha.value = interpolate(speed.value, [0, value - 10, value], [0.5, 0.5, 1])

      const paragraphStyle = {
        textAlign: TextAlign.Center,
      }

      const textStyle = {
        color: Skia.Color(`rgba(255,255,255,${alpha.value})`),
        fontFamilies: ['Montserrat'],
        fontSize: 16,
      }

      return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
        .pushStyle(textStyle)
        .addText(value.toString())
        .build()
    }, [customFontMgr])

    return <Paragraph x={x} y={y} width={40} paragraph={paragraph} />
  }

  const handleValueChange = (value: number) => {
    speed.value = value
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Canvas style={{ flex: 3 }}>
        <ActiveArc />
        <NegativePath />
        <BackgroundArc />
        <Needle />
        <SpeedLabel />
        <Ticks />
      </Canvas>

      <View style={styles.sliderContainer}>
        <Slider
          style={{ width: width / 2 }}
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
  sliderContainer: {
    flex: 1,
    alignItems: 'center',
  },
})
