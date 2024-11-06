export const isIntValidator = (input:string):boolean =>{
  if (input.trim() === '') {
    return false;
  }
  return /^\d+$/.test(input.trim()) || /^-\d+$/.test(input.trim());
}
export const isFloatValidator = (input:string):boolean=>{
  if (input.trim() === '') {
    return false;
  }
  return /^-?\d+(\.\d+)?(e-?\d+)?$/.test(input.trim());
}