/** @format */

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Canvas, Fill } from '@shopify/react-native-skia'

const Speedometer = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color='rgb(20,21,34)' />
    </Canvas>
  )
}

export default Speedometer

const styles = StyleSheet.create({})
