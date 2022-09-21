import { baseSectionsVarbs } from "../baseSectionsVarbs";
import { StateValue } from "../baseSectionsVarbs/baseValues/StateValueTypes";
import { ValueName } from "../baseSectionsVarbs/baseVarb";
import { BaseVarbSchemas } from "../baseSectionsVarbs/baseVarbs";
import { SectionName } from "../SectionName";
import { BaseSectionVarbs, VarbNameNext } from "./baseSectionTypes";
import { VarbNamesNext } from "./baseVarbInfo";
import { valueMeta } from "./valueMeta";

export type ValueSchemas = typeof valueMeta;
export type ValueNamesToTypes = {
  [VN in ValueName]: ReturnType<ValueSchemas[VN]["initDefault"]>;
};

export type SectionValues<SN extends SectionName> = {
  [VN in VarbNameNext<SN>]: ValueNamesToTypes[BaseSectionVarbs<SN>[VN] &
    keyof ValueNamesToTypes];
};

export type VarbValue<
  SN extends SectionName,
  VN extends VarbNameNext<SN>
> = SectionValues<SN>[VN];
export function isVarbValue<
  SN extends SectionName,
  VN extends VarbNameNext<SN>
>(
  value: any,
  { sectionName, varbName }: VarbNamesNext<SN, VN>
): value is VarbValue<SN, VN> {
  const baseVarbs = baseSectionsVarbs[sectionName] as BaseVarbSchemas;
  const valueName = baseVarbs[varbName as string];
  return valueMeta[valueName].is(value);
}

export type SectionValuesReq = {
  [varbName: string]: ValueName;
};
export type SectionValuesRes<VNS extends SectionValuesReq> = {
  [VN in keyof VNS]: ValueNamesToTypes[VNS[VN]];
};

export type DbValue = StateValue;

export type UpdateFnName =
  ValueSchemas[keyof ValueSchemas]["updateFnNames"][number];
