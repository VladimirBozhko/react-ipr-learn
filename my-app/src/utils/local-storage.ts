import {isIsoDate} from "./validate-dates";

function dateReviver(key: string, value: any) {
  if (isIsoDate(value)) {
    return new Date(value);
  }
  return value;
}

export function getFromLocalStorage(key: string) {

  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item, dateReviver) : undefined;
}

export function saveToLocalStorage(key: string, obj: any) {
  const item = JSON.stringify(obj);
  window.localStorage.setItem(key, item);
}

export function removeFromLocalStorage(key: string) {
  window.localStorage.removeItem(key)
}