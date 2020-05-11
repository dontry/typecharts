/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataParam } from "@/types/Param";
import { minBy, maxBy, meanBy, sumBy } from "lodash";
import { DataSourceType } from "@/types/DataSourceType";
import { compact, isObject } from "lodash";
import { DataItem } from "@/types/DataItem";

export function aggregateDataByValueParam(
  data: DataItem[],
  valueParam: DataParam,
): number {
  const { name, aggregation } = valueParam;
  try {
    switch (aggregation) {
      case "count":
        return data.length;
      case "min":
        return minBy(data as any[], name)[name];
      case "max":
        return maxBy(data as any[], name)[name];
      case "mean":
        return meanBy(data, name);
      case "sum":
      case undefined:
        return sumBy(data, name);
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
  return array.every((element) => {
    if (type === "number") {
      return typeof Number.parseFloat(element) === "number";
    } else {
      return typeof element === type;
    }
  });
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

const MAX_MIX_LEVEL = 5;

function _deepMerge(
  dist: { [x: string]: any },
  src: { [x: string]: any },
  level?: number | undefined,
  maxLevel?: number | undefined,
): void {
  level = level || 0;
  maxLevel = maxLevel || MAX_MIX_LEVEL;
  for (const key in src) {
    // eslint-disable-next-line no-prototype-builtins
    if (src.hasOwnProperty(key)) {
      const value = src[key];
      if (value !== null && isObject(value)) {
        if (!isObject(dist[key])) {
          dist[key] = {};
        }
        if (level < maxLevel) {
          _deepMerge(dist[key], value, level + 1, maxLevel);
        } else {
          dist[key] = src[key];
        }
      } else if (Array.isArray(value)) {
        dist[key] = [];
        dist[key] = dist[key].concat(value);
      } else if (value !== undefined) {
        dist[key] = value;
      }
    }
  }
}

export function deepMerge(rst: any, ...args: any[]): any {
  for (let i = 0; i < args.length; i += 1) {
    _deepMerge(rst, args[i]);
  }
  return rst;
}

export function calculatePercentageOfString(
  percentageOperation: string,
): string {
  const operation = percentageOperation.replace(/[\s%]/g, "");
  const result = eval(operation);
  return Number.isNaN(result) ? "50%" : result + "%";
}
