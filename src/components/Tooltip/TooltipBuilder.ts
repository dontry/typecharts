import { AbstractComponentBuilder } from "../AbstractComponentBuilder";
import {
  TooltipComponent,
  Tooltip,
  Formatter,
  Format,
} from "./TooltipComponent";
import { TooltipConfig, Trigger } from "./TooltipConfig";
import { isEmpty, isNil } from "lodash";

export type TooltipBuilderConfig = TooltipConfig;
export interface TooltipFormatterSchema {
  name: string;
  value: string;
}

export interface TooltipFormatterConfig {
  showSeriesName: boolean;
}

export class TooltipBuilder extends AbstractComponentBuilder<
  Tooltip,
  TooltipComponent
> {
  public static getTooltipFormatter(
    schema: TooltipFormatterSchema[],
    config: TooltipFormatterConfig,
  ): Formatter {
    const formatter = (params: Format | Format[]): string => {
      let param: Format;
      if (Array.isArray(params)) {
        param = params[0];
      } else {
        param = params;
      }
      const startString =
        config.showSeriesName && !isEmpty(param.seriesName)
          ? `${param.seriesName}<br />`
          : "";
      return schema.reduce((str, dataParam) => {
        let _value = "";
        try {
          const key = dataParam.value;
          _value = key ? param.data[key] : "";
        } catch (e) {
          console.error("Invalid param");
          console.error(e);
        }
        const value =
          typeof _value === "number" ? Number(_value).toPrecision(2) : _value;
        return (
          str + (dataParam.name ? `${dataParam.name}: ${value} <br />` : "")
        );
      }, startString);
    };
    return formatter;
  }

  constructor(config: TooltipBuilderConfig) {
    super(config);
    this.initializeComponent();
  }
  protected initializeComponent(): void {
    this.component = new TooltipComponent();
  }

  protected setShow(show = false): void {
    this.component.show = show;
  }

  protected setTrigger(trigger: Trigger = "item"): void {
    this.component.trigger = trigger;
  }

  protected setFormatter(formatter: Formatter): void {
    this.component.formatter = formatter;
  }

  public build(): TooltipComponent | null {
    if (isNil(this.config)) {
      return null;
    }
    const { show, trigger, formatter } = this.config;
    this.setShow(show);
    this.setTrigger(trigger);
    this.setFormatter(formatter);

    return this.component;
  }
}
