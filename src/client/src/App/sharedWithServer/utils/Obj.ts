import { isEqual, pick } from "lodash";
import { entryKeysWithPropOfType } from "./Obj/entryKeysWithProp";
import { merge, spread } from "./Obj/merge";
import {
  forSureEntries,
  NextObjEntries,
  ObjectKeys,
  ObjectValues,
} from "./Obj/typedObject";
import { StrictPick, SubType } from "./types";

export const isObjNotArr = (value: any): value is { [key: string]: any } => {
  return !!(value && !Array.isArray(value) && typeof value === "object");
};

export const getFirstVal = (obj: object) => {
  return Object.values(obj)[0];
};
export const getFirstKey = (obj: object) => {
  return Object.keys(obj)[0];
};
export const findEntryByValue = (obj: object, value: any) => {
  return Object.entries(obj).filter(
    (pair: [string, string]) => pair[1] === value
  )[0];
};

export const queryWithDotString = (obj: any, dotString: string) => {
  return dotString.split(".").reduce((o: any, i) => o[i], obj);
};

export function extend<A extends object = {}, B extends object = {}>(
  a?: A,
  b?: B
): A & B {
  return { ...a, ...b } as A & B;
}

type UpdateObjProps<O, K extends keyof O> = {
  obj: O;
  key: K;
  val: O[K];
};

export const Obj = {
  updateIfPropExists<O, K extends keyof O>({
    obj,
    key,
    val,
  }: UpdateObjProps<O, K>): O {
    if (key in obj) {
      obj[key] = val;
      return obj;
    } else throw new Error(`Prop "${key}" is not in the passed object.`);
  },
  isAnyIfIsObj(value: any): value is any {
    if (value && typeof value === "object") return true;
    else return false;
  },
  strictPick<O extends object, KS extends keyof O>(
    obj: O,
    keys: KS[]
  ): StrictPick<O, KS> {
    return pick(obj, keys);
  },
  noGuardIs: (value: any) =>
    typeof value === "object" && value !== null && !Array.isArray(value),
  keys: ObjectKeys,
  values: ObjectValues,
  entries: NextObjEntries,
  entriesFull: NextObjEntries,
  forSureEntries,
  filterKeysForEntryShape<O extends object, M extends any>(
    obj: O,
    model: M
  ): (keyof SubType<O, M>)[] {
    return ObjectKeys(obj).filter((prop) => {
      return isEqual(obj[prop], model);
    }) as (keyof SubType<O, M>)[];
  },
  toNestedPropertyObj<
    O extends {
      [key: string]: {
        [key: string]: any;
      };
    },
    P extends keyof Required<O>[keyof Required<O>]
  >(obj: O, propName: P) {
    return ObjectKeys(obj).reduce((propObj, key) => {
      propObj[key] = obj[key][propName] as O[typeof key][P];
      return propObj;
    }, {} as { [Prop in keyof O]: O[Prop][P] });
  },
  entryKeysWithProp<
    O extends object,
    P extends string,
    R extends (keyof SubType<O, { [Prop in P]: any }>)[]
  >(obj: O, propName: P): R {
    return this.keys(obj).filter((key) => propName in obj[key]) as R;
  },
  entryKeysWithPropValue<
    O extends { [key: string]: any },
    P extends string,
    V extends any
  >(obj: O, propName: P, value: V): (keyof SubType<O, { [Prop in P]: V }>)[] {
    return this.keys(obj).filter(
      (key) => propName in obj[key] && obj[key][propName] === value
    ) as (keyof SubType<O, { [Prop in P]: V }>)[];
  },
  entryKeysWithPropOfType,
  spread: spread,
  merge: merge,
} as const;
