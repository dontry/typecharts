import { DataItem } from "@/types/DataItem";
import moment, { Moment } from "moment";
import { FREQUENCY } from "@/types/Aggregation";
import { DataParam } from "@/types/Param";

interface FrequencyMeta {
  name: string;
  value: number;
  format: string;
}

export class DataItemWithDateTime {
  public static FREQUENCY_META: { [key: string]: FrequencyMeta } = {
    second: {
      name: "second",
      value: 1000,
      format: "DD/MM/YYYY HH:mm:ss",
    },
    minute: {
      name: "minute",
      value: 60000,
      format: "DD/MM/YYYY HH:mm",
    },
    hour: {
      name: "hour",
      value: 360000,
      format: "DD/MM/YYYY HH",
    },
    day: {
      name: "day",
      value: 86400000, // hour * 24
      format: "DD/MM/YYYY",
    },
    week: {
      name: "week",
      value: 604800000, // day * 7
      format: "ww/YYYY",
    },
    month: {
      name: "month",
      value: 2592000000, // day * 30, not accurate
      format: "MM/YYYY",
    },
    quarter: {
      name: "quarter",
      value: 7776000000, // month * 30 not accurate
      format: "Q/YYYY",
    },
    year: {
      name: "year",
      value: 31536000000, // day * 365 not accurate
      format: "YYYY",
    },
  };

  private dateTime: Moment;
  private frequency: FREQUENCY;

  constructor(
    private dataItem: DataItem,
    private dimensionParam: DataParam,
    private format?: string,
  ) {
    this.frequency = this.dimensionParam.aggregation as FREQUENCY;

    const dateTimeString = dataItem[this.dimensionParam.name];
    if (typeof dateTimeString === "string") {
      if (this.format) {
        this.dateTime = moment(dateTimeString, this.format);
      } else {
        this.dateTime = moment(dateTimeString);
      }
      if (!this.dateTime.isValid()) {
        throw new Error("dateTime is not valid");
      }
    } else {
      throw new Error("dateTimeString is not a string");
    }
  }

  public getDataItem(): DataItem {
    return this.dataItem;
  }

  public getDate(): Date {
    return this.dateTime.toDate();
  }

  public getTimestamp(): number {
    return this.dateTime.unix();
  }

  public getFormattedDate(): string {
    const format = DataItemWithDateTime.FREQUENCY_META[this.frequency].format;
    return this.dateTime.format(format);
  }

  public getFormattedTimestamp(): number {
    const format = DataItemWithDateTime.FREQUENCY_META[this.frequency].format;
    return moment(this.getFormattedDate(), format).unix();
  }

  public getFormat(): string | undefined {
    return this.format;
  }

  public getFrequency(): FREQUENCY | undefined {
    return this.frequency;
  }

  public toPlainObject(): DataItem {
    return {
      ...this.dataItem,
      _timestamp_: this.getTimestamp(),
      _date_: this.getFormattedDate(),
    };
  }
}
