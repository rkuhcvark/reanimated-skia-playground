import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React, { useMemo } from 'react';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  usePathValue,
  vec,
} from '@shopify/react-native-skia';
import Slider from '@react-native-community/slider';
import {
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

interface DigitLight {
  top: string
  middle: string
  bottom: string
  topLeft: string
  topRight: string
  bottomLeft: string
  bottomRight: string
}

const enabledColor = "rgba(39,255,192,1)"
const disabledColor = 'rgba(21,21,21,1)'

const enabledFill: DigitLight = {
  bottom: enabledColor,
  bottomLeft: enabledColor,
  bottomRight: enabledColor,
  middle: enabledColor,
  top: enabledColor,
  topLeft: enabledColor,
  topRight: enabledColor
}

const disabledFill: DigitLight = {
  bottom: disabledColor,
  bottomLeft: disabledColor,
  bottomRight: disabledColor,
  middle: disabledColor,
  top: disabledColor,
  topLeft: disabledColor,
  topRight: disabledColor,
}



const digitLights: Record<number, DigitLight> = {
  0: {
    ...enabledFill,
    middle: disabledColor,
  },
  1: {
    ...disabledFill,
    topRight: enabledColor,
    bottomRight: enabledColor
  },
  2: {
    ...enabledFill,
    topLeft: disabledColor,
    bottomRight: disabledColor
  },
  3: {
    ...enabledFill,
    topLeft: disabledColor,
    bottomLeft: disabledColor
  },
  4: {
    ...enabledFill,
    top: disabledColor,
    bottomLeft: disabledColor,
    bottom: disabledColor
  },
  5: {
    ...enabledFill,
    topRight: disabledColor,
    bottomLeft: disabledColor
  },
  6: {
    ...enabledFill,
    topRight: disabledColor
  },
  7: {
    ...disabledFill,
    top: enabledColor,
    topRight: enabledColor,
    bottomRight: enabledColor,
  },
  8: {
    ...enabledFill,
  },
  9: {
    ...enabledFill,
    bottomLeft: disabledColor
  }
}

export const DigitMeter = () => {
  const { height, width } = useWindowDimensions();

  const digit = useSharedValue(0);
  const tempPointX = useSharedValue(20);
  const tempPointY = useSharedValue(20);

  const x = width / 2;
  const y = height / 2;

  const strokeWidth = 25;

  const innerSizeLength = 60

  const Digit = () => {
    const topPath = usePathValue((path) => {
      'worklet'
      const width = innerSizeLength;
      const height = strokeWidth;

      const outerA = x - width
      const outerB = x + width

      const innerB = (x + width / 2) + 5
      const innerA = x - width / 2 - 5

      // console.log('DBG', {
      //   inner: Math.abs(innerA - innerB),
      //   outer: Math.abs(outerA - outerB)
      // })

      path.moveTo(outerA, y);
      path.lineTo(outerB, y);
      path.lineTo(innerB, y + height);
      path.lineTo(innerA, y + height);

      return path
    });

    const topRightPath = usePathValue((path) => {
      'worklet'

      const startX = x + innerSizeLength;
      const startY = y;
      const height = 80;

      const width = strokeWidth;

      path.moveTo(startX, startY);
      path.lineTo(startX, y + height);
      path.lineTo(startX - width / 2, y + height + width / 2);
      path.lineTo(startX - width, y + height);
      path.lineTo(startX - width, y + width);

      const matrix = Skia.Matrix()

      matrix.translate(5, 5)

      path.transform(matrix)

      return path;
    });

    const topLeftPath = usePathValue((path) => {
      'worklet'

      const matrix = Skia.Matrix()

      matrix.scale(-1, 1)
      matrix.translate(-width, 0)

      path.transform(matrix);

      return path;
    }, topRightPath.value);

    const bottomLeftPath = usePathValue(path => {
      'worklet'

      const bounds = path.getBounds()

      // console.log('bounds', bounds)

      const matrix = Skia.Matrix()

      matrix.scale(-1, -1)
      matrix.translate(-width, (-height - bounds.height * 2) - 20)


      path.transform(matrix)

      return path
    }, topRightPath.value)


    const bottomRightPath = usePathValue(path => {
      'worklet'
      const matrix = Skia.Matrix()

      matrix.scale(-1, 1)
      matrix.translate(-width, 0)

      path.transform(matrix)

      return path
    }, bottomLeftPath.value)

    const bottomPath = usePathValue(path => {
      'worklet'
      const matrix = Skia.Matrix()

      matrix.scale(1, -1)
      matrix.translate(0, -height - 205)

      path.transform(matrix)

      return path
    }, topPath.value)

    const middlePath = usePathValue(path => {
      'worklet'

      const tl = topLeftPath.value
      const bl = bottomLeftPath.value


      const tlPoint = tl.getPoint(2)
      const blPoint = bl.getPoint(2)

      const diffY = Math.abs(tlPoint.y - blPoint.y)

      const x = blPoint.x + 8
      const y = blPoint.y - (diffY / 2)

      const height = strokeWidth / 2

      path.moveTo(x, y)
      path.lineTo(x + 12, y - height)
      path.lineTo(x + 18 + innerSizeLength, y - height)
      path.lineTo(x + 30 + innerSizeLength, y)
      path.lineTo(x + 18 + innerSizeLength, y + height)
      path.lineTo(x + 12, y + height)

      return path
    })

    const topColor = useDerivedValue(() => {
      return digitLights[digit.value]?.top ?? 'rgba(21,21,21,1)'
    }, [digit.value])

    const topRightColor = useDerivedValue(() => {
      return digitLights[digit.value]?.topRight ?? 'rgba(21,21,21,1)'
    }, [digit.value])

    const topLeftColor = useDerivedValue(() => {
      return digitLights[digit.value]?.topLeft ?? 'rgba(21,21,21,1)'
    }, [digit.value])

    const bottomLeftColor = useDerivedValue(() => {
      return digitLights[digit.value]?.bottomLeft ?? 'rgba(21,21,21,1)'
    }, [digit.value])

    const bottomRightColor = useDerivedValue(() => {
      return digitLights[digit.value]?.bottomRight ?? 'rgba(21,21,21,1)'
    }, [digit.value])

    const bottomColor = useDerivedValue(() => {
      return digitLights[digit.value]?.bottom ?? 'rgba(21,21,21,1)'
    }, [digit.value])

    const middleColor = useDerivedValue(() => {
      return digitLights[digit.value]?.middle ?? 'rgba(21,21,21,1)'
    }, [digit.value])



    return (
      <Group transform={[{
        translateY: -100,
      }]}>
        <Path
          path={topPath}
          color={topColor}
          antiAlias
        />
        <Path
          path={topRightPath}
          color={topRightColor}
          antiAlias
        />
        <Path
          path={topLeftPath}
          color={topLeftColor}
          antiAlias
        />
        <Path
          path={bottomLeftPath}
          color={bottomLeftColor}
          antiAlias
        />
        <Path
          path={bottomRightPath}
          color={bottomRightColor}
          antiAlias
        />
        <Path
          path={bottomPath}
          color={bottomColor}
          antiAlias
        />
        <Path
          path={middlePath}
          color={middleColor}
          antiAlias
        />
      </Group>
    );
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        <Digit />
        <Digit />
        <Digit />
      </Canvas>

      <Slider
        minimumValue={0}
        maximumValue={9}
        onValueChange={(value) => {
          const parsedNumber = parseInt(value.toFixed(0), 10)

          runOnUI((value: number) => {
            digit.value = value;
          })(parsedNumber);
        }}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          width: width / 2,
          bottom: 40,
          backgroundColor: 'black',
        }}
      />
    </View>
  );
};

// export default DigitMeter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
