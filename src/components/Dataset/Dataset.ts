import { EChartOption } from "echarts";
import { isEmpty, isUndefined, groupBy as gBy, toPairs as toP } from "lodash";
import { flow, groupBy, map, sortBy, toPairs } from "lodash/fp";
import { DataParam, DataParamType } from "@/types/Param";
import { PlotDataset, PlotDatasetInfo } from "./PlotDataset";
import { AbstractDataSource } from "@/components/DataSource/AbstractDataSource";
import { DateTimeDataSource } from "@/components/DataSource/DateTimeDataSource";
import { CategoryDataSource } from "@/components/DataSource/CategoryDataSource";
import { NumericDataSource } from "@/components/DataSource/NumericDataSource";
import { DataItem } from "@/types/DataItem";
import { PlotIdentifier } from "./PlotIdentity";
import { DataSourceType } from "@/types/DataSourceType";

export interface PaginateDatasetArgs {
  datasets: EChartOption.Dataset;
  facetNames: string[];
  subgroupNames: string[];
  pageIndex: number;
  pageSize: number;
}

export interface DatasetInterface {
  entity: {
    source: DataSourceType[];
    dimensions: string[];
  };
  info: {
    facet?: string;
    subgroup?: string;
    category?: string;
  };
}

export class Dataset {
  private identifierMap = new Map<string, PlotIdentifier>();
  constructor(private data: DataItem[]) {}
  public getPlotDatasets(
    valueParams: DataParam[],
    dimensionParam: DataParam,
    facetName?: string,
    categoryName?: string,
    subgroupName?: string,
    orderBy?: string,
  ): PlotDataset[] {
    const valueType = valueParams[0]?.type;

    const chain = flow(
      groupBy(
        this.getIdentifierWith(
          valueType,
          facetName,
          categoryName,
          subgroupName,
        ), // return identity as symbol type
      ),
      toPairs,
      map(this.getPlotDatasetWith(valueParams, dimensionParam, orderBy)),
      sortBy((dataset: PlotDataset) =>
        facetName
          ? dataset.getInfo().facet
          : subgroupName
          ? dataset.getInfo().subgroup
          : dataset.getInfo().category,
      ),
    );
    return chain(this.data);
  }

  public getIdentifierWith(
    valueType: DataParamType,
    facetName = "",
    categoryName = "",
    subgroupName = "",
  ): (data: DataItem) => string {
    return (data: DataItem): string => {
      const facet = data[facetName];
      const category = data[categoryName];
      const subgroup = data[subgroupName];
      const identifier = new PlotIdentifier(
        valueType,
        typeof facet === "string" ? facet : "",
        typeof category === "string" ? category : "",
        typeof subgroup === "string" ? subgroup : "",
      );

      let isExisting = false;
      let idString = identifier.toString();
      // symbol is unique;
      this.identifierMap.forEach((id: PlotIdentifier) => {
        if (identifier.isEqual(id)) {
          idString = id.toString();
          isExisting = true;
        }
      });

      if (isExisting === false) {
        this.identifierMap.set(idString, identifier);
      }

      return idString;
    };
  }

  public getPlotDatasetWith(
    valueParams: DataParam[],
    dimensionParam: DataParam,
    orderBy?: string,
  ): (arg: [string, DataItem[]]) => PlotDataset {
    return ([identifierString, data]: [string, DataItem[]]): PlotDataset => {
      const identifier = this.identifierMap.get(identifierString);

      if (isUndefined(identifier)) {
        throw new Error("identity does not exist");
      }

      const facet = identifier.getFacet();
      const category = identifier.getCategory();
      const valueType = identifier.getvalueType();
      const subgroup = identifier.getSubgroup();

      const hasAggregation = valueParams.some(
        (value) => !isEmpty(value.aggregation),
      );

      const dataSourceType = AbstractDataSource.getDataSourceType(
        valueType,
        dimensionParam.type,
        hasAggregation,
      );

      let dataSource: AbstractDataSource;
      switch (dataSourceType) {
        case "date":
          // TODO: dateTimeDataSource
          dataSource = new DateTimeDataSource(data);
          break;
        case "string":
          dataSource = new CategoryDataSource(
            data,
            valueParams,
            dimensionParam,
            orderBy,
          );
          break;
        case "number":
        default:
          dataSource = new NumericDataSource(data, orderBy);
          break;
      }

      const source: DataItem[] = dataSource.transformToDataArray();
      const dimensions: string[] = [];
      const info: PlotDatasetInfo = {
        dimension: dimensionParam.name,
        facet: facet,
        category,
        subgroup,
      };

      const plotDataset = new PlotDataset(source, dimensions, info);
      return plotDataset;
    };
  }

  public getPaginateDatasets(
    datasets: EChartOption.Dataset,
    facetNames: string[],
    subgroupNames: string[],
    pageIndex: number,
    pageSize: number,
  ): EChartOption.Dataset[] {
    return [];
  }
}
