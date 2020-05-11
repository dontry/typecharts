import { TitleConfig } from "@/components/Title/TitleConfig";
import {
  TitleBuilder,
  TitleBuilderConfig,
} from "@/components/Title/TitleBuilder";

describe("Test Builder", () => {
  it("should build a blank title component", () => {
    const config: TitleBuilderConfig = {
      show: true,
      text: "aaa",
    };
    const builder = new TitleBuilder(config);
    builder.build();
    const component = builder.getComponent();
    expect(component.show).toBe(true);
    expect(component.text).toBe("aaa");
  });
  it("should build a title component", () => {
    const config: TitleBuilderConfig = {
      show: true,
      text: "aaa",
      textAlign: "left",
      left: "10%",
      top: "50%",
    };

    const builder = new TitleBuilder(config);
    builder.build();
    const component = builder.getComponent();
    const option = component.toEChartOption();

    expect(option).toEqual({
      show: true,
      text: "aaa",
      textAlign: "left",
      left: "10%",
      top: "50%",
    });
  });

  it("should update component's properties", () => {
    const config: TitleBuilderConfig = {
      text: "aaa",
      show: true,
    };

    const builder = new TitleBuilder(config);
    builder.build();
    builder.setText("bbb");
    builder.setShow(false);

    const component = builder.getComponent();
    expect(component.show).toBe(false);
    expect(component.text).toBe("bbb");
  });
});

describe("Title component", () => {
  it("should return echart option", () => {
    const config: TitleBuilderConfig = {
      text: "aaa",
      show: true,
    };

    const builder = new TitleBuilder(config);
    builder.build();
    const component = builder.getComponent();
    const option = component.toEChartOption();

    expect(option).toStrictEqual({
      text: "aaa",
      show: true,
      textAlign: "center",
      top: 0,
      left: 0,
    });
  });
});
