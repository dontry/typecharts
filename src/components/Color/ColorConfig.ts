export type ColorScheme =
  | "walden"
  | "infographic"
  | "macarons"
  | "shine"
  | "custom"
  | "roma"
  | "westeros";

export interface ColorConfig {
  start?: string;
  end?: string;
  colors?: string;
  scheme: ColorScheme;
}
