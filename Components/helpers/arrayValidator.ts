export function removeEmptyElements(arr:any[]) {
    return arr.filter(element => element.trim() !== '');
  }