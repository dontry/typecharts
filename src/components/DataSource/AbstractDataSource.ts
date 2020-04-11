import { DataParamType } from "@/types/Param";
import { DataSourceType } from "@/types/DataSourceType";
import { DataItem } from "@/types/DataItem";

export abstract class AbstractDataSource {
  constructor(protected data: any[]) {}
  public abstract transformToDataArray(): DataItem[];
  public static getDataSourceType(
    valueType: DataParamType,
    dimensionType: DataParamType,
    hasAggregation: boolean,
  ): DataSourceType {
    if (dimensionType === "date") {
      return "date";
    } else if (hasAggregation && valueType === "string") {
      return "string";
    } else {
      return "number";
    }
  }
}
