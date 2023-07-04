import { z } from "zod";
import { ValidationError } from "../utils/Error";

export const sectionNames = [
  "root",
  "main",
  "sessionStore",
  "newDealMenu",
  "mainDealMenu",
  "editorControls",
  "variablesMenu",

  "sessionDeal",

  "feStore",

  "dbStore",
  "proxyStoreItem",
  "omniParent",
  "column",
  "cell",
  "conditionalRow",
  "onetimeValue",
  "onetimeList",
  "onetimeItem",
  "ongoingValue",
  "ongoingList",
  "ongoingItem",
  "outputList",
  "outputSection",

  "dealCompareMenu",
  "dealCompareCache",
  "dealCompareDealSelectMenu",

  "outputItem",
  "virtualVarb",

  "customVarb",
  "conditionalRowList",

  "numVarbList",
  "numVarbItem",

  "boolVarbList",
  "boolVarbItem",

  "calculatedVarbs",

  "deal",
  "dealSystem",

  "property",
  "repairValue",
  "costOverrunValue",
  "sellingCostValue",
  "utilityValue",
  "taxesValue",
  "homeInsValue",

  "comparedDeal",

  "maintenanceValue",
  "capExValue",
  "capExList",
  "capExItem",
  "unit",
  "miscOnetimeCost",
  "miscRevenueValue",
  "miscOngoingCost",
  "miscHoldingCost",

  "financing",
  "loan",

  "loanBaseValue",
  "loanBaseExtra",
  "purchaseLoanValue",
  "repairLoanValue",
  "arvLoanValue",

  "customLoanBase",

  "closingCostValue",

  "mgmt",
  "mgmtBasePayValue",
  "vacancyLossValue",

  "stripeSubscription",
  "stripeInfoPrivate",
  "userInfo",
  "userInfoPrivate",
  "authInfoPrivate",
] as const;

export function validateSectionName(value: any): SectionName {
  if (sectionNames.includes(value)) {
    return value;
  } else {
    throw new ValidationError(`value "${value}" is not a sectionName`);
  }
}

export type SectionName = (typeof sectionNames)[number];
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
