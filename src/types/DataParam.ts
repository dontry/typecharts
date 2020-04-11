export type Aggregation = "count" | "min" | "max" | "mean" | "sum";
export interface Dimension {
  title: string;
  aggregation?: Aggregation;
}
