/** @format */

import React, { useMemo } from 'react'
import { Canvas, Paragraph, Skia } from '@shopify/react-native-skia'

const Sample = () => {
  const paragraph = Skia.ParagraphBuilder.Make().addText('Hello there!').build()

  return (
    <Canvas style={{ flex: 1 }}>
      <Paragraph paragraph={paragraph} x={0} y={0} width={300} />;
    </Canvas>
  )
}

export default Sample
