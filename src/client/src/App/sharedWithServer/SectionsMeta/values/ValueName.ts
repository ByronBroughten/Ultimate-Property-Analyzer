import { unionValueNames } from "./StateValue/unionValues";

export const valueNames = [
  "number",
  "dateTime",
  "boolean",
  "string",
  "stringArray",
  "stringObj",
  "numObj",
  "inEntityValue",
  "varbInfo",
  ...unionValueNames,
] as const;
export type ValueName = typeof valueNames[number];
