import { DATE_AGGREGATION, NUMBER_AGGREGATION } from "./Aggregation";

export type DataParamType = "number" | "string" | "date";
export interface DataParam {
  name: string;
  type: DataParamType;
  aggregation?: DATE_AGGREGATION | NUMBER_AGGREGATION;
  value?: string | number;
}
