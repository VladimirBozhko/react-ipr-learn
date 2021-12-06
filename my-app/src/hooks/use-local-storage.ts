import React, {Dispatch, SetStateAction} from "react";
import {isIsoDate} from "../utils/validate-dates";

const dateReviver = (key: string, value: any) => {
  if (isIsoDate(value)) {
    return new Date(value);
  }

  return value;
}

export function useLocalStorage<T>(key: string): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item, dateReviver) : null;
  });

  React.useEffect(() => {
    const item = JSON.stringify(state);
    window.localStorage.setItem(key, item);
    return () => window.localStorage.removeItem(key);
  }, [key, state]);

  return [state, setState];
}