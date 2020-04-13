import { parse } from "papaparse";
import fs from "fs";
import { DataItem } from "@/types/DataItem";

export function parseCsvData(filePath: string, fastMode?: boolean): DataItem[] {
  const file = fs.readFileSync(filePath, "utf8");
  const res = parse(file, {
    fastMode: fastMode,
    delimiter: ",",
    quoteChar: '"',
    header: true,
  });

  return res.data;
}
