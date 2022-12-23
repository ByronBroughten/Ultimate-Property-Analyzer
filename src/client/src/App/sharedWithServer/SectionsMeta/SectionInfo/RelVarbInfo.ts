import { VarbProp } from "../baseSectionsDerived/baseVarbInfo";
import { ExpectedCount } from "../baseSectionsVarbs/NanoIdInfo";
import { ChildName } from "../sectionChildrenDerived/ChildName";
import {
  ParentName,
  PiblingName,
  StepSiblingName,
} from "../sectionChildrenDerived/ParentName";
import { SectionName } from "../SectionName";
import {
  RelChildrenInfo,
  RelInfoType,
  RelLocalInfo,
  RelNiblingOfChildInfo,
  RelParentInfo,
  RelPiblingInfo,
  RelStepSiblingInfo,
  RelStepSiblingOfChildInfo,
} from "./RelInfo";

export type RelVarbInfo =
  | RelChildrenVarbInfo
  | RelParentVarbInfo
  | RelLocalVarbInfo
  | RelStepSiblingVarbInfo
  | RelPiblingVarbInfo
  | RelStepSiblingOfChildVarbInfo
  | RelNiblingOfChildVarbInfo;

type RelVarbInfoTest<T extends RelInfoType> = T;
type _TestRelSectionInfo = RelVarbInfoTest<RelVarbInfo["infoType"]>;

export interface RelLocalVarbInfo extends RelLocalInfo, VarbProp {}
export interface RelParentVarbInfo<
  SN extends SectionName = SectionName,
  PN extends ParentName<SN> = ParentName<SN>
> extends RelParentInfo<SN, PN>,
    VarbProp {}

export interface RelChildrenVarbInfo<
  SN extends SectionName = SectionName,
  CN extends ChildName<SN> = ChildName<SN>,
  OO extends ExpectedCount = ExpectedCount
> extends RelChildrenInfo<SN, CN, OO>,
    VarbProp {}

export interface RelStepSiblingVarbInfo<
  SN extends SectionName = SectionName,
  SSN extends StepSiblingName<SN> = StepSiblingName<SN>,
  SSSN extends SectionName = SectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelStepSiblingInfo<SN, SSN, SSSN, OO>,
    VarbProp {}
export interface RelPiblingVarbInfo<
  SN extends SectionName = SectionName,
  PN extends PiblingName<SN> = PiblingName<SN>,
  PSN extends SectionName = SectionName,
  OO extends ExpectedCount = ExpectedCount
> extends RelPiblingInfo<SN, PN, PSN, OO>,
    VarbProp {}

export interface RelStepSiblingOfChildVarbInfo<
  SSSN extends SectionName = SectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelStepSiblingOfChildInfo<SSSN, CN, OO> {
  varbName: string;
}
export interface RelNiblingOfChildVarbInfo<
  NSN extends SectionName = SectionName,
  CN extends ChildName = ChildName,
  OO extends ExpectedCount = ExpectedCount
> extends RelNiblingOfChildInfo<NSN, CN, OO> {
  varbName: string;
}

type FullOptions = { expectedCount: ExpectedCount };
export type Options = Partial<FullOptions>;
function makeDefaultOptions<O extends FullOptions>(defaults: O): O {
  return defaults;
}
const defaultOptions = makeDefaultOptions({ expectedCount: "multiple" });
type Defaults = typeof defaultOptions;

export const relVarbInfoS = {
  local(varbName: string): RelLocalVarbInfo {
    return {
      infoType: "local",
      varbName,
      expectedCount: "onlyOne",
    };
  },
  children<
    SN extends SectionName,
    CN extends ChildName<SN>,
    O extends FullOptions = Defaults
  >(
    childName: CN,
    varbName: string,
    options?: O
  ): RelChildrenVarbInfo<SN, CN, O["expectedCount"]> {
    return {
      infoType: "children",
      childName,
      varbName,
      ...defaultOptions,
      ...options,
    };
  },
  stepSibling<
    SN extends SectionName,
    SSN extends StepSiblingName<SN>,
    SSSN extends SectionName,
    O extends FullOptions = Defaults
  >(
    stepSiblingName: SSN,
    stepSiblingSectionName: SSSN,
    varbName: string,
    options?: O
  ): RelStepSiblingVarbInfo<SN, SSN, SSSN, O["expectedCount"]> {
    return {
      infoType: "stepSibling",
      stepSiblingName,
      stepSiblingSectionName,
      varbName,
      ...defaultOptions,
      ...options,
    };
  },
  pibling<
    SN extends SectionName,
    PN extends PiblingName<SN>,
    PSN extends SectionName,
    O extends FullOptions = Defaults
  >(
    piblingName: PN,
    piblingSectionName: PSN,
    varbName: string,
    options?: O
  ): RelPiblingVarbInfo<SN, PN, PSN, O["expectedCount"]> {
    return {
      infoType: "pibling",
      piblingName,
      piblingSectionName,
      varbName,
      ...defaultOptions,
      ...options,
    };
  },
};