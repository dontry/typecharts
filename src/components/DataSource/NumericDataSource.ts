import { AbstractDataSource } from "./AbstractDataSource";
import { sortBy } from "lodash";
import { DataItem } from "@/types/DataItem";

export class NumericDataSource extends AbstractDataSource {
  constructor(protected data: DataItem[], private orderBy?: string) {
    super(data);
  }
  transformToDataArray(): DataItem[] {
    if (this.orderBy) {
      return sortBy(this.data, this.orderBy);
    } else {
      return this.data;
    }
  }
}
