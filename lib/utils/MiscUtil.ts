import { DataParam } from "@/types/Param";
import { minBy, maxBy, meanBy, sumBy } from "lodash";
import { DataItem } from "@/types/DataItem";
import { DataSourceType } from "@/types/DataSourceType";
import { compact } from "lodash";

export function aggregateDataByValueParam(
  data: DataItem[],
  valueParam: DataParam,
): number {
  const { title, aggregation } = valueParam;
  try {
    switch (aggregation) {
      case "count":
        return data.length;
      case "min":
        return minBy(data as any[], title)[title];
      case "max":
        return maxBy(data as any[], title)[title];
      case "mean":
        return meanBy(data, title);
      case "sum":
      case undefined:
        return sumBy(data, title);
      default:
        console.error("Invalid aggregation");
        return NaN;
    }
  } catch (e) {
    console.error("Cannot aggregate data: " + e.message);
    return NaN;
  }
}

export function checkArrayType(array: any[] = [], type: string): boolean {
  return array.every((element) => typeof element === type);
}

export function naturalSort(array: DataSourceType[]): DataSourceType[] {
  const e = (s: number | string): string =>
    (" " + s + " ")
      .replace(/[\s]+/g, " ")
      .toLowerCase()
      .replace(/[\d]+/, (d) => {
        d = "" + 1e20 + d;
        return d.substring(d.length - 20);
      });
  if (
    array.every((ele) => typeof ele === "number" || typeof ele === "string")
  ) {
    return compact(array as (number | string)[]).sort((a, b) =>
      e(a).localeCompare(e(b)),
    );
  } else {
    return compact(array);
  }
}
