export type Minmax =
  | number
  | string
  | ((value: { min: number; max: number }) => number);
