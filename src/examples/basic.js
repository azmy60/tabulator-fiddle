const tableData = [
  { id: 1, name: "Oli Bob", age: 12, col: "red", dob: "14/04/1984" },
  { id: 2, name: "Mary May", age: 1, col: "blue", dob: "14/05/1982" },
  { id: 3, name: "Christine Lobowski", age: 42, col: "green", dob: "22/05/1982" },
  { id: 4, name: "Brendon Philips", age: 125, col: "orange", dob: "01/08/1980" },
  { id: 5, name: "Margret Marmajuke", age: 16, col: "yellow", dob: "31/01/1999" },
];

const table = new Tabulator("#example-table", {
  data: tableData,
  layout: "fitColumns",
  columns: [
    { title: "Name", field: "name" },
    { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
    { title: "Favourite Color", field: "col" },
    { title: "Date Of Birth", field: "dob", hozAlign: "center" },
  ],
});
