import { formatISO } from 'date-fns';

export const fixDateType = (obj: object) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];

      if (typeof value === 'object') {
        fixDateType(value);
      }

      if (value instanceof Date) {
        value = formatISO(new Date(value)) as unknown as string;
      }
    }
  }

  return obj;
};

/*
type ObjectType<T extends object> = {
  obj: T;
};

export const fixDateType = <T extends object>(obj: ObjectType<T>) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key];

      if (typeof value === 'object') {
        fixDateType(value);
      }

      if (value instanceof Date) {
        value = formatISO(new Date(value) as unknown as string);
      }
    }
  }

  return obj;
};





//import { formatISO } from 'date-fns';

type ObjectType<T extends object> = {
  obj: T[];
};

export function fixDateType<T extends object>({
  obj,
}: ObjectType<T>): ObjectType<T>[] {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      //const value = obj[key];

      if (typeof value === 'object') {
        fixDateType({ obj });
      }

      if (value instanceof Date) {
        //obj[key] = formatISO(new Date(value) as unknown as string);
      }
    }
  }

  return obj as ObjectType<T>[];
}
*/
