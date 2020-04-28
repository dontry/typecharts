import { FREQUENCY, NUMBER_AGGREGATION } from "./Aggregation";

export type DataParamType = "number" | "string" | "date";
export interface DataParam {
  name: string;
  type: DataParamType;
  aggregation?: FREQUENCY | NUMBER_AGGREGATION;
  value?: string | number;
  format?: string;
}
