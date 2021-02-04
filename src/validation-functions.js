import {
    patternEmail,
    patternFirstDateType,
    patternFullName, patternLicense,
    patternLicenseStates,
    patternPhone,
    patternSecondDateType
} from "./regex";
import {HEADERS, USA_STATES} from "./utils";

export const headersValidation = headers => {
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

export const fullNameValidation = fullName => patternFullName.test(fullName);

export const phoneValidation = phone => patternPhone.test(phone);

export const emailValidation = email => patternEmail.test(email);

export const ageValidation = age => age === '' ? true :
    age.length === 2
    && Number(age)
    && Number(age) >= 21;

export const experienceValidation = (experience, age = 21) => experience === '' ? true :
    experience.length === 2
    && Number(experience)
    && Number(experience) >= 0
    && Number(age ? age : 21) - Number(experience) >= 18;

export const incomeValidation = income => income === '' ? true :
    income.length <= 12
    && Number(income)
    && Number(income) >= 0
    && Number(income) <= 1000000;

export const hasChildrenValidation = hasChildren =>
    ['TRUE', 'FALSE'].some( value => value === hasChildren);

export const licenseStatesValidation = states => {
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

export const expirationDateValidation = date => {
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

export const licenseNumberValidation = license =>
    license === '' ? true : patternLicense.test(license);


const findDuplicate = ( row, key, obj, preparedRows, index, message ) => {
    if(row[key]) {
        if (obj.hasOwnProperty(row[key])){
            if (!preparedRows[obj[row[key]]]['Duplicate with'].includes(message))
                preparedRows[obj[row[key]]]['Duplicate with'] += ` [${row['ID']} - ${message}] `
        } else {
            if (row[key])
                obj[row[key]] = index;
        }
    }
}

export const duplicateValidation = rows => {
    const preparedRows = [...rows];

    const names = {};
    const phones = {};
    const emails = {};

    rows.forEach( (row, index) => {
        findDuplicate( row, "Full Name", names, preparedRows, index, 'Full Name' );
        findDuplicate( row, "Phone", phones, preparedRows, index, 'Phone' );
        findDuplicate( row, "Email", emails, preparedRows, index, 'Email' );
    })

    return preparedRows;
}