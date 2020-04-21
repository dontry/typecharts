import path from "path";
import { DataItem } from "@/types/DataItem";
import { DatasetBuilder } from "@/components/Dataset/DatasetBuilder";
import { DataParam } from "@/types/Param";
import { parseCsvData } from "../fixtures/utils";
import fertilityData from "../fixtures/fertility.json";

describe("Dataset", () => {
  let superStoreData: DataItem[];
  beforeAll(() => {
    const filePath = path.resolve(__dirname, "../fixtures/superstore.csv");
    const parsedData = parseCsvData(filePath);
    superStoreData = parsedData;
  });

  describe("getIdentifierWith", () => {
    it("should return face, category and subgroup when value type is string", () => {
      const valueParams: DataParam[] = [
        {
          type: "string",
          name: "Region",
        },
      ];
      const dimensionParam: DataParam = { type: "string", name: "Region" };
      const facetParam: DataParam = { type: "string", name: "City" };
      const categoryParam: DataParam = { type: "string", name: "Category" };
      const subgroupParam: DataParam = { type: "string", name: "Sub-Category" };
      const component = new DatasetBuilder(superStoreData, {
        valueParams,
        dimensionParam,
        facetParam,
        categoryParam,
        subgroupParam,
      });
      const identifier = component.getIdentifierWith(
        valueParams[0].type,
        facetParam.name,
        categoryParam.name,
        subgroupParam.name,
      )(superStoreData[0]);
      expect(identifier?.toString()).toEqual(
        "facet::Henderson;category::Furniture;subgroup::Bookcases",
      );
    });
    it("should return facet and category only when value type is number", () => {
      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "Quantity",
        },
      ];
      const dimensionParam: DataParam = { type: "string", name: "Region" };
      const facetParam: DataParam = { type: "string", name: "City" };
      const categoryParam: DataParam = { type: "string", name: "Category" };
      const subgroupParam: DataParam = { type: "string", name: "Sub-Category" };
      const component = new DatasetBuilder(superStoreData, {
        valueParams,
        dimensionParam,
        facetParam,
        categoryParam,
        subgroupParam,
      });

      const identifier = component.getIdentifierWith(
        valueParams[0].type,
        facetParam.name,
        categoryParam.name,
        subgroupParam.name,
      )(superStoreData[0]);
      expect(identifier?.toString()).toEqual(
        "facet::Henderson;category::Furniture",
      );
    });
  });

  test("getPlotDatasetWith", () => {
    const valueParams: DataParam[] = [
      {
        type: "number",
        name: "Quantity",
      },
    ];
    const facetParam: DataParam = { type: "string", name: "State" };
    const dimensionParam: DataParam = {
      type: "string",
      name: "Segment",
    };
    const categoryParam: DataParam = { type: "string", name: "Category" };
    const component = new DatasetBuilder(superStoreData, {
      valueParams,
      dimensionParam,
      facetParam,
      categoryParam,
    });
    const identifier = component.getIdentifierWith(
      valueParams[0].type,
      facetParam.name,
      categoryParam.name,
    )(superStoreData[0]);

    expect(identifier).toBeDefined();
    if (identifier) {
      const plotDataset = component.getDatasetWith(
        valueParams,
        dimensionParam,
      )([identifier, superStoreData]);

      expect(plotDataset).toBeDefined();
      if (plotDataset) {
        expect(plotDataset.getInfo().dimensionName).toBe("Segment");
        expect(plotDataset.getInfo().categoryName).toBe("Furniture");
        expect(plotDataset.getInfo().facetName).toBe("Kentucky");
      }
    }
  });

  describe("getPlotDatasets", () => {
    it("with facet", () => {
      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "value",
        },
      ];
      const dimensionParam: DataParam = {
        type: "number",
        name: "year",
      };
      const facetParam: DataParam = { type: "string", name: "country" };
      const component = new DatasetBuilder(fertilityData, {
        valueParams,
        dimensionParam,
        facetParam,
      });

      const plotDatasets = component.getDatasets();

      expect(plotDatasets.length).toBe(11);
    });

    it("with facet, subgroup", () => {
      const valueParams: DataParam[] = [
        {
          type: "number",
          name: "Quantity",
        },
      ];
      const dimensionParam: DataParam = {
        type: "number",
        name: "Profit",
      };
      const facetParam: DataParam = { type: "string", name: "State" };
      const categoryParam: DataParam = { type: "string", name: "Category" };

      const component = new DatasetBuilder(superStoreData.slice(0, 100), {
        valueParams,
        dimensionParam,
        facetParam,
        categoryParam,
      });
      const plotDatasets = component.getDatasets();

      expect(plotDatasets.length).toBe(38);
    });
  });
});
