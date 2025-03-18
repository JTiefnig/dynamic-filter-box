import React, { useState } from "react";
import "./App.css";
import originaltabledata from "./data/data.json";

function App() {
  const [tabledata, setTableData] = useState(originaltabledata);

  function setFilterData(e) {
    const filterValue = e.target.value.toLowerCase();
    const filteredData = originaltabledata.filter((item) =>
      item.name.toLowerCase().includes(filterValue)
    );
    setTableData(filteredData);
  }

  return (
    <div className="App">
      <h1>Welcome</h1>

      <input
        type="text"
        placeholder="Filter by name"
        onChange={setFilterData}
      />

      <table className="table">
        <thead className="table-grid-header">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody className="table-grid-item">
          {tabledata.map((data, index) => (
            <tr key={index}>
              <td>{data.name}</td>
              <td>{data.age}</td>
              <td>{data.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
