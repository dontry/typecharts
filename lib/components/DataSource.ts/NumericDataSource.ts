import { AbstractDataSource } from "./AbstractDataSource";
import { sortBy } from "lodash";

export class NumericDataSource extends AbstractDataSource {
  constructor(protected data: any[], private orderBy?: string) {
    super(data);
  }
  transformToDataArray(): any[] {
    if (this.orderBy) {
      return sortBy(this.data, this.orderBy);
    } else {
      return this.data;
    }
  }
}
