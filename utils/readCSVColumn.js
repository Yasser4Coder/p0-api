const fs = require("fs");
const csv = require("csv-parser");

function readCSVColumn(filePath, columnName) {
  return new Promise((resolve, reject) => {
    const result = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row[columnName]) result.push(row[columnName]);
      })
      .on("end", () => resolve(result))
      .on("error", reject);
  });
}

module.exports = { readCSVColumn };
