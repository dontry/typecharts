import { TitleConfig } from "@/components/Title/TitleConfig";
import { TitleBuilder } from "@/components/Title/TitleBuilder";

describe("Test Builder", () => {
  it("should build a blank title component", () => {
    const builder = new TitleBuilder();
    builder.build();
    const component = builder.getComponent();
    expect(component.show).toBe(true);
    expect(component.text).toBe("");
  });
  it("should build a title component", () => {
    const config: TitleConfig = {
      text: "aaa",
      show: true,
    };

    const builder = new TitleBuilder(config);
    builder.build();
    const component = builder.getComponent();
    expect(component.show).toBe(true);
    expect(component.text).toBe("aaa");
  });

  it("should update component's properties", () => {
    const config: TitleConfig = {
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
    const config: TitleConfig = {
      text: "aaa",
      show: true,
    };

    const builder = new TitleBuilder(config);
    builder.build();
    const component = builder.getComponent();
    const option = component.toEchartOption();

    expect(option).toStrictEqual({ text: "aaa", show: true });
  });
});
