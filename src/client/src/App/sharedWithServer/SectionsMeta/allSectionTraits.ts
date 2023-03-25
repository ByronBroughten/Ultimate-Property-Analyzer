import { SectionName, sectionNames } from "./SectionName";
import {
  GeneralSectionTraits,
  GenericSectionTraits,
  SectionTraitName,
  sectionTraits,
  SectionTraits,
} from "./sectionsTraits/sectionTraits";

export type GeneralAllSectionTraits = {
  [SN in SectionName]: GeneralSectionTraits;
};

type GenericAllSectionTraits = {
  [SN in SectionName]: GenericSectionTraits<SN>;
};

type DefaultSectionTraits = {
  [SN in SectionName]: SectionTraits<SN>;
};

const defaultSectionTraits = sectionNames.reduce((defaultSt, sectionName) => {
  defaultSt[sectionName] = sectionTraits();
  return defaultSt;
}, {} as DefaultSectionTraits);

const checkAllSectionTraits = <AST extends GenericAllSectionTraits>(
  ast: AST
): AST => ast;

export type AllSectionTraits = typeof allSectionTraits;
export const allSectionTraits = checkAllSectionTraits({
  ...defaultSectionTraits,
  deal: sectionTraits({
    displayName: "Deal",
    defaultStoreName: "dealMain",
    feIndexStoreName: "dealMain",
    dbIndexStoreName: "dealMain",
  }),
  loan: sectionTraits({
    defaultStoreName: "loanMain",
    feIndexStoreName: "loanMain",
    dbIndexStoreName: "loanMain",
  }),
  property: sectionTraits({
    defaultStoreName: "propertyMain",
    feIndexStoreName: "propertyMain",
    dbIndexStoreName: "propertyMain",
  }),
  mgmt: sectionTraits({
    defaultStoreName: "mgmtMain",
    feIndexStoreName: "mgmtMain",
    dbIndexStoreName: "mgmtMain",
  }),
  capExList: sectionTraits({
    defaultStoreName: "capExListMain",
    varbListItem: "capExItem",
    feIndexStoreName: "capExListMain",
    dbIndexStoreName: "capExListMain",
  }),
  outputList: sectionTraits({
    varbListItem: "outputItem",
    defaultStoreName: "outputListMain",
    feIndexStoreName: "outputListMain",
    dbIndexStoreName: "outputListMain",
  }),
  singleTimeList: sectionTraits({
    defaultStoreName: "singleTimeListMain",
    varbListItem: "singleTimeItem",
    feIndexStoreName: "singleTimeListMain",
    dbIndexStoreName: "singleTimeListMain",
  }),
  ongoingList: sectionTraits({
    defaultStoreName: "ongoingListMain",
    varbListItem: "ongoingItem",
    feIndexStoreName: "ongoingListMain",
    dbIndexStoreName: "ongoingListMain",
  }),
  numVarbList: sectionTraits({
    defaultStoreName: "numVarbListMain",
    feIndexStoreName: "numVarbListMain",
    dbIndexStoreName: "numVarbListMain",
    varbListItem: "numVarbItem",
  }),
});

export type GetSectionTraits<SN extends SectionName> = AllSectionTraits[SN];
export function getSectionTraits<SN extends SectionName>(
  sectionName: SN
): GetSectionTraits<SN> {
  return allSectionTraits[sectionName];
}

export type SectionTrait<
  SN extends SectionName,
  TN extends SectionTraitName
> = AllSectionTraits[SN][TN];
export function sectionTrait<
  SN extends SectionName,
  TN extends SectionTraitName
>(sectionName: SN, traitName: TN): AllSectionTraits[SN][TN] {
  return allSectionTraits[sectionName][traitName];
}

export type SomeSectionTraits<
  SN extends SectionName,
  PN extends SectionTraitName
> = {
  [S in SN]: AllSectionTraits[S][PN];
};
export function getSomeSectionTraits<
  SN extends SectionName,
  TN extends SectionTraitName
>(sNames: SN[], traitName: TN) {
  return sNames.reduce((traits, sectionName) => {
    traits[sectionName] = sectionTrait(sectionName, traitName);
    return traits;
  }, {} as SomeSectionTraits<SN, TN>);
}
