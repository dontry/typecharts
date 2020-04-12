import { parse } from "papaparse";
import fs from "fs";
import { DataItem } from "@/types/DataItem";

export function parseCsvData(filePath: string): DataItem[] {
  const file = fs.readFileSync(filePath, "utf8");
  const res = parse(file, {
    delimiter: ",",
    fastMode: true,
    header: true,
  });

  return res.data;
}
