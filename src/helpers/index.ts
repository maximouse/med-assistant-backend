const specialSymbols = /-|\.|\s/g;
const newLine = new RegExp('[\n]+', "g")
export const normalizePosition = (position: string) => position.replace(specialSymbols, '_');

export const newLinesToArray = (str) => str.replace(newLine, '-& ').split('-& ').filter(a => a.length)
export const newLinesToString = (str) => str.replace(newLine, ' ')