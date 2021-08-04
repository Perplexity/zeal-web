declare type GridRowModel = GridRowData;

declare type GridRowData = {
  [key: string]: any;
};
export interface GridRowSelectedParams {
  /**
   * The row data of the row that triggers the event.
   */
  data: GridRowModel;
  /**
   * The selected state of the row that triggers the event.
   */
  isSelected: boolean;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  api: any;
}