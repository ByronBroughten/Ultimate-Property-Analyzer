import { omit } from "lodash";
import { Obj } from "../utils/Obj";
import {
  baseSection,
  baseSectionS,
  GeneralBaseSection,
} from "./baseSectionsUtils/baseSection";
import { baseVarbs, baseVarbsS } from "./baseSectionsUtils/baseVarbs";

// If I wanted to break everything up

// each subscription has priceIds
// each priceId has items

// the tricky part is that unlike for the other sections
//  the source of truth is the db, not the fe.

// serverOnlyUser is the source of truth.
// serverOnlyUser stores the subscriptionId, priceIds, and active status
// when loading, user gets more basic variables for displaying, etc.

//

// for each item, there is a parameter on the fe
// - The fe parameter can be hacked
// - not a big deal unless actual data storage is involved

// for some, there is also a parameter on the jwt

export const loanVarbsNotInFinancing = [
  "interestRatePercentMonthly",
  "interestRatePercentYearly",
  "loanTermMonths",
  "loanTermYears",
  "displayName",
  "piCalculationName",
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
  // maybe rename to compareTable and compareTableRow
  table: baseSection({ titleFilter: "string" } as const),
  tableRow: baseSection({
    displayName: "string",
    compareToggle: "boolean",
  }),
  column: baseSection({
    valueEntityInfo: "inEntityInfo",
  }),
  cell: baseSection({
    valueEntityInfo: "inEntityInfo",
    displayVarb: "string",
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
  singleTimeList: baseSection({
    ...baseVarbsS.savableSection,
    total: "numObj",
    defaultValueSwitch: "string",
  }),
  ongoingList: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbsS.ongoing("total"),
    defaultValueSwitch: "string",
    defaultOngoingSwitch: "string",
  }),
  userVarbList: baseSection({
    ...baseVarbsS.savableSection,
    defaultValueSwitch: "string",
  }),
  outputList: baseSection(baseVarbsS.savableSection),

  singleTimeItem: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    valueSwitch: "string",
    displayNameEditor: "string",
    numObjEditor: "numObj",
  }),

  // when "loadedVarb" is in effect, those editors will
  // update based on displayName + displayNameEnd, "virtualDisplayNameFull"

  // when "loadedVarb" is not in effect, that field is then editable
  // and I think "displayName" then updates based on it.

  ongoingItem: baseSection({
    ...baseVarbsS.virtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbs("string", ["valueSwitch", "displayNameEditor"] as const),
    ...baseVarbs("numObj", ["costToReplace", "numObjEditor"] as const),
    ...baseVarbsS.ongoing("value"),
    ...baseVarbsS.switch("lifespan", "monthsYears"),
  }),
  outputItem: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
  }),
  userVarbItem: baseSection({
    ...baseVarbsS.singleValueVirtualVarb,
    ...baseVarbsS.loadableVarb,
    ...baseVarbs("string", ["valueSwitch", "displayNameEditor"] as const),
    ...baseVarbs("numObj", ["numObjEditor"] as const),
  }),

  login: baseSection(baseVarbs("string", ["email", "password"] as const)),
  register: baseSection(
    baseVarbs("string", ["email", "password", "userName"] as const)
  ),
  property: baseSection({
    ...baseVarbsS.savableSection,
    ...baseVarbs("numObj", [
      "price",
      "sqft",
      "numUnits",
      "numBedrooms",
      "upfrontExpenses",
      "upfrontRevenue",
    ] as const),
    ...baseVarbsS.ongoing("taxes"),
    ...baseVarbsS.ongoing("homeIns"),
    ...baseVarbsS.ongoing("targetRent"),
    ...baseVarbsS.ongoing("expenses"),
    ...baseVarbsS.ongoing("miscRevenue"),
    ...baseVarbsS.ongoing("revenue"),
  }),
  unit: baseSection({
    one: "numObj",
    numBedrooms: "numObj",
    ...baseVarbsS.ongoing("targetRent"),
  }),
  get propertyGeneral() {
    return baseSection(
      omit(this.property.varbSchemas, Obj.keys(baseVarbsS.savableSection)),
      {
        hasGlobalVarbs: true,
      }
    );
  },
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
      hasGlobalVarbs: true,
    }
  ),
  mgmt: baseSection(baseVarbsS.mgmt),
  get mgmtGeneral() {
    return baseSection(omit(this.mgmt.varbSchemas, ["displayName"]), {
      hasGlobalVarbs: true,
    });
  },
  deal: baseSection(
    {
      ...baseVarbsS.savableSection,
      ...baseVarbs("numObj", [
        "upfrontExpensesBaseSum",
        "upfrontExpenses",
        "upfrontRevenue",
        "totalInvestment",
      ] as const),
      ...baseVarbsS.ongoing("expenses"),
      ...baseVarbsS.ongoing("revenue"),
      ...baseVarbsS.ongoing("cashFlow"),
      ...baseVarbsS.ongoing("roi"),
    },
    { hasGlobalVarbs: true }
  ),
  stripeInfo: baseSection({
    customerId: "string",
  } as const),
  stripeSubscription: baseSection({
    subId: "string",
    subStatus: "string",
    priceIds: "stringArray",
    currentPeriodEnd: "number",
  }),
  user: baseSection(baseVarbs("string", ["email", "userName"] as const)),
  subscriptionInfo: baseSection({
    plan: "string",
    planExp: "number",
  }),
  serverOnlyUser: baseSection(
    baseVarbs("string", ["encryptedPassword", "emailAsSubmitted"] as const)
  ),
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

const userPlans = ["basicPlan", "fullPlan"] as const;
export type UserPlan = typeof userPlans[number];
export function isUserPlan(value: any): value is UserPlan {
  return userPlans.includes(value);
}

const userOrGuestPlans = [...userPlans, "guestPlan"] as const;
export type UserOrGuestPlan = typeof userOrGuestPlans[number];

type FeSectionName = keyof BaseSections;
export type BaseSectionsGeneral = Record<FeSectionName, GeneralBaseSection>;

const _testBaseSections = <T extends BaseSectionsGeneral>(_: T): void =>
  undefined;
_testBaseSections(baseSections);
