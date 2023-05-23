// VDataTable
type DataTableCompareFunction<T = any> = (a: T, b: T) => number;
export type DataTableHeader = {
  key: string;
  title: string;
  colspan?: number;
  rowspan?: number;
  fixed?: boolean;
  align?: "start" | "end";
  width?: number;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
  sort?: DataTableCompareFunction;
};
