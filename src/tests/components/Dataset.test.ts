import path from "path";
import { DataItem } from "@/types/DataItem";
import { Dataset } from "@/components/Dataset/Dataset";
import { DataParamType, DataParam } from "@/types/Param";
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
      const component = new Dataset(superStoreData);
      const valueType: DataParamType = "string";
      const facetName = "City";
      const categoryName = "Category";
      const subgroupName = "Sub-Category";
      const identifier = component.getIdentifierWith(
        valueType,
        facetName,
        categoryName,
        subgroupName,
      )(superStoreData[0]);
      expect(identifier?.toString()).toEqual(
        "facet::Henderson;category::Furniture;subgroup::Bookcases",
      );
    });
    it("should return facet and category only when value type is number", () => {
      const component = new Dataset(superStoreData);
      const valueType: DataParamType = "number";
      const facetName = "City";
      const categoryName = "Category";
      const subgroupName = "Sub-Category";
      const identifier = component.getIdentifierWith(
        valueType,
        facetName,
        categoryName,
        subgroupName,
      )(superStoreData[0]);
      expect(identifier?.toString()).toEqual(
        "facet::Henderson;category::Furniture",
      );
    });
  });

  test("getPlotDatasetWith", () => {
    const component = new Dataset(superStoreData);
    const valueParams: DataParam[] = [
      {
        type: "number",
        name: "Quantity",
      },
    ];
    const facetName = "State";
    const dimensionParam: DataParam = {
      type: "string",
      name: "Segment",
    };
    const categoryName = "Category";
    const identifier = component.getIdentifierWith(
      valueParams[0].type,
      facetName,
      categoryName,
    )(superStoreData[0]);

    expect(identifier).toBeDefined();
    if (identifier) {
      const plotDataset = component.getPlotDatasetWith(
        valueParams,
        dimensionParam,
      )([identifier, superStoreData]);

      expect(plotDataset).toBeDefined();
      if (plotDataset) {
        expect(plotDataset.getInfo().dimension).toBe("Segment");
        expect(plotDataset.getInfo().category).toBe("Furniture");
        expect(plotDataset.getInfo().facet).toBe("Kentucky");
      }
    }
  });

  describe("getPlotDatasets", () => {
    it("with facet", () => {
      const component = new Dataset(fertilityData);
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
      const facetName = "country";

      const plotDatasets = component.getPlotDatasets(
        valueParams,
        dimensionParam,
        facetName,
      );

      expect(plotDatasets.length).toBe(11);
    });

    it("with facet, subgroup", () => {
      const component = new Dataset(superStoreData.slice(0, 100));
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
      const facetName = "State";
      const categoryName = "Category";

      const plotDatasets = component.getPlotDatasets(
        valueParams,
        dimensionParam,
        facetName,
        categoryName,
      );

      expect(plotDatasets.length).toBe(38);
    });
  });
});
