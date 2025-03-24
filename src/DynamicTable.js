import React from "react";
import "./DynamicTable.css";

const DynamicTable = ({ data, columns }) => {
  return (
    <table className="table-grid">
      <thead>
        <tr className="table-grid-header">
          {columns.map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((obj, index) => (
          <tr key={index} className="table-grid-item">
            {columns.map((key) => (
              <td key={key}>{obj[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
