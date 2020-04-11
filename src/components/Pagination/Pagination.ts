import { EChartOption } from "echarts";

export class Pagination {
  constructor(
    private pageIndex: number,
    private pageSize: number,
    private pageCount: number,
  ) {}

  handlePagination(option: EChartOption): any {
    return {
      ...option,
      pagintation: {
        index: this.pageIndex,
        size: this.pageSize,
        count: this.pageCount,
      },
    };
  }
}
