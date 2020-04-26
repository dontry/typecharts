import { AbstractDataSource } from "./AbstractDataSource";
import { DataParam } from "@/types/Param";
import { flow, groupBy, values, sortBy, map, compact } from "lodash/fp";
import { DataItem, DataValue } from "@/types/DataItem";
import { aggregateDataByValueParam } from "@/utils/misc";
import { isNil } from "lodash";

export class CategoryDataSource extends AbstractDataSource {
  constructor(
    protected data: DataItem[],
    private valueParams: DataParam[],
    private groupName: string,
    private orderBy?: string,
  ) {
    super(data);
  }

  public transformToDataArray(): DataItem[] {
    const chain = flow(
      groupBy(this.groupName),
      values,
      sortBy(this.getSortAttribute.bind(this)),
      map(this.getAggregationValues.bind(this)),
      compact,
    );
    return chain(this.data);
  }

  private getSortAttribute(array: DataItem[]): DataValue {
    return this.orderBy ? array[0][this.orderBy] : array[0][this.groupName];
  }

  private getAggregationValues(array: DataItem[]): DataItem | undefined {
    const aggregationValues = this.valueParams.reduce((acc, valueParam) => {
      if (valueParam.aggregation) {
        return {
          ...acc,
          [valueParam.name]: aggregateDataByValueParam(array, valueParam),
        };
      } else {
        return acc;
      }
    }, {});

    if (isNil(array[0][this.groupName])) {
      return;
    }

    return {
      [this.groupName]: array[0][this.groupName],
      ...aggregationValues,
    };
  }
}
