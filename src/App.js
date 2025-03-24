import React, { useState, useEffect } from "react";
import DynamicTable from "./DynamicTable";
import "./App.css";

const data_url =
  "https://raw.githubusercontent.com/Ovi/DummyJSON/refs/heads/master/database/products.json";

function App() {
  const [originaltabledata, setOriginalTableData] = useState([]);

  const [tabledata, setTableData] = useState([]);

  useEffect(() => {
    fetch(data_url)
      .then((res) => res.json())
      .then((data) => {
        setOriginalTableData(data);
        setTableData(data);
      });
  }, []);

  const [filterError, setFilterError] = useState("");
  const [filterExpression, setFitlerExpression] = useState("");

  useEffect(() => {
    setFilterData();
  }, [filterExpression]);

  function setFilterData() {}

  const table_colums = [
    "id",
    "title",
    "category",
    "price",
    "discountPercentage",
    "rating",
    "tags",
    "availabilityStatus",
  ];

  return (
    <div className="App">
      <h1>Testing Filter Script</h1>

      <div className="dynamic-input">
        <div className="element A"></div>
        <div className="element O"></div>
        <input type="text" className="element" />
      </div>

      <button onClick={() => setFitlerExpression("name~'Jo'")}>
        Set Filter
      </button>

      <input
        className="filter-input"
        type="text"
        placeholder="filter input"
        onChange={(e) => setFitlerExpression(e.target.value)}
        value={filterExpression}
      />
      {filterError && <p>{filterError}</p>}

      <DynamicTable data={tabledata} columns={table_colums} />
    </div>
  );
}

export default App;
