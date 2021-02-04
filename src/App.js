import React, { useState } from 'react';
import styled from 'styled-components';

import DataTable from './DataTable';

import {
  headersValidation,
  fullNameValidation,
  phoneValidation,
  emailValidation,
  ageValidation,
  experienceValidation,
  incomeValidation,
  hasChildrenValidation,
  licenseStatesValidation,
  expirationDateValidation,
  licenseNumberValidation,
  duplicateValidation
} from './validation-functions'

import {
  patternFileExtension,
  patternLinesSeparator,
  patternRowSeparator
} from "./regex";

import {HEADERS} from "./utils";

const Error = styled.div`
  color: #ba3939;
  background: #ffe0e0;
  border: 1px solid #a33a3a;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
`;


const Input = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

const Label = styled.label`
  width: 180px;
  height: 50px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  display: block;
  font: 14px/50px Tahoma;
  transition: all 0.18s ease-in-out;
  border: 1px solid #333;
  color: #333;
  background: #eeee4a;
  margin: 50px 0 20px;

  &:hover {
    color: white;
    background: #333;
  }
`;

function App() {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [fileError, setFileError] = useState(false);


  const processData = data => {
    setFileError(false);

    const lines = data.split(patternLinesSeparator);
    let headers = lines[0].split(patternRowSeparator);

    if (!headersValidation(headers)) {
      setFileError(true);
      return;
    }

    headers = [
      "ID",
      ...HEADERS,
      "Duplicate with",
    ];

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const row = [
        String(i),
        ...lines[i]
            .split(patternRowSeparator)
            .map(item => item.trim()),
        '',
      ];

      const requiredFieldsAreFilled = row[1] && row[2] && row[3];
      if (!requiredFieldsAreFilled){
        setFileError(true);
        return;
      }

      const rowsData = {};
      for (let j = 0; j < headers.length; j++) {
        let cellValue = row[j];

        if (cellValue.length > 0) {
          if (cellValue[0] === '"') cellValue = cellValue.substring(1, cellValue.length - 1);
          if (cellValue[cellValue.length - 1] === '"') cellValue = cellValue.substring(cellValue.length - 2, 1);
        }

        let cellError = false;

        switch (headers[j]) {
          case 'Full Name':
            cellError = !fullNameValidation(cellValue);
            break;
          case 'Phone':
            cellError = !phoneValidation(cellValue);
            cellValue = cellError ?
                cellValue : `+1${cellValue.slice(-10)}`;
            break;
          case 'Email':
            cellError = !emailValidation(cellValue);
            cellValue = cellError ?
                cellValue : cellValue.toLowerCase();
            break;
          case 'Age':
            cellError = !ageValidation(cellValue);
            cellValue = cellError || cellValue === '' ?
                cellValue : Number(cellValue);
            break;
          case 'Experience':
            cellError = !experienceValidation(cellValue, Number(row[j-1]));
            cellValue = cellError || cellValue === '' ?
                cellValue : Number(cellValue);
            break;
          case 'Yearly Income':
            cellError = !incomeValidation(cellValue);
            cellValue = cellError ?
                cellValue : Number(cellValue).toFixed(2);
            break;
          case 'Has children':
            cellValue = cellValue ? cellValue : 'FALSE';
            cellError = !hasChildrenValidation(cellValue);
            break;
          case 'License states':
            const { errorState, preparedStates } = licenseStatesValidation(cellValue)
            cellError = errorState;
            cellValue = preparedStates;
            break;
          case 'Expiration date':
            cellError = !expirationDateValidation(cellValue);
            break;
          case 'License number':
            cellError = !licenseNumberValidation(cellValue);
            break;
          default:
            break;
        }

        const errorPrefix = cellError ? 'error' : '';
        rowsData[errorPrefix + headers[j]] = cellValue;
      }

      // remove the blank rows
      if (Object.values(rowsData).filter(x => x).length > 0) {
        rows.push(rowsData);
      }
    }

    setData(duplicateValidation(rows));
    setHeaders(headers);
  }

  const handleFileUpload = e => {
    if (!e.target.files[0]) return;

    const file = e.target.files[0];

    if (!patternFileExtension.test(file.name)){
      setFileError(true);
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

        <Label htmlFor="file">
          Виберіть файл
          <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
          />
        </Label>

        { fileError ?
            <Error>
              <h4>Error</h4>
              Please check:
              <ul>
                <li>File extension.</li>
                <li>
                  Correctness and sequence of writing table heads.<br/>
                  Here's what we expect:
                  <ul>
                    <li>"Full Name"</li>
                    <li>"Phone"</li>
                    <li>"Email"</li>
                    <li>"Age"</li>
                    <li>"Experience"</li>
                    <li>"Yearly Income"</li>
                    <li>"Has children"</li>
                    <li>"License states"</li>
                    <li>"Expiration date"</li>
                    <li>"License number"</li>
                  </ul>
                  Don't add "ID" or "Duplicate with". We make it automatically.
                </li>
                <li>
                  The fullness of all the cells in the columns "Full name", "Phone", "Email".
                  They are required.
                </li>
              </ul>
            </Error> :
            <DataTable
                headers={headers}
                data={data}
            />
        }
      </div>
  );
}

export default App;
