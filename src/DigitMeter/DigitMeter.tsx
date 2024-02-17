import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React, { useMemo } from 'react';
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  topLeft,
  usePathValue,
  vec,
} from '@shopify/react-native-skia';
import Slider from '@react-native-community/slider';
import {
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

export const DigitMeter = () => {
  const { height, width } = useWindowDimensions();

  const animated = useSharedValue(0);
  const tempPointX = useSharedValue(20);
  const tempPointY = useSharedValue(20);

  const x = width / 2;
  const y = height / 2;

  const strokeWidth = 25;

  const Digit = () => {
    const top = useMemo(() => {
      const path = Skia.Path.Make();

      const width = 60;
      const height = strokeWidth;

      path.moveTo(x - width, y);
      path.lineTo(x + width, y);
      path.lineTo(x + width / 2, y + height);
      path.lineTo(x - width / 2, y + height);

      return {
        path,
        right: width,
      };
    }, []);

    const topRight = useMemo(() => {
      const path = Skia.Path.Make();

      const margin = 3;

      const startX = x + top.right + margin;
      const startY = y + margin;
      const height = 80;

      const width = strokeWidth;

      path.moveTo(startX, startY + margin);
      path.lineTo(startX, y + height);
      path.lineTo(startX - width / 2, y + height + width / 2);
      path.lineTo(startX - width, y + height);
      path.lineTo(startX - width, y + width + margin);

      return path;
    }, []);

    const topLeft = usePathValue((path) => {
      'worklet'

      const matrix = Skia.Matrix()

      matrix.scale(-1, 1)
      matrix.translate(-width, 0)

      path.transform(matrix);

      return path;
    }, topRight);

    return (
      <Group>
        <Path
          path={top.path}
          color="rgba(39,255,192,1)"
          antiAlias
        />
        <Path
          path={topRight}
          color="rgba(39,255,192,1)"
          antiAlias
        />
        <Path
          path={topLeft}
          color="rgba(39,255,192,1)"
          antiAlias
        />
        {/* <BlurMask
          blur={10}
          respectCTM={false}
        /> */}
      </Group>
    );
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1, backgroundColor: 'black' }}>
        {/* <Circle
          c={vec(width / 2, height / 2)}
          r={200}
          color="red"
        /> */}

        <Digit />
      </Canvas>

      <Slider
        minimumValue={0}
        maximumValue={20}
        onValueChange={(value) => {
          runOnUI((value: number) => {
            animated.value = value;
          })(value);
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
