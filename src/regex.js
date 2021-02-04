export const patternFileExtension = /\.csv+$/i, patternLinesSeparator = /\r\n|\n/,
    patternRowSeparator = /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/, patternFullName = /^[a-z]{4,}(?: [a-z]+){0,2}$/i,
    patternPhone = /^(?:\+1|1)?[0-9]{10}$/,
    patternEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    patternLicense = /^[a-z0-9]{6}$/i, patternLicenseStates = /[a-z]{2,}(?:,)?/i,
    patternFirstDateType = /^\d{1,2}\/\d{1,2}\/\d{4}$/, patternSecondDateType = /^\d{4}-\d{1,2}-\d{1,2}$/;