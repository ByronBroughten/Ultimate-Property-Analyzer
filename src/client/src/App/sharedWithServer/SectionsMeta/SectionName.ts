import { z } from "zod";

export const sectionNames = [
  "root",
  "main",
  "variablesMenu",
  "feUser",
  "dbStore",
  "proxyStoreItem",
  "omniParent",
  "compareTable",
  "tableRow",
  "column",
  "cell",
  "conditionalRow",
  "singleTimeValue",
  "singleTimeValueGroup",
  "singleTimeList",
  "singleTimeItem",
  "ongoingValueGroup",
  "ongoingValue",
  "ongoingList",
  "ongoingItem",
  "outputList",

  "compareSection",
  "compareOption",
  "compareValue",

  "outputItem",
  "virtualVarb",

  "customVarb",
  "userVarbItem",
  "conditionalRowList",
  "userVarbList",

  "calculatedVarbs",

  "deal",

  "propertyGeneral",
  "property",
  "repairValue",
  "utilityValue",

  "maintenanceValue",
  "capExValue",
  "capExList",
  "capExItem",
  "unit",

  "financing",
  "loan",
  "closingCostValue",

  "mgmtGeneral",
  "mgmt",

  "stripeSubscription",
  "stripeInfoPrivate",
  "userInfo",
  "userInfoPrivate",
  "authInfoPrivate",

  "dealPage",

  "userListEditor",
  "userVarbEditor",
  "latentSections",
] as const;

export type SectionName = typeof sectionNames[number];
export function isSectionName(value: any): value is SectionName {
  return sectionNames.includes(value);
}
export const zSectionName = z
  .string()
  .refine((str) => isSectionName(str), "Not a valid sectionName");

export const sectionNamesToNull = sectionNames.reduce((toNull, sectionName) => {
  toNull[sectionName] = null;
  return toNull;
}, {} as Record<SectionName, null>);
