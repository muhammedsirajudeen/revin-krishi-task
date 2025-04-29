import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const ToastStyles = {
  success: {
    style: {
      backgroundColor: "#059669",
      text: "white"
    }
  },
  error: {
    style: {
      backgroundColor: "red",
      text: "white"
    }
  },
  info: {
    style: {
      backgroundColor: "blue",
      text: "white"
    }
  },
  warn: {
    style: {
      backgroundColor: "orange",
      text: "white"
    }
  }
} as const

export const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return await response.json();
};




type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T & string}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeCaseToCamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: T[K] extends object
  ? SnakeCaseToCamelCase<T[K]>
  : T[K];
};


type CamelToSnakeCase<S extends string> =
  S extends `${infer C}${infer T}`
  ? C extends Uppercase<C>
  ? T extends Uppercase<T>
  // For consecutive uppercase letters (like "NA" in "sizeInAcres")
  // we don't want to add an underscore between them
  ? `${Lowercase<C>}${CamelToSnakeCase<T>}`
  // For transition from uppercase to lowercase (like "A" to "c" in "InAcres")
  // we add an underscore
  : `_${Lowercase<C>}${CamelToSnakeCase<T>}`
  // For lowercase letters, just keep them as is
  : `${C}${CamelToSnakeCase<T>}`
  : S;

// Special case for the first character which should not have a leading underscore
type CamelToSnakeCaseWithFirstChar<S extends string> =
  S extends `${infer C}${infer T}`
  ? `${Lowercase<C>}${CamelToSnakeCase<T>}`
  : S;

// Applying the transformation to all keys in an object
export type CamelCaseToSnakeCase<T> = T extends object
  ? {
    [K in keyof T as CamelToSnakeCaseWithFirstChar<string & K>]: T[K] extends Array<infer U>
    ? CamelCaseToSnakeCase<U>[] // Handle arrays
    : CamelCaseToSnakeCase<T[K]>; // Handle objects
  }
  : T;