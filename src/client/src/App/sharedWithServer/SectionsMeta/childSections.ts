import {
  childrenSections,
  GeneralChildrenSections,
} from "./childSections/childrenSections";
import {
  childSection,
  GeneralChildSection,
} from "./childSections/childSection";
import { relOmniParentChildren } from "./childSections/omniParentChildren";
import { SectionName, sectionNames } from "./SectionName";

type Defaults = {
  [SN in SectionName]: {};
};
const defaults = sectionNames.reduce((defaults, sectionName) => {
  defaults[sectionName] = {};
  return defaults;
}, {} as Defaults);

type GenericChildSections = {
  [SN in SectionName]: GeneralChildrenSections;
};

function checkChildSections<CS extends GenericChildSections>(
  childSections: CS
) {
  return childSections;
}

export const childSections = checkChildSections({
  ...defaults,
  root: childrenSections({
    omniParent: ["omniParent"],
    main: ["main"],
  }),
  omniParent: relOmniParentChildren,

  // main is basically no longer required.
  main: childrenSections({ feUser: ["feUser"] }),
  displayNameList: childrenSections({
    displayNameItem: ["displayNameItem"],
  }),
  feUser: childrenSections({
    // feUser includes everything that has a corresponding child in dbStore
    // or that has any intermediary sections used to edit and add to them.
    activeDeal: ["deal"],
    authInfo: ["authInfo"],
    subscriptionInfo: ["subscriptionInfo"],
    userInfo: ["userInfo"],
    propertyMainTable: ["compareTable"],
    loanMainTable: ["compareTable"],
    mgmtMainTable: ["compareTable"],
    dealMainTable: ["compareTable"],
    dummyDisplayStore: ["dummyDisplayStore"],
    propertyMain: ["property"],
    loanMain: ["loan"],
    mgmtMain: ["mgmt"],
    dealMain: ["deal"],
    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  dbStore: childrenSections({
    authInfoPrivate: ["authInfoPrivate"],
    userInfo: ["userInfo"],

    userInfoPrivate: ["userInfoPrivate"],

    stripeInfoPrivate: ["stripeInfoPrivate"],
    stripeSubscription: ["stripeSubscription"],

    dummyMain: ["hasDummyDisplayStore"],

    propertyMain: ["property"],
    loanMain: ["loan"],
    mgmtMain: ["mgmt"],
    dealMain: ["deal"],

    propertyMainTable: ["compareTable"],
    loanMainTable: ["compareTable"],
    mgmtMainTable: ["compareTable"],
    dealMainTable: ["compareTable"],

    outputListMain: ["outputList"],
    userVarbListMain: ["userVarbList"],
    singleTimeListMain: ["singleTimeList"],
    ongoingListMain: ["ongoingList"],
  }),
  compareTable: childrenSections({
    column: ["column"],
    tableRow: ["tableRow"],
    compareRow: ["proxyStoreItem"],
  }),
  tableRow: { cell: childSection("cell") },
  outputList: { outputItem: childSection("outputItem") },
  singleTimeListGroup: { singleTimeList: childSection("singleTimeList") },
  ongoingListGroup: { ongoingList: childSection("ongoingList") },
  singleTimeList: { singleTimeItem: childSection("singleTimeItem") },
  ongoingList: {
    ongoingItem: childSection("ongoingItem", {
      isListItem: true,
    }),
  },
  userVarbList: { userVarbItem: childSection("userVarbItem") },
  userVarbItem: {
    conditionalRowList: childSection("conditionalRowList"),
  },
  conditionalRowList: { conditionalRow: childSection("conditionalRow") },
  deal: childrenSections({
    propertyGeneral: ["propertyGeneral"],
    financing: ["financing"],
    mgmtGeneral: ["mgmtGeneral"],
    dealOutputList: ["outputList"],
  }),
  financing: { loan: childSection("loan") },
  loan: childrenSections({
    closingCostListGroup: ["singleTimeListGroup"],
    wrappedInLoanListGroup: ["singleTimeListGroup"],
    customVarb: ["customVarb"],
  }),
  propertyGeneral: { property: childSection("property") },
  property: childrenSections({
    upfrontCostListGroup: ["singleTimeListGroup"],
    upfrontRevenueListGroup: ["singleTimeListGroup"],
    ongoingCostListGroup: ["ongoingListGroup"],
    ongoingRevenueListGroup: ["ongoingListGroup"],
    unit: ["unit"],
    customVarb: ["customVarb"],
  }),
  mgmtGeneral: { mgmt: childSection("mgmt") },
  mgmt: childrenSections({
    upfrontCostListGroup: ["singleTimeListGroup"],
    ongoingCostListGroup: ["ongoingListGroup"],
    customVarb: ["customVarb"],
  }),
  dummyDisplayStore: childrenSections({
    displayNameList: ["displayNameList"],
    activeAsSaved: ["hasDummyDisplayStore"],
  }),
});

export const childPaths = {
  get feUser() {
    return ["main", "feUser"] as const;
  },
  get activeDeal() {
    return [...this.feUser, "activeDeal"] as const;
  },
  get userVarbItem() {
    return [...this.feUser, "userVarbListMain", "userVarbItem"] as const;
  },
  get ongoingListMain() {
    return [...this.feUser, "ongoingListMain"] as const;
  },
  get ongoingItemMain() {
    return [...this.ongoingListMain, "ongoingItem"] as const;
  },
  get singleTimeListMain() {
    return [...this.feUser, "singleTimeListMain"] as const;
  },
  get singleTimeItemMain() {
    return [...this.singleTimeListMain, "singleTimeItem"] as const;
  },
} as const;

export type ChildSections = typeof childSections;
export type SectionChildProps<PN extends keyof GeneralChildSection> = {
  [SN in keyof ChildSections]: {
    [CN in keyof ChildSections[SN]]: ChildSections[SN][CN][PN &
      keyof ChildSections[SN][CN]];
  };
};
