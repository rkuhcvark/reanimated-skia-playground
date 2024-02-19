export interface DigitLight {
  top: string;
  middle: string;
  bottom: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

export const enabledColor = "rgba(39,255,192,1)";
export const disabledColor = "rgba(21,21,21,1)";

const enabledFill: DigitLight = {
  bottom: enabledColor,
  bottomLeft: enabledColor,
  bottomRight: enabledColor,
  middle: enabledColor,
  top: enabledColor,
  topLeft: enabledColor,
  topRight: enabledColor,
};

const disabledFill: DigitLight = {
  bottom: disabledColor,
  bottomLeft: disabledColor,
  bottomRight: disabledColor,
  middle: disabledColor,
  top: disabledColor,
  topLeft: disabledColor,
  topRight: disabledColor,
};

export const digitLights: Record<number, DigitLight> = {
  0: {
    ...enabledFill,
    middle: disabledColor,
  },
  1: {
    ...disabledFill,
    topRight: enabledColor,
    bottomRight: enabledColor,
  },
  2: {
    ...enabledFill,
    topLeft: disabledColor,
    bottomRight: disabledColor,
  },
  3: {
    ...enabledFill,
    topLeft: disabledColor,
    bottomLeft: disabledColor,
  },
  4: {
    ...enabledFill,
    top: disabledColor,
    bottomLeft: disabledColor,
    bottom: disabledColor,
  },
  5: {
    ...enabledFill,
    topRight: disabledColor,
    bottomLeft: disabledColor,
  },
  6: {
    ...enabledFill,
    topRight: disabledColor,
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
    bottomLeft: disabledColor,
  },
};
