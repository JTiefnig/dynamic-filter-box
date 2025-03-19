import React, { useState } from "react";
import "./App.css";
import originaltabledata from "./data/data.json";

function parseQuery(query) {
  const conditions = [];
  const regex = /(\w+)\s*(>=|<=|>|<|:|~)\s*("?[\w\s]+"?)/g;

  let match;
  while ((match = regex.exec(query)) !== null) {
    let [, field, operator, value] = match;
    value = value.replace(/"/g, ""); // Remove quotes
    conditions.push({ field, operator, value });
  }

  return conditions;
}

function filterJsonObjects(data, query) {
  const operators = {
    ":": (a, b) => a == b, // Loose comparison for type flexibility
    ">=": (a, b) => a >= b,
    "<=": (a, b) => a <= b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    "~": (a, b) => a.includes(b),
  };

  const conditions = parseQuery(query);

  return data.filter((obj) => {
    return conditions.every(({ field, operator, value }) => {
      if (!(field in obj)) return false;

      let objValue = obj[field];

      // Convert to number if applicable
      if (!isNaN(objValue) && !isNaN(value)) {
        objValue = Number(objValue);
        value = Number(value);
      }

      return operators[operator](objValue, value);
    });
  });
}

function App() {
  const [tabledata, setTableData] = useState(originaltabledata);
  const [filterError, setFilterError] = useState("");

  function setFilterData(e) {
    const filterExpression = e.target.value;

    try {
      const filteredData = filterJsonObjects(
        originaltabledata,
        filterExpression
      );
      setFilterError("");
      setTableData(filteredData);
    } catch (e) {
      setFilterError(e.message);
    }
  }

  function getTableColumns() {
    return Object.keys(tabledata[0] || {});
  }

  return (
    <div className="App">
      <h1>Testing Filter Script</h1>

      <input
        className="filter-input"
        type="text"
        placeholder="filter input"
        onChange={setFilterData}
      />
      {filterError && <p>{filterError}</p>}

      <table className="table">
        <thead className="table-grid-header">
          <tr>
            {getTableColumns().map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="table-grid-item">
          {tabledata.map((data, index) => (
            <tr key={index}>
              {getTableColumns().map((column, index) => (
                <td key={index}>{data[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
