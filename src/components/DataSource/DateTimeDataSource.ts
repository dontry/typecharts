import { AbstractDataSource } from "./AbstractDataSource";
import { DataItem } from "@/types/DataItem";
import { DataParam } from "@/types/Param";
import { flow, map, compact, groupBy, toPairs, sortBy } from "lodash/fp";
import { DataItemWithDateTime } from "./DataTimeData";
import { aggregateDataByValueParam } from "@/utils/misc";

export class DateTimeDataSource extends AbstractDataSource {
  constructor(
    protected data: DataItem[],
    private valueParams: DataParam[],
    private dimensionParam: DataParam,
    private dateFormat?: string,
  ) {
    super(data);
  }
  public transformToDataArray(): DataItem[] {
    const chain = flow(
      map(this.getDataWithDateTime.bind(this)), // wrap dataItem with date info
      compact, // remove invalid dates
      groupBy((dataItem: DataItemWithDateTime) => dataItem.getFormattedDate()), // group by same date
      toPairs,
      map(([timestamp, array]: [number, DataItemWithDateTime[]]) => ({
        timestamp: timestamp,
        array,
      })),
      sortBy("formattedDate"),
      map(({ _, array }: { _: number; array: DataItemWithDateTime[] }) => {
        const sortedArray = array.sort(
          (a, b) => a.getTimestamp() - b.getTimestamp(),
        );
        return sortedArray;
      }),
      map((array: DataItemWithDateTime[]) =>
        this.aggregateDateTimeArrayToDataItem(
          array,
          this.valueParams,
          this.dimensionParam,
        ),
      ), // aggregate the dataItem array of the same date into one data item with extra meta of timestamp and date
    );
    return chain(this.data);
  }

  private getDataWithDateTime(
    dataItem: DataItem,
  ): DataItemWithDateTime | undefined {
    try {
      return new DataItemWithDateTime(
        dataItem,
        this.dimensionParam,
        this.dateFormat,
      );
    } catch (e) {
      console.warn(`Invalid date: ${dataItem[this.dimensionParam.name]}`);
      console.warn(`Error: ${e.message}`);
      return undefined;
    }
  }

  private aggregateDateTimeArrayToDataItem(
    array: DataItemWithDateTime[],
    valueParams: DataParam[],
    dimensionParam: DataParam,
  ): DataItem {
    const aggregateValues = valueParams.reduce((acc, valueParam) => {
      let dataItems = array.map((d) => d.getDataItem());
      if (
        valueParam.type === "number" &&
        typeof dataItems[0][valueParam.name] === "string"
      ) {
        dataItems = dataItems.map((d) => ({
          ...d,
          [valueParam.name]: Number.parseFloat(d[valueParam.name] as string),
        }));
      }
      const value = aggregateDataByValueParam(dataItems, valueParam);
      return { ...acc, [valueParam.name]: value };
    }, {});
    return {
      ...aggregateValues,
      [dimensionParam.name]: array[0].getFormattedDate(),
      __timestamp__: array[0].getTimestamp(),
      __formattedTimestamp__: array[0].getFormattedTimestamp(),
    };
  }
}
