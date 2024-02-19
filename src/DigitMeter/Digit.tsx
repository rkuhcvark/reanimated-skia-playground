import type { PublicGroupProps, SkiaProps } from "@shopify/react-native-skia";
import {
  BlurMask,
  Group,
  Path,
  Skia,
  usePathValue,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";
import type { FC } from "react";

import { digitLights, disabledColor } from "./utils";

type Props = {
  digit: Readonly<SharedValue<number>>;
} & SkiaProps<PublicGroupProps>;

const Digit: FC<Props> = ({ digit, ...rest }) => {
  const { height: sHeight, width: sWidth } = useWindowDimensions();

  const cx = sWidth / 2;
  const cy = sHeight / 2;

  const strokeWidth = 25;

  const innerSizeLength = 60;

  const topPath = usePathValue((path) => {
    "worklet";
    const width = innerSizeLength;
    const height = strokeWidth;

    const outerA = cx - width;
    const outerB = cx + width;

    const innerB = cx + width / 2 + 5;
    const innerA = cx - width / 2 - 5;

    // console.log('DBG', {
    //   inner: Math.abs(innerA - innerB),
    //   outer: Math.abs(outerA - outerB)
    // })

    path.moveTo(outerA, cy);
    path.lineTo(outerB, cy);
    path.lineTo(innerB, cy + height);
    path.lineTo(innerA, cy + height);

    return path;
  });

  const topRightPath = usePathValue((path) => {
    "worklet";

    const startX = cx + innerSizeLength;
    const startY = cy;
    const height = 80;

    const width = strokeWidth;

    path.moveTo(startX, startY);
    path.lineTo(startX, cy + height);
    path.lineTo(startX - width / 2, cy + height + width / 2);
    path.lineTo(startX - width, cy + height);
    path.lineTo(startX - width, cy + width);

    const matrix = Skia.Matrix();

    matrix.translate(5, 5);

    path.transform(matrix);

    return path;
  });

  const topLeftPath = usePathValue((path) => {
    "worklet";

    const matrix = Skia.Matrix();

    matrix.scale(-1, 1);
    matrix.translate(-sWidth, 0);

    path.transform(matrix);

    return path;
  }, topRightPath.value);

  const bottomLeftPath = usePathValue((path) => {
    "worklet";

    const bounds = path.getBounds();

    const matrix = Skia.Matrix();

    matrix.scale(-1, -1);
    matrix.translate(-sWidth, -sHeight - bounds.height * 2 - 20);

    path.transform(matrix);

    return path;
  }, topRightPath.value);

  const bottomRightPath = usePathValue((path) => {
    "worklet";
    const matrix = Skia.Matrix();

    matrix.scale(-1, 1);
    matrix.translate(-sWidth, 0);

    path.transform(matrix);

    return path;
  }, bottomLeftPath.value);

  const bottomPath = usePathValue((path) => {
    "worklet";
    const matrix = Skia.Matrix();

    matrix.scale(1, -1);
    matrix.translate(0, -sHeight - 205);

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
    return digitLights[digit.value]?.bottom ?? disabledColor;
  }, [digit.value]);

  const middleColor = useDerivedValue(() => {
    return digitLights[digit.value]?.middle ?? disabledColor;
  }, [digit.value]);

  return (
    <Group {...rest}>
      <BlurMask style="solid" blur={15} respectCTM={false} />
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

export default Digit;
