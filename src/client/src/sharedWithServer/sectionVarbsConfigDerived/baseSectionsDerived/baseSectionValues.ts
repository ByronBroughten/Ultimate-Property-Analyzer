import { allBaseSectionVarbs } from "../../stateSchemas/allBaseSectionVarbs";
import { SectionName } from "../../stateSchemas/SectionName";
import { VarbValue } from "../../stateSchemas/StateValue";
import { valueMetas } from "../../stateSchemas/valueMetas";
import { ValueName } from "../../stateSchemas/ValueName";
import { SubType } from "../../utils/types";
import { BaseSectionVarbs, VarbName } from "./baseSectionsVarbsTypes";

export function validateSectionVarbValue<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN, value: any): VarbValue<SN, VN> {
  const valueName = sectionVarbValueName(sectionName, varbName);
  return valueMetas[valueName].validate(value) as VarbValue<SN, VN>;
}

export function sectionVarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
>(sectionName: SN, varbName: VN): VarbValueName<SN, VN> {
  const baseVarbs = allBaseSectionVarbs[sectionName][varbName];
  return baseVarbs[
    "valueName" as "valueName" & keyof typeof baseVarbs
  ] as VarbValueName<SN, VN>;
}

export type VarbValueName<
  SN extends SectionName,
  VN extends VarbName<SN>
> = Extract<
  ValueName,
  BaseSectionVarbs<SN>[VN][keyof BaseSectionVarbs<SN>[VN] & "valueName"]
>;

type SectionVarbToValueName<SN extends SectionName> = {
  [VN in VarbName<SN>]: VarbValueName<SN, VN>;
};

export type VarbNameByValueName<
  SN extends SectionName,
  VLN extends ValueName
> = keyof SubType<SectionVarbToValueName<SN>, VLN>;
