import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

import {
  patternFileExtension,
  patternLinesSeparator,
  patternRowSeparator,
} from "./regex";
import { HEADERS } from "./utils";

function App() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [fileExtensionError, setFileExtensionError] = useState(false);

  const validationHeader = headers => {

  }

  const processData = data => {
    const lines = data.split(patternLinesSeparator);
    const headers = lines[0].split(patternRowSeparator);

    validationHeader(headers);
    console.log(lines)
    const list = [];
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(patternRowSeparator);
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    console.log(list)
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));
    console.log(columns)

    setData(list);
    setColumns(columns);
  }

  const handleFileUpload = e => {
    const file = e.target.files[0];

    if (!patternFileExtension.test(file.name)){
      setFileExtensionError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target.result;
      processData(result);
    };
    reader.readAsBinaryString(file);
  }

  return (
      <div>
        <h3>Applicant - <a href="https://www.linkedin.com/in/khrystyna-yelyseyeva-378b2319a/" target="_blank" rel="noopener noreferrer">Khrystyna Yelyseyeva (Linkedin)</a></h3>
        <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
        />
        { fileExtensionError ?
            <p>Error</p> :
            <DataTable
                pagination
                highlightOnHover
                columns={columns}
                data={data}
            />
        }
      </div>
  );
}

export default App;
