export const patternFileExtension = /\.csv+$/i;
export const patternLinesSeparator = /\r\n|\n/;
export const patternRowSeparator = /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/;
export const patternFullName = /^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$/;
export const patternPhone = /^(?:\+1|1)?[0-9]{10}$/;