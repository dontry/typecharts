import { parseCsvData } from "../fixtures/utils";
import path from "path";
import fertility from "../fixtures/fertility.json";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { DataParam } from "@/types/Param";
import { FREQUENCY, NUMBER_AGGREGATION } from "@/types/Aggregation";
import { CartesianSeriesGroupConfig } from "@/components/Series/SeriesConfig";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { CartesianSeriesGroupBuilder } from "@/components/Series/CartesianSeriesGroupBuilder";

describe("SeriesGroupBuilder", () => {
  describe("CartesianSeriesGroupBuilder", () => {
    test("1 valueParams,  1 dimensionParam, 1 categoryParam", () => {
      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "value",
          aggregation: NUMBER_AGGREGATION.MEAN,
        },
      ];
      const dimensionParam: DataParam = {
        type: "date",
        name: "year",
        aggregation: FREQUENCY.YEAR,
      };
      const categoryParam: DataParam = {
        type: "string",
        name: "country",
      };

      const dataset = new DatasetBuilder(fertility, {
        valueParams,
        dimensionParam,
        categoryParam,
      });
      const plotDatasets = dataset.getDatasets();
      const xAxisGroupConfig: AxisGroupConfig = {
        axis: "x",
        count: plotDatasets.length,
        dataParams: [dimensionParam],
        scale: true,
        show: true,
        uniformMinmax: true,
        isDimension: true,
        onZero: true,
      };

      const xAxisComponents = new AxisGroupBuilder(
        plotDatasets,
        xAxisGroupConfig,
      ).build();

      const seriesGroupConfig: CartesianSeriesGroupConfig = {
        axisGroup: xAxisComponents,
        type: "line",
        valueParams,
        dimensionParam,
      };

      const seriesComponents = new CartesianSeriesGroupBuilder(
        plotDatasets,
        seriesGroupConfig,
      ).build();

      expect(seriesComponents.length).toBe(11);
      expect(seriesComponents[0].type).toEqual("line");
      expect(seriesComponents[0].name).toEqual("value");
      expect(seriesComponents[0].encode.x).toEqual("year");
      expect(seriesComponents[0].encode.y).toEqual("value");
      expect(seriesComponents[0].xAxisIndex).toEqual(0);
      expect(seriesComponents[0].yAxisIndex).toEqual(0);
      expect(seriesComponents[0].symbolSize).toEqual(5);
      expect(seriesComponents[0].info.categoryName).toBe("Brazil");
      expect(seriesComponents[0].info.dimensionName).toBe("year");
      expect(seriesComponents[0].info.facetName).toBe("");
      expect(seriesComponents[0].info.subgroupName).toBe("");
      expect(seriesComponents[0].name).toEqual("value");
      expect(seriesComponents[0].datasetIndex).toBe(0);
      expect(seriesComponents[10].datasetIndex).toBe(10);
    });

    test("2 valueParams, 1 dimensionParam, 1 facetParam", () => {
      const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
      const parsedData = parseCsvData(filePath);

      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "Quantity",
        },
        {
          type: "number",
          name: "Profit",
        },
      ];
      const facetParam: DataParam = { type: "string", name: "Region" };
      const dimensionParam: DataParam = {
        type: "string",
        name: "Segment",
      };

      const dataset = new DatasetBuilder(parsedData, {
        valueParams,
        dimensionParam,
        facetParam,
      });
      const plotDatasets = dataset.getDatasets();
      const xAxisGroupConfig: AxisGroupConfig = {
        axis: "x",
        count: plotDatasets.length,
        dataParams: [dimensionParam],
        scale: true,
        show: true,
        uniformMinmax: true,
        isDimension: true,
        onZero: true,
      };

      const xAxisComponents = new AxisGroupBuilder(
        plotDatasets,
        xAxisGroupConfig,
      ).build();

      const seriesGroupConfig: CartesianSeriesGroupConfig = {
        axisGroup: xAxisComponents,
        type: "line",
        valueParams,
        dimensionParam,
      };

      const seriesComponents = new CartesianSeriesGroupBuilder(
        plotDatasets,
        seriesGroupConfig,
      ).build();

      expect(seriesComponents.length).toBe(8);
      expect(seriesComponents[0].type).toEqual("line");
      expect(seriesComponents[0].name).toEqual("Central");
      expect(seriesComponents[0].encode.x).toEqual("Segment");
      expect(seriesComponents[0].encode.y).toEqual("Quantity");
      expect(seriesComponents[0].xAxisIndex).toEqual(0);
      expect(seriesComponents[0].yAxisIndex).toEqual(0);
      expect(seriesComponents[0].symbolSize).toEqual(5);
      expect(seriesComponents[0].info.categoryName).toBe("");
      expect(seriesComponents[0].info.dimensionName).toBe("Segment");
      expect(seriesComponents[0].info.facetName).toBe("Central");
      expect(seriesComponents[0].info.subgroupName).toBe("");
      expect(seriesComponents[0].datasetIndex).toBe(0);

      expect(seriesComponents[1].type).toEqual("line");
      expect(seriesComponents[1].name).toBe("Central");
      expect(seriesComponents[1].encode.x).toBe("Segment");
      expect(seriesComponents[1].encode.y).toBe("Profit");
      expect(seriesComponents[1].xAxisIndex).toEqual(0);
      expect(seriesComponents[1].yAxisIndex).toEqual(0);
      expect(seriesComponents[1].datasetIndex).toEqual(0);

      expect(seriesComponents[2].type).toEqual("line");
      expect(seriesComponents[2].name).toBe("East");
      expect(seriesComponents[2].encode.x).toBe("Segment");
      expect(seriesComponents[2].encode.y).toBe("Quantity");
      expect(seriesComponents[2].xAxisIndex).toEqual(1);
      expect(seriesComponents[2].yAxisIndex).toEqual(1);
      expect(seriesComponents[2].datasetIndex).toEqual(1);

      expect(seriesComponents[7].datasetIndex).toEqual(3);
    });
  });
});
