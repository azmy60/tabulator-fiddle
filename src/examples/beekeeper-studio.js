const tableData = [
  { name: "Oli Bob", progress: 12, gender: "male", rating: 1, col: "red" },
  { name: "Mary May", progress: 1, gender: "female", rating: 2, col: "blue" },
  { name: "Christine Lobowski", progress: 42, gender: "female", rating: 0, col: "green" },
  { name: "Brendon Philips", progress: 100, gender: "male", rating: 1, col: "orange" },
  { name: "Margret Marmajuke", progress: 16, gender: "female", rating: 5, col: "yellow" },
  { name: "Frank Harbours", progress: 38, gender: "male", rating: 4, col: "red" },
];

const mod = navigator.platform.startsWith("Mac") ? "meta" : "ctrl";

const table = new Tabulator("#example-table", {
  data: tableData,

  renderHorizontal: "virtual",
  autoResize: false,
  nestedFieldSeparator: false,
  selectableRange: true,
  selectableRangeColumns: true,
  selectableRangeMode: "ctrl",
  selectableRangeAutoFocus: false,
  selectableRangeRows: true,
  selectableRangeFill: true,
  resizableColumnGuide: true,
  movableColumns: true,
  height: "100%",
  editTriggerEvent: "dblclick",
  debugInvalidComponentFuncs: false,
  history: true,
  keybindings: {
    undo: `${mod} + z`,
    redo: [`${mod} + shift + z`, `${mod} + y`],
  },
  rowHeader: {
    field: "--row-header--bks",
    resizable: false,
    frozen: true,
    headerSort: false,
    editor: false,
    htmlOutput: false,
    print: false,
    clipboard: false,
    download: false,
    minWidth: 38,
    width: 38,
    hozAlign: "center",
    formatter: "rownum",
    formatterParams: {
      relativeToPage: true,
      binaryEncoding: "hex",
    },
  },

  columns: [
    { title: "Name", field: "name", editor: "input" },
    { title: "Progress", field: "progress", editor: "number" },
    { title: "Gender", field: "gender", editor: "input" },
    { title: "Rating", field: "rating", editor: "number" },
    { title: "Favourite Color", field: "col", editor: "input" },
  ],
});

function onRangeChange() {
  console.log("Ranges:", table.getRanges().length);
}

table.on("cellMouseUp", onRangeChange);
table.on("headerMouseUp", onRangeChange);
table.on("keyNavigate", onRangeChange);
table.on("dataProcessed", onRangeChange);
