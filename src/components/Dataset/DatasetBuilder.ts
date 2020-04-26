import { EChartOption } from "echarts";
import { isEmpty, isUndefined, isNil, compact, pick } from "lodash";
import { flow, groupBy, map, sortBy, toPairs, uniq } from "lodash/fp";
import { DataParam, DataParamType } from "@/types/Param";
import { DatasetComponent, PlotDatasetInfo, Dataset } from "./DatasetComponent";
import { AbstractDataSource } from "@/components/DataSource/AbstractDataSource";
import { DateTimeDataSource } from "@/components/DataSource/DateTimeDataSource";
import { CategoryDataSource } from "@/components/DataSource/CategoryDataSource";
import { NumericDataSource } from "@/components/DataSource/NumericDataSource";
import { DataItem } from "@/types/DataItem";
import { PlotIdentifier } from "./PlotIdentifier";
import { DataSourceType } from "@/types/DataSourceType";

export interface DatasetConfig {
  valueParams: DataParam[];
  dimensionParam?: DataParam;
  facetParam?: DataParam;
  categoryParam?: DataParam;
  subgroupParam?: DataParam;
  orderBy?: string;
}

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

export class DatasetBuilder {
  private identifierMap = new Map<string, PlotIdentifier>();
  constructor(private data: DataItem[], private config: DatasetConfig) {}

  public getDatasets(): DatasetComponent[] {
    const {
      valueParams,
      dimensionParam,
      facetParam,
      categoryParam,
      subgroupParam,
      orderBy,
    } = this.config;
    const valueType = valueParams[0]?.type;
    const facetName = facetParam?.name;
    const categoryName = categoryParam?.name;
    const subgroupName = subgroupParam?.name;

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
      map(this.getDatasetWith(valueParams, dimensionParam, orderBy)),
      compact,
      sortBy((dataset: DatasetComponent) =>
        facetName
          ? dataset.getInfo().facetName
          : subgroupName
          ? dataset.getInfo().subgroupName
          : dataset.getInfo().categoryName,
      ),
    );
    return chain(this.data);
  }

  public getIdentifierWith(
    valueType: DataParamType,
    facetName = "",
    categoryName = "",
    subgroupName = "",
  ): (data: DataItem) => string | undefined {
    return (data: DataItem): string | undefined => {
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

      if (
        isNil(idString) ||
        (idString === "" &&
          this.hasMultiplePlots(facetName, categoryName, subgroupName))
      ) {
        return;
      }
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

  public getDatasetWith(
    valueParams: DataParam[],
    dimensionParam?: DataParam,
    orderBy?: string,
  ): (arg: [string, DataItem[]]) => DatasetComponent | undefined {
    return ([identifierString, data]: [string, DataItem[]]):
      | DatasetComponent
      | undefined => {
      const identifier = this.identifierMap.get(identifierString);

      if (isUndefined(identifier)) {
        console.warn(`identifier ${identifier} does not exist.`);
        return;
      }

      const facet = identifier.getFacet();
      const category = identifier.getCategory();
      const subgroup = identifier.getSubgroup();

      const hasAggregation = valueParams.some(
        (value) => !isEmpty(value.aggregation),
      );

      const dataSourceType = AbstractDataSource.getDataSourceType(
        dimensionParam?.type,
        hasAggregation,
      );

      let dataSource: AbstractDataSource;

      if (isNil(dimensionParam)) {
        dataSource = new NumericDataSource(data, orderBy);
      } else {
        switch (dataSourceType) {
          case "date":
            dataSource = new DateTimeDataSource(
              data,
              valueParams,
              dimensionParam,
            );
            break;
          case "string":
            dataSource = new CategoryDataSource(
              data,
              valueParams,
              dimensionParam.name,
              orderBy,
            );
            break;
          case "number":
          default:
            dataSource = new NumericDataSource(data, orderBy);
            break;
        }
      }

      const source: DataItem[] = dataSource.transformToDataArray();
      const dimensions: string[] = [];
      const info: PlotDatasetInfo = {
        dimensionName: dimensionParam?.name,
        facetName: facet,
        categoryName: category,
        subgroupName: subgroup,
      };

      const plotDataset = new DatasetComponent(source, dimensions, info);
      return plotDataset;
    };
  }

  static getNamesWithParam(param: keyof PlotDatasetInfo) {
    return (datasets: DatasetComponent[]): string[] => {
      const chain = flow(
        map((dataset: DatasetComponent) => dataset.getInfo()[param]),
        uniq,
        compact,
      );
      return chain(datasets);
    };
  }

  static getPaginateDatasets(
    datasets: DatasetComponent[],
    pageSize: number,
    pageIndex = 0,
  ): DatasetComponent[] {
    const facetNames = DatasetBuilder.getNamesWithParam("facetName")(datasets);
    const categoryNames = DatasetBuilder.getNamesWithParam("categoryName")(
      datasets,
    );
    // no facets then return the entire datasets
    if (facetNames.length === 0) {
      return datasets;
    }
    const paginateDatasets = [];
    for (
      let facetIndex = pageIndex * pageSize;
      facetIndex < (pageIndex + 1) * pageSize;
      facetIndex++
    ) {
      const curFacetName = facetNames[facetIndex];
      if (facetNames.length <= facetIndex) break;
      // no categories, then return the single facet dataset
      if (categoryNames.length === 0) {
        const dataset = datasets.find(
          (dataset) => dataset.getInfo().facetName === curFacetName,
        );
        if (dataset) {
          paginateDatasets.push(dataset);
        }
      } else {
        for (
          let categoryIndex = 0;
          categoryIndex < categoryNames.length;
          categoryIndex++
        ) {
          const curCategoryName = categoryNames[categoryIndex];
          const dataset = datasets.find(
            (dataset) =>
              dataset.getInfo().facetName === curFacetName &&
              dataset.getInfo().categoryName === curCategoryName,
          );
          if (dataset) {
            paginateDatasets.push(dataset);
          }
        }
      }
    }
    return paginateDatasets;
  }

  private selectDataWithParam(
    valueNames: string[],
    dimensionName: string,
    facetName?: string,
    categoryName?: string,
    subgroupName?: string,
  ) {
    return (data: DataItem[]): DataItem[] => {
      const chain = flow(compact, uniq);
      const selectedFields = chain([
        ...valueNames,
        dimensionName,
        facetName,
        categoryName,
        subgroupName,
      ]);

      return data.map((item: DataItem) => pick(item, selectedFields));
    };
  }

  private hasMultiplePlots(
    facetName?: string,
    categoryName?: string,
    subgroupName?: string,
  ): boolean {
    return !!facetName || !!categoryName || !!subgroupName;
  }
}
