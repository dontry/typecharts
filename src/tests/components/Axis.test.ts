import { AxisBuilder } from "@/components/Axis/AxisBuilder";
import path from "path";
import {
  AxisGroupBuilder,
  AxisGroupConfig,
} from "@/components/Axis/AxisGroupBuilder";
import { parseCsvData } from "../fixtures/utils";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { DataParam } from "@/types/Param";
import { NUMBER_AGGREGATION } from "@/types/Aggregation";
import { AxisComponentConfig } from "@/components/Axis/AxisComponent";

describe("Axis", () => {
  describe("AxisBuilder", () => {
    it("should return axis", () => {
      const data = [1, 2, 3, 45, 5, 76, 8, 10];
      const config: AxisComponentConfig = {
        name: "test",
        type: "value",
        axisDimension: "x",
        gridIndex: 1,
        data: data,
        nameGap: 10,
        count: 6,
        scale: true,
        show: true,
      };
      const builder = new AxisBuilder(config);
      const component = builder.build();

      expect(component).toBeTruthy();
      if (component) {
        expect(component.count).toBe(6);
        expect(component.data).toBe(data);
        expect(component.nameGap).toBe(10);
      }
    });
  });

  describe("AxisGroupBuilder", () => {
    test("2 valueParams, 1 dimensionParam", () => {
      const filePath = path.resolve(__dirname, "../fixtures/iris.csv");
      const data = parseCsvData(filePath, true);
      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "sepalwidth",
        },
        {
          type: "number",
          name: "petallength",
        },
      ];
      const dimensionParam: DataParam = {
        type: "number",
        name: "sepallength",
      };
      const config = { valueParams, dimensionParam };
      const builder = new DatasetBuilder(data, config);

      const plotDatasets = builder.getDatasets();
      const xConfig: AxisGroupConfig = {
        name: "sepallength",
        axis: "x",
        dataParams: [dimensionParam],
        count: plotDatasets.length,
        onZero: true,
        uniformMinmax: true,
        show: true,
        scale: true,
        isDimension: true,
      };

      const xBuilder = new AxisGroupBuilder(xConfig);
      const xAxisGroupComponent = xBuilder.build(plotDatasets);

      expect(xAxisGroupComponent.length).toBe(1);
      if (xAxisGroupComponent[0]) {
        expect(xAxisGroupComponent[0].count).toBe(1);
        expect(xAxisGroupComponent[0].nameGap).toBe(27);
        expect(xAxisGroupComponent[0].gridIndex).toBe(0);
        expect(xAxisGroupComponent[0].min).toBe(3.5);
        expect(xAxisGroupComponent[0].max).toBe(8.5);
        expect(xAxisGroupComponent[0].show).toBe(true);
        expect(xAxisGroupComponent[0].scale).toBe(true);
        expect(xAxisGroupComponent[0].position).toBe("left");
        expect(xAxisGroupComponent[0].name).toBe("sepallength");
      }

      const yConfig: AxisGroupConfig = {
        axis: "y",
        dataParams: valueParams,
        count: plotDatasets.length,
        onZero: true,
        uniformMinmax: false,
        show: true,
        scale: true,
      };

      const yBuilder = new AxisGroupBuilder(yConfig);
      const yAxisGroupComponent = yBuilder.build(plotDatasets);

      expect(yAxisGroupComponent.length).toBe(1);
      if (yAxisGroupComponent[0]) {
        expect(yAxisGroupComponent[0].count).toBe(1);
        expect(yAxisGroupComponent[0].nameGap).toBe(27);
        expect(yAxisGroupComponent[0].gridIndex).toBe(0);
        expect(yAxisGroupComponent[0].min).toBe(0);
        expect(yAxisGroupComponent[0].max).toBe(9);
        expect(yAxisGroupComponent[0].show).toBe(true);
        expect(yAxisGroupComponent[0].scale).toBe(true);
        expect(yAxisGroupComponent[0].position).toBe("bottom");
      }
    });

    test("1 valueParam, 1 dimensionParam, 1 categoryParam, 1 facetParam", () => {
      const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
      const data = parseCsvData(filePath);
      const dimensionParam: DataParam = {
        type: "string",
        name: "State",
        aggregation: NUMBER_AGGREGATION.SUM,
      };
      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "Profit",
        },
      ];
      const facetParam: DataParam = {
        type: "string",
        name: "Region",
      };

      const categoryParam: DataParam = {
        type: "string",
        name: "Category",
      };
      const datasetComponent = new DatasetBuilder(data, {
        dimensionParam,
        valueParams,
        facetParam,
        categoryParam,
      });
      const plotDatasets = datasetComponent.getDatasets();

      const xConfig: AxisGroupConfig = {
        axis: "x",
        dataParams: [dimensionParam],
        count: plotDatasets.length,
        onZero: true,
        uniformMinmax: true,
        show: true,
        scale: true,
        isDimension: true,
      };
      const xBuilder = new AxisGroupBuilder(xConfig);
      const xAxisGroupComponent = xBuilder.build(plotDatasets);

      expect(xAxisGroupComponent.length).toBe(4);
      if (xAxisGroupComponent[0]) {
        expect(xAxisGroupComponent[0].count).toBe(12);
        expect(xAxisGroupComponent[0].nameGap).toBe(27);
        expect(xAxisGroupComponent[0].gridIndex).toBe(0);
        expect(xAxisGroupComponent[0].min).toBeUndefined();
        expect(xAxisGroupComponent[0].max).toBeUndefined();
        expect(xAxisGroupComponent[0].data).toEqual([
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Michigan",
          "Minnesota",
          "Missouri",
          "Nebraska",
          "North Dakota",
          "Oklahoma",
          "South Dakota",
          "Texas",
          "Wisconsin",
        ]);
        expect(xAxisGroupComponent[0].show).toBe(true);
        expect(xAxisGroupComponent[0].scale).toBe(true);
        expect(xAxisGroupComponent[0].position).toBe("left");
        expect(xAxisGroupComponent[0].name).toBe("");
      }

      const yConfig: AxisGroupConfig = {
        axis: "y",
        dataParams: valueParams,
        count: plotDatasets.length,
        onZero: true,
        uniformMinmax: true,
        show: true,
        scale: true,
      };
      const yBuilder = new AxisGroupBuilder(yConfig);
      const yAxisGroupComponent = yBuilder.build(plotDatasets);

      expect(yAxisGroupComponent.length).toBe(4);
      if (yAxisGroupComponent[0]) {
        expect(yAxisGroupComponent[0].count).toBe(12);
        expect(yAxisGroupComponent[0].nameGap).toBe(27);
        expect(yAxisGroupComponent[0].gridIndex).toBe(0);
        expect(yAxisGroupComponent[0].min).toBe(-12500);
        expect(yAxisGroupComponent[0].data).toBeUndefined();
        expect(yAxisGroupComponent[0].max).toBe(12500);
        expect(yAxisGroupComponent[0].show).toBe(true);
        expect(yAxisGroupComponent[0].scale).toBe(true);
        expect(yAxisGroupComponent[0].position).toBe("bottom");
      }
    });
  });
});
