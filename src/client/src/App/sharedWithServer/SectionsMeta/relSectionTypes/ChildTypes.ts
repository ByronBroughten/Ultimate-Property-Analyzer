import { RemoveNotStrings, StrictSubType, SubType } from "../../utils/types";
import { MergeUnionObj } from "../../utils/types/mergeUnionObj";
import { ContextName, SimpleSectionName } from "../baseSections";
import { FeInfoByType } from "../Info";
import {
  SavableSectionName,
  SavableSectionType,
} from "../relNameArrs/storeArrs";
import { RelSections } from "../relSections";
import { FeNameInfo } from "../relSections/rel/relVarbInfoTypes";
import { SectionNameType } from "../SectionName";

type ChildNameArr<
  CN extends ContextName,
  SN extends SimpleSectionName<CN>
> = RelSections[CN][SN]["childNames" & keyof RelSections[CN][SN]];

type SectionToChildrenOrNever<CN extends ContextName> = {
  [SN in SimpleSectionName]: ChildNameArr<CN, SN>[number &
    keyof ChildNameArr<CN, SN>];
};

type SectionToChildren<SC extends ContextName> = RemoveNotStrings<
  SectionToChildrenOrNever<SC>
>;
type SectionToChildArr<SC extends ContextName> = {
  [SN in keyof SectionToChildren<SC>]: [SectionToChildren<SC>[SN]];
};

export type SectionNameWithSameChildren<
  SN extends SimpleSectionName,
  FromCN extends ContextName,
  ToCN extends ContextName
> = ChildToSectionWithChildName<FromCN, ToCN, ChildName<SN>>;

export type SectionNameWithSameChildrenWide<
  SN extends SimpleSectionName,
  FromCN extends ContextName,
  ToCN extends ContextName
> = ChildToSectionWithChildWide<FromCN, ToCN, ChildName<SN>>;

export type FeToDbNameWithSameChildren<SN extends SimpleSectionName> =
  SectionNameWithSameChildren<SN, "fe", "db">;

export type FeToDbStoreNameWithSameChildren<
  SN extends SimpleSectionName,
  DT extends SavableSectionType = "all"
> = Extract<FeToDbNameWithSameChildren<SN>, SavableSectionName<DT>>;

export type DbToFeNameWithSameChildren<SN extends SimpleSectionName> =
  SectionNameWithSameChildren<SN, "db", "fe">;

type ChildToSectionWithChildName<
  FromCN extends ContextName,
  ToCN extends ContextName,
  CHN extends ChildName<SimpleSectionName, FromCN>
> = keyof StrictSubType<SectionToChildArr<ToCN>, [CHN]>;

type ChildToSectionWithChildWide<
  FromCN extends ContextName,
  ToCN extends ContextName,
  CHN extends ChildName<SimpleSectionName, FromCN>
> = keyof SubType<SectionToChildArr<ToCN>, [CHN]>;

const _testFeToDbNameWithSameChildren = (): void => {
  type TestName = FeToDbNameWithSameChildren<"property">;
  const _testName2: TestName = "property";
  // @ts-expect-error
  const _testName3: TestName = "mgmt";
};

export type ChildName<
  SN extends SimpleSectionName = SimpleSectionName,
  SC extends ContextName = "fe"
> = SectionToChildrenOrNever<SC>[SN];

export type DescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = ChildName<SN, CN> extends never
  ? never
  : ChildName<SN, CN> | DescendantName<ChildName<SN, CN>, CN>;

export type SelfOrDescendantName<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = SN | DescendantName<SN, CN>;

export type DescendantIds<
  SN extends SimpleSectionName,
  CN extends ContextName = "fe"
> = {
  [S in DescendantName<SN, CN>]: string[];
};

export type SelfAndDescendantIds<
  SN extends SimpleSectionName = SimpleSectionName
> = {
  [S in SelfOrDescendantName<SN, "fe">]: string[];
};

function _testDescendantName() {
  type SN = "propertyGeneral";
  type FeTest = DescendantName<SN, "fe">;
  const _test1: FeTest = "unit";
  // @ts-expect-error
  const _test3: FeTest = "loan";
}

export type GeneralChildIdArrs = {
  [key: string]: string[];
};

export type ChildIdArrsWide<SN extends SimpleSectionName> = {
  [CHN in ChildName<SN>]: string[];
};
type AllChildIdArrs = {
  [SN in SimpleSectionName]: ChildIdArrsWide<SN>;
};
export type ChildIdArrsNext<SN extends SimpleSectionName> = AllChildIdArrs[SN];
export type ChildIdArrsNarrow<SN extends SimpleSectionName> = MergeUnionObj<
  AllChildIdArrs[SN]
>;

export interface ChildFeInfo<SN extends SimpleSectionName> extends FeNameInfo {
  sectionName: ChildName<SN>;
}

export type FeChildInfo<SN extends SimpleSectionName> = {
  sectionName: ChildName<SN>;
  feId: string;
};

export interface NewChildInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  CN extends ChildName<SN> = ChildName<SN>
> extends NewSectionInfo<CN> {
  sectionName: CN;
}

export interface NewDescendantInfo<
  SN extends SimpleSectionName = SimpleSectionName,
  DN extends DescendantName<SN> = DescendantName<SN>
> extends NewSectionInfo<DN> {}

export interface NewSectionInfo<ST extends SectionNameType>
  extends FeInfoByType<ST> {
  idx?: number | undefined;
}

export type HasChildSectionName<SC extends ContextName> =
  keyof SectionToChildren<SC>;

export type ChildOrNull<
  SC extends ContextName,
  SN extends SimpleSectionName,
  CN extends SimpleSectionName
> = Extract<
  ChildNameArr<SC, SN>[number & keyof ChildNameArr<SC, SN>],
  CN
> extends never
  ? null
  : CN;
