// Based on
// https://thomasderleth.de/keeping-react-state-and-local-storage-in-sync/
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

export function usePersistedState<T>(
  defaultValue: T,
  key: string
): PersistedState<T> {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const value = window.localStorage.getItem(key);
    if (value) {
      setValue(JSON.parse(value));
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
