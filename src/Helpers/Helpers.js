export const getModifierValue = (value) => Math.floor((value - 10) / 2);
export const isNullOrEmpty = (value) => value === undefined || value === null || value.match(/^ *$/) !== null;