import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import {
  baseOptions,
  baseSection,
  baseSectionS,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import { baseVarbs, baseVarbsS } from "./baseSectionsUtils/baseVarbs";

export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "loanTermMonths",
  "loanTermYears",
  "title",
] as const;

export type BaseSections = typeof baseSections;
export const baseSections = {
  root: baseSectionS.container,
  main: baseSection({
    _typeUniformity: "string",
  } as const),
  feStore: baseSection({
    _typeUniformity: "string",
  } as const),
  dbStore: baseSection({
    _typeUniformity: "string",
  } as const),
  omniParent: baseSectionS.container,
  table: baseSection({ titleFilter: "string" } as const),

  tableRow: baseSection(baseVarbsS.tableRow),
  column: baseSection({
    varbInfo: "inEntityVarbInfo",
  }),
  cell: baseSection({
    varbInfo: "inEntityVarbInfo",
    value: "numObj",
  }),
  conditionalRow: baseSection({
    level: "number",
    type: "string",
    // if
    left: "numObj",
    operator: "string",
    rightList: "stringArray",
    rightValue: "numObj",
    // then
    then: "numObj",
  }),

  singleTimeItem: baseSection({
    ...baseVarbs("string", ["name", "valueSwitch"] as const),
    ...baseVarbs("numObj", ["value", "editorValue"] as const),
    ...baseVarbsS.entityInfo,
  }),
  // the important thing is "name" and "value"
  ongoingItem: baseSection({
    ...baseVarbs("string", ["name", "valueSwitch"] as const),
    ...baseVarbs("numObj", ["costToReplace", "editorValue"] as const),
    ...baseVarbsS.entityInfo,
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
  }),
  userVarbList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  userVarbItem: baseSection({
    // ok.

    // displayName is a variable.
    // if it is drawn upon from

    // this varb has a changable displayName
    // for the output to use this virtual varb's displayName
    // as its displayName
    // one of its varbs will need to update whenever
    // this name variable updates.

    // specifically, its displayName variable will need to update
    // whenever this one's does.
    // an inEntity will be needed then, if not on that varb's name value
    // then on that varb's varbInfo, which would then do an empty update
    // and prompt the displayName variable to update.

    // that means that some value that currently doesn't have inEntities needs
    // to have inEntities.
    // maybe all of them do.

    // 1. Make varbInfo have inEntities and do empty updates

    // 2 Make a new kind of string
    //   that has inEntities and use those for these virtualVarb values.
    //   It would have the varbInfo as a relVarb, and whenever the varbInfo
    //   changes, it removes current inEntities of entityId and adds new ones
    //   as needed for its virtual varb constituents, given it
    //   gets the varbInfo of a virtual varb.

    ...baseVarbs("string", [
      "name",
      "startAdornment",
      "endAdornment",
      "valueSwitch",
    ] as const),
    ...baseVarbs("numObj", ["editorValue", "value"] as const),
  }),
  outputList: baseSection({ title: "string" }, baseOptions.alwaysOneFromStart),
  singleTimeList: baseSection(baseVarbsS.singleTimeList),
  ongoingList: baseSection(baseVarbsS.ongoingList),
  login: baseSection(
    baseVarbs("string", ["email", "password"] as const),
    baseOptions.alwaysOneFromStart
  ),
  register: baseSection(
    baseVarbs("string", ["email", "password", "userName"] as const),
    baseOptions.alwaysOneFromStart
  ),
  property: baseSection(baseVarbsS.property),
  unit: baseSection({
    one: "numObj",
    numBedrooms: "numObj",
    ...baseVarbsS.ongoing("targetRent"),
  }),
  propertyGeneral: baseSection(
    omit(baseVarbsS.property, Obj.keys(baseVarbsS.savableSection)),
    {
      ...baseOptions.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }
  ),
  loan: baseSection(baseVarbsS.loan),
  financing: baseSection(
    {
      ...omit(baseVarbsS.loan, loanVarbsNotInFinancing),
      ...baseVarbs("numObj", [
        "downPaymentDollars",
        "downPaymentPercent",
      ] as const),
      ...baseVarbsS.ongoing("piti"),
    },
    {
      ...baseOptions.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }
  ),

  mgmt: baseSection(baseVarbsS.mgmt, { makeOneOnStartup: true }),
  mgmtGeneral: baseSection(omit(baseVarbsS.mgmt, ["title"]), {
    ...baseOptions.alwaysOneFromStart,
    hasGlobalVarbs: true,
  }),
  deal: baseSection(
    {
      ...baseVarbsS.savableSection,
      ...baseVarbs("numObj", [
        "upfrontExpensesSum",
        "upfrontExpenses",
        "upfrontRevenue",
        "totalInvestment",
      ] as const),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.ongoing("revenue"),
      ...baseVarbsS.ongoing("cashFlow"),
      ...baseVarbsS.ongoing("roi"),
    },
    {
      ...baseOptions.alwaysOneFromStart,
      hasGlobalVarbs: true,
    }
  ),
  output: baseSection({
    value: "numObj",
    displayName: "string",
    displayNameEnd: "string",
    varbInfo: "inEntityVarbInfo",
    entityId: "string",
  }),

  user: baseSection(baseVarbsS.feUser, {
    ...baseOptions.alwaysOneFromStart,
  }),
  serverOnlyUser: baseSection({
    ...baseVarbs("string", ["encryptedPassword", "emailAsSubmitted"] as const),
  }),
} as const;

export const simpleSectionNames = Obj.keys(baseSections);
export type SimpleSectionName = typeof simpleSectionNames[number];
export function isSectionName(value: any): value is SimpleSectionName {
  return simpleSectionNames.includes(value);
}

export const allNull = simpleSectionNames.reduce((allNull, sectionName) => {
  allNull[sectionName] = null;
  return allNull;
}, {} as Record<SimpleSectionName, null>);

export type ApiAccessStatus = "readonly" | "basicStorage" | "fullStorage";

type FeSectionName = keyof BaseSections;
export type BaseSectionsGeneral = Record<FeSectionName, GeneralBaseSection>;

const _testBaseSections = <T extends BaseSectionsGeneral>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
