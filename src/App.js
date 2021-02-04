import React, { useState } from 'react';
import styled from 'styled-components';

import DataTable from './DataTable';

import {
  patternFileExtension,
  patternLinesSeparator,
  patternRowSeparator,
  patternFullName,
  patternPhone,
  patternLicense,
  patternLicenseStates,
  patternFirstDateType,
  patternSecondDateType,
} from "./regex";
import {HEADERS, USA_STATES} from "./utils";

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


  const headersValidation = headers => {
    if (headers.length !== HEADERS.length) {
      return false;
    }

    return headers
        .every((header, index) => {
          const preparedHeader = header.trim();
          const patternHeader = new RegExp(preparedHeader, "i");

          return patternHeader.test(HEADERS[index]);
        })
  };

  const fullNameValidation = fullName => patternFullName.test(fullName);

  const phoneValidation = phone => patternPhone.test(phone);

  const ageValidation = age => age === '' ? true :
      age.length === 2
      && Number(age)
      && Number(age) >= 21;

  const experienceValidation = (experience, age = 21) => experience === '' ? true :
      experience.length === 2
      && Number(experience)
      && Number(experience) >= 0
      && Number(age ? age : 21) - Number(experience) >= 18;

  const incomeValidation = income => income === '' ? true :
      income.length <= 12
      && Number(income)
      && Number(income) >= 0
      && Number(income) <= 1000000;

  const hasChildrenValidation = hasChildren =>
      ['TRUE', 'FALSE'].some( value => value === hasChildren);

  const licenseStatesValidation = states => {
    if (!patternLicenseStates.test(states)) {
      return {
        errorState: !(states === ''),
        preparedStates: states,
      }
    }

    let errorState = false;
    const preparedStates = states
        .split(', ')
        .map( state => {
          if (state.length === 2) {
            const isValidState = USA_STATES
                .some( existingState =>
                    state.toUpperCase() === existingState.abbreviation );

            errorState = !isValidState;
            return isValidState ? state.toUpperCase() : state;
          } else if (state.length > 2) {
            const validStateObj = USA_STATES
                .find( existingState => {
                  return state === existingState.name
                } );

            errorState = !Boolean(validStateObj);
            return errorState ? state : validStateObj.abbreviation;
          } else {
            errorState = state;
            return state;
          }
        })
        .join(', ');

    return {
      errorState,
      preparedStates
    }
  }

  const expirationDateValidation = date => {
    if (date === '') return true;

    if (!patternFirstDateType.test(date) && !patternSecondDateType.test(date))
      return false;

    const now = new Date();
    const nowDay = now.getDate();
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();

    let parts, day, month, year;
    if(patternFirstDateType.test(date)){
      parts = date.split("/");
      day = parseInt(parts[1], 10);
      month = parseInt(parts[0], 10);
      year = parseInt(parts[2], 10);
    }

    if(patternSecondDateType.test(date)){
      parts = date.split("-");
      day = parseInt(parts[2], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[0], 10);
    }

    const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
      monthLength[1] = 29;

    return year >= nowYear
        && year < 3000
        && month >= 0
        && month < 12
        && day > 0
        && day <= monthLength[month - 1]
        && (year === nowYear ? month >= nowMonth : true)
        && (year === nowYear && month === nowMonth ? date >= nowDay : true);
  }

  const licenseNumberValidation = license =>
      license === '' ? true : patternLicense.test(license);


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
    console.log(rows)
    setData(rows);
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
            <p>Error</p> :
            <DataTable
                headers={headers}
                data={data}
            />
        }
      </div>
  );
}

export default App;
