import { GridConfig } from "@/components/Grid/GridConfig";
import { GridBuilder } from "@/components/Grid/GridBuilder";

describe("Grid", () => {
  it("should return 1 X 1 grid setting", () => {
    const config: GridConfig = {
      rows: 1,
      cols: 1,
    };
    const builder = new GridBuilder(config);
    const component = builder.build();
    const option = component?.toEChartOption();
    expect(option).toBeTruthy();
    expect(option!.length).toBe(1);
    expect(option![0].width).toBe("auto");
    expect(option![0].height).toBe("auto");
  });

  it("should return 1 X 2 grid setting", () => {
    const config: GridConfig = {
      rows: 1,
      cols: 2,
    };
    const builder = new GridBuilder(config);
    const component = builder.build();
    const option = component?.toEChartOption();
    expect(option).toBeTruthy();
    expect(option!.length).toBe(2);
    expect(option![0].width).toBe("41%");
    expect(option![0].height).toBe("88%");
  });

  it("should return 1 X 1 grid setting when rows < 1 or cols < 1", () => {
    const config: GridConfig = {
      rows: 0,
      cols: 2,
    };
    const builder = new GridBuilder(config);
    const component = builder.build();
    const option = component?.toEChartOption();
    expect(option).toBeTruthy();
    expect(option!.length).toBe(1);
    expect(option![0].width).toBe("auto");
    expect(option![0].height).toBe("auto");
  });
});
