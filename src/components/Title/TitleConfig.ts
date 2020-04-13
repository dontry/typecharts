import { TextAlign } from "@/types/TextAlign";
import { Position } from "@/types/Position";

export interface TitleConfig {
  text?: string;
  id?: string;
  show?: true;
  subtext?: string;
  textAlign?: TextAlign;
  textVerticalAlign?: TextAlign;
  left?: Position;
  top?: Position;
  right?: Position;
  bottom?: Position;
}