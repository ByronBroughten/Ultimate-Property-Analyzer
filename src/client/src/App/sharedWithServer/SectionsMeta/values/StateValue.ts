import {
  VarbName,
  VarbValueName,
} from "../baseSectionsDerived/baseSectionsVarbsTypes";
import { SectionName } from "../SectionName";
import { InEntityValue } from "./StateValue/InEntityValue";
import { NumObj } from "./StateValue/NumObj";
import { StringObj } from "./StateValue/StringObj";
import { UnionValueNamesToTypes } from "./StateValue/unionValues";
import { VarbInfoValue } from "./StateValue/VarbInfoValue";
import { ValueName } from "./ValueName";

export type StateValue<VN extends ValueName = ValueName> =
  ValueNamesToTypes[VN];

interface ValueNamesToTypes extends UnionValueNamesToTypes {
  string: string;
  number: number;
  boolean: boolean;
  dateTime: number;
  stringArray: string[];
  stringObj: StringObj;
  numObj: NumObj;
  inEntityValue: InEntityValue;
  varbInfo: VarbInfoValue;
}
type Check<T extends Record<ValueName, any>> = T;
type _Test = Check<ValueNamesToTypes>;

type ValueTypesPlusAny = ValueNamesToTypes & { any: StateValue };
export type ValueNameOrAny = ValueName | "any";
export type StateValueOrAny<VN extends ValueNameOrAny> = ValueTypesPlusAny[VN];

export type SectionValues<SN extends SectionName> = {
  [VN in VarbName<SN>]: ValueNamesToTypes[VarbValueName<SN, VN>];
};

export type VarbValue<
  SN extends SectionName,
  VN extends VarbName<SN>
> = SectionValues<SN>[VN];
