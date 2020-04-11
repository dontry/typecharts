import { AbstractDataSource } from "./AbstractDataSource";
import { DataParam } from "@/types/Param";
import { flow, groupBy, values, sortBy, map } from "lodash/fp";
import { DataItem, DataValue } from "@/types/DataItem";
import { aggregateDataByValueParam } from "@/utils/misc";

export class CategoryDataSource extends AbstractDataSource {
  private dimensionName: string;
  constructor(
    protected data: DataItem[],
    private valueParams: DataParam[],
    dimensonParam: DataParam,
    private orderBy?: string,
  ) {
    super(data);
    this.dimensionName = dimensonParam.title;
  }

  public transformToDataArray(): DataItem[] {
    const chain = flow(
      groupBy(this.dimensionName),
      values,
      sortBy(this.getSortAttribute.bind(this)),
      map(this.getAggregationValues.bind(this)),
    );
    return chain(this.data);
  }

  private getSortAttribute(array: DataItem[]): DataValue {
    return this.orderBy ? array[0][this.orderBy] : array[0][this.dimensionName];
  }

  private getAggregationValues(array: DataItem[]): DataItem {
    const aggregationValues = this.valueParams.reduce((acc, valueParam) => {
      if (valueParam.aggregation) {
        return {
          ...acc,
          [valueParam.title]: aggregateDataByValueParam(array, valueParam),
        };
      } else {
        return acc;
      }
    }, {});

    return {
      [this.dimensionName]: array[0][this.dimensionName],
      ...aggregationValues,
    };
  }
}
