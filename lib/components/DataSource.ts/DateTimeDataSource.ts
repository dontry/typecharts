import { AbstractDataSource } from "./AbstractDataSource";

export class DateTimeDataSource extends AbstractDataSource {
  constructor(protected data: any[]) {
    super(data);
  }
  public transformToDataArray(): any[] {
    throw new Error("Method not implemented.");
  }
}
