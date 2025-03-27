import React, { useState, useEffect } from "react";
import DynamicTable from "./DynamicTable";
import "./App.css";
import tokenize from "./filterfunction";

const data_url =
  "https://raw.githubusercontent.com/Ovi/DummyJSON/refs/heads/master/database/products.json";

function App() {
  const [originaltabledata, setOriginalTableData] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [tokens, setTokens] = useState([]);

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

  function setFilterData() {
    try {
      const tokens = tokenize(filterExpression);
      if (tokens !== null) {
        setTokens(tokens);
        return;
      }
    } catch (e) {
      setFilterError(e.message);
      setTokens([]);
    }
  }

  // for testing purposes
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
      <h1>Dynamic Filter</h1>

      <input
        className="filter-input"
        type="text"
        placeholder="filter input"
        onChange={(e) => setFitlerExpression(e.target.value)}
        value={filterExpression}
      />
      {filterError && <p>{filterError}</p>}

      <div className="tokens-list">
        {tokens.map((token, index) => (
          <div key={index} className="element">
            {token}
          </div>
        ))}
      </div>

      <DynamicTable data={tabledata} columns={table_colums} />
    </div>
  );
}

export default App;
