/** @format */

import React, { useMemo } from 'react'
import { Canvas, Paragraph, Skia } from '@shopify/react-native-skia'

const Sample = () => {
  const paragraph = useMemo(() => {
    return Skia.ParagraphBuilder.Make().addText('hello there').build()
  }, [])

  return (
    <Canvas style={{ flex: 1 }}>
      <Paragraph paragraph={paragraph} x={200} y={200} width={300} color='black' />
    </Canvas>
  )
}

export default Sample
