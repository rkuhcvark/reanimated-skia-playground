/* eslint-disable react/no-unstable-nested-components */
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React, { useMemo } from "react";
import {
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  Path,
  Skia,
  usePathValue,
  vec,
} from "@shopify/react-native-skia";
import Slider from "@react-native-community/slider";
import {
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { digitLights, disabledColor } from "./utils";

export const DigitMeter = () => {
  const { height, width } = useWindowDimensions();

  const digit = useSharedValue(0);

  const x = width / 2;
  const y = height / 2;

  const strokeWidth = 25;

  const innerSizeLength = 60;

  const Digit = () => {
    const topPath = usePathValue((path) => {
      "worklet";
      const width = innerSizeLength;
      const height = strokeWidth;

      const outerA = x - width;
      const outerB = x + width;

      const innerB = x + width / 2 + 5;
      const innerA = x - width / 2 - 5;

      // console.log('DBG', {
      //   inner: Math.abs(innerA - innerB),
      //   outer: Math.abs(outerA - outerB)
      // })

      path.moveTo(outerA, y);
      path.lineTo(outerB, y);
      path.lineTo(innerB, y + height);
      path.lineTo(innerA, y + height);

      return path;
    });

    const topRightPath = usePathValue((path) => {
      "worklet";

      const startX = x + innerSizeLength;
      const startY = y;
      const height = 80;

      const width = strokeWidth;

      path.moveTo(startX, startY);
      path.lineTo(startX, y + height);
      path.lineTo(startX - width / 2, y + height + width / 2);
      path.lineTo(startX - width, y + height);
      path.lineTo(startX - width, y + width);

      const matrix = Skia.Matrix();

      matrix.translate(5, 5);

      path.transform(matrix);

      return path;
    });

    const topLeftPath = usePathValue((path) => {
      "worklet";

      const matrix = Skia.Matrix();

      matrix.scale(-1, 1);
      matrix.translate(-width, 0);

      path.transform(matrix);

      return path;
    }, topRightPath.value);

    const bottomLeftPath = usePathValue((path) => {
      "worklet";

      const bounds = path.getBounds();

      // console.log('bounds', bounds)

      const matrix = Skia.Matrix();

      matrix.scale(-1, -1);
      matrix.translate(-width, -height - bounds.height * 2 - 20);

      path.transform(matrix);

      return path;
    }, topRightPath.value);

    const bottomRightPath = usePathValue((path) => {
      "worklet";
      const matrix = Skia.Matrix();

      matrix.scale(-1, 1);
      matrix.translate(-width, 0);

      path.transform(matrix);

      return path;
    }, bottomLeftPath.value);

    const bottomPath = usePathValue((path) => {
      "worklet";
      const matrix = Skia.Matrix();

      matrix.scale(1, -1);
      matrix.translate(0, -height - 205);

      path.transform(matrix);

      return path;
    }, topPath.value);

    const middlePath = usePathValue((path) => {
      "worklet";

      const tl = topLeftPath.value;
      const bl = bottomLeftPath.value;

      const tlPoint = tl.getPoint(2);
      const blPoint = bl.getPoint(2);

      const diffY = Math.abs(tlPoint.y - blPoint.y);

      const x = blPoint.x + 8;
      const y = blPoint.y - diffY / 2;

      const height = strokeWidth / 2;

      path.moveTo(x, y);
      path.lineTo(x + 12, y - height);
      path.lineTo(x + 18 + innerSizeLength, y - height);
      path.lineTo(x + 30 + innerSizeLength, y);
      path.lineTo(x + 18 + innerSizeLength, y + height);
      path.lineTo(x + 12, y + height);

      return path;
    });

    const topColor = useDerivedValue(() => {
      return digitLights[digit.value]?.top ?? disabledColor;
    }, [digit.value]);

    const topRightColor = useDerivedValue(() => {
      return digitLights[digit.value]?.topRight ?? disabledColor;
    }, [digit.value]);

    const topLeftColor = useDerivedValue(() => {
      return digitLights[digit.value]?.topLeft ?? disabledColor;
    }, [digit.value]);

    const bottomLeftColor = useDerivedValue(() => {
      return digitLights[digit.value]?.bottomLeft ?? disabledColor;
    }, [digit.value]);

    const bottomRightColor = useDerivedValue(() => {
      return digitLights[digit.value]?.bottomRight ?? disabledColor;
    }, [digit.value]);

    const bottomColor = useDerivedValue(() => {
      console.log("run");
      return digitLights[digit.value]?.bottom ?? disabledColor;
    }, [digit.value]);

    const middleColor = useDerivedValue(() => {
      return digitLights[digit.value]?.middle ?? disabledColor;
    }, [digit.value]);

    return (
      <Group
        transform={[
          {
            translateY: -100,
          },
        ]}
        blendMode="difference"
      >
        <BlurMask style="solid" blur={20} respectCTM={false} />
        <Path path={topPath} color={topColor} antiAlias />
        <Path path={topRightPath} color={topRightColor} antiAlias />
        <Path path={topLeftPath} color={topLeftColor} antiAlias />
        <Path path={bottomLeftPath} color={bottomLeftColor} antiAlias />
        <Path path={bottomRightPath} color={bottomRightColor} antiAlias />
        <Path path={bottomPath} color={bottomColor} antiAlias />
        <Path path={middlePath} color={middleColor} antiAlias />
      </Group>
    );
  };

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1, backgroundColor: "black" }}>
        <Digit />
        <Digit />
        <Digit />
      </Canvas>

      <Slider
        minimumValue={0}
        maximumValue={9}
        onValueChange={(value) => {
          const parsedNumber = parseInt(value.toFixed(0), 10);

          runOnUI((newValue: number) => {
            digit.value = newValue;
          })(parsedNumber);
        }}
        style={{
          position: "absolute",
          alignSelf: "center",
          width: width / 2,
          bottom: 40,
          backgroundColor: "black",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
