import { EChartOption } from "echarts";
import { isEmpty, isUndefined } from "lodash";
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

export interface Dataset {
  entity: {
    source: DataSourceType[];
    dimensions: string[];
  };
  info: {
    facet?: string;
    subgroup: string;
    category: string;
  };
}

export class Dataset {
  private identityMap = new Map<symbol, PlotIdentifier>();
  constructor(private data: DataItem[]) {}
  public getGenericDatasets(
    valueParams: DataParam[],
    dimensionParam: DataParam,
    facetName: string,
    subgroupName: string,
    categoryName: string,
    orderBy: string,
  ): EChartOption.Dataset[] {
    const valueType = valueParams[0]?.type;

    const chain = flow(
      groupBy(
        this.getIdentitierSymbolWith(
          valueType,
          facetName,
          subgroupName,
          categoryName,
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

  public getIdentitierSymbolWith(
    valueType: DataParamType,
    facetName: string,
    subgroupName: string,
    categoryName: string,
  ): (data: DataItem) => symbol {
    return (data: DataItem): symbol => {
      const subgroup = data[subgroupName];
      const facet = data[facetName];
      const category = data[categoryName];
      const identifier = new PlotIdentifier(
        valueType,
        typeof facet === "string" ? facet : "",
        typeof subgroup === "string" ? subgroup : "",
        typeof category === "string" ? category : "",
      );

      let isExisting = false;
      let symbol = identifier.toSymbol();
      // symbol is unique;
      this.identityMap.forEach((identity: PlotIdentifier) => {
        if (identifier.isEqual(identity)) {
          symbol = identity.toSymbol();
          isExisting = true;
        }
      });

      if (isExisting === false) {
        this.identityMap.set(symbol, identifier);
      }

      return symbol;
    };
  }

  public getPlotDatasetWith(
    valueParams: DataParam[],
    dimensionParam: DataParam,
    orderBy: string,
  ): (arg: [symbol, DataItem[]]) => PlotDataset {
    return ([identitysymbol, data]: [symbol, DataItem[]]): PlotDataset => {
      const identity = this.identityMap.get(identitysymbol);

      if (isUndefined(identity)) {
        throw new Error("identity does not exist");
      }

      const facet = identity.getFacet();
      const category = identity.getCategory();
      const valueType = identity.getvalueType();
      const subgroup = identity.getSubgroup();

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

      const source: DataSourceType[] = [];
      const dimensions: string[] = [];
      const info: PlotDatasetInfo = {
        dimension: dimensionParam.title,
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
