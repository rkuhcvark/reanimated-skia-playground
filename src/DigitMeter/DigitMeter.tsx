import { StyleSheet, View, useWindowDimensions } from "react-native";
import React from "react";
import { Canvas, Group } from "@shopify/react-native-skia";
import Slider from "@react-native-community/slider";
import {
  runOnUI,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import Digit from "./Digit";

export const DigitMeter = () => {
  const { height, width } = useWindowDimensions();

  const digit = useSharedValue(666);

  const padDigit = useDerivedValue(() => {
    return digit.value.toString().padStart(3, "0");
  }, [digit]);

  const hundredsDigit = useDerivedValue(() => {
    return Number(padDigit.value[0]);
  }, [padDigit]);

  const tensDigit = useDerivedValue(() => {
    return Number(padDigit.value[1]);
  }, [padDigit]);

  const onesDigit = useDerivedValue(() => {
    return Number(padDigit.value[2]);
  }, [padDigit]);

  return (
    <View style={styles.container}>
      <Canvas style={{ flex: 1, backgroundColor: "black" }}>
        <Group transform={[{ translateY: 130 }]}>
          <Digit digit={hundredsDigit} transform={[{ scale: 0.5 }]} />
          <Digit
            digit={tensDigit}
            transform={[{ scale: 0.5 }, { translateX: 200 }]}
          />
          <Digit
            digit={onesDigit}
            transform={[{ scale: 0.5 }, { translateX: 400 }]}
          />
        </Group>
      </Canvas>

      <Slider
        minimumValue={0}
        maximumValue={999}
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
