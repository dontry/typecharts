import { FontStyle } from "./FontStyle";
import { FontWeight } from "./FontWeight";

interface TextStyle {
  color: string;
  fontStyle: FontStyle;
  fontWeight: FontWeight;
  fontFamily: string;
  fontSize: number;
  width?: number | string;
  height?: number | string;
}
