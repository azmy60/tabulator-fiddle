const tableData = [];
for (let i = 1; i <= 95; i++) {
  tableData.push({ id: i, name: "Person " + i, score: (i * 37) % 100 });
}

const table = new Tabulator("#example-table", {
  data: tableData,
  layout: "fitColumns",
  pagination: true,
  paginationSize: 10,
  paginationSizeSelector: [10, 25, 50],
  columns: [
    { title: "ID", field: "id", width: 80 },
    { title: "Name", field: "name" },
    { title: "Score", field: "score", sorter: "number" },
  ],
});
