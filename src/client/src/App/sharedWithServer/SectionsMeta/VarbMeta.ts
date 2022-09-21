import { cloneDeep, pick } from "lodash";
import { sectionsMeta } from "../SectionsMeta";
import { VarbNames } from "./baseSectionsDerived/baseVarbInfo";
import { valueMeta } from "./baseSectionsDerived/valueMeta";
import { UpdateFnName } from "./baseSectionsDerived/valueMetaTypes";
import {
  NumUnitName,
  numUnitParams,
} from "./baseSectionsVarbs/baseValues/calculations/numUnitParams";
import { ValueName } from "./baseSectionsVarbs/baseVarb";
import {
  RelInVarbInfo,
  RelOutVarbInfo,
} from "./childSectionsDerived/RelInOutVarbInfo";
import { relSections } from "./relSections";
import {
  DisplayName,
  RelVarb,
  SwitchUpdateInfo,
  UpdateFnProps,
  UpdateSwitchProp,
} from "./relSections/rel/relVarbTypes";
import { GeneralRelVarbs } from "./relSections/relVarbs";
import { SectionMeta } from "./SectionMeta";
import { SectionName } from "./SectionName";

type InBaseUpdatePack = {
  updateFnName: UpdateFnName;
  updateFnProps: UpdateFnProps;
  inUpdateInfos: RelInVarbInfo[];
};
type InDefaultUpdatePack = InBaseUpdatePack & {
  inverseSwitches: SwitchUpdateInfo[];
};
export function isDefaultInPack(
  pack: InUpdatePack
): pack is InDefaultUpdatePack {
  return "inverseSwitches" in pack;
}
export function isSwitchInPack(pack: InUpdatePack): pack is InSwitchUpdatePack {
  return "switchInfo" in pack;
}

type InSwitchUpdatePack = InBaseUpdatePack & SwitchUpdateInfo;
export type InUpdatePack = InBaseUpdatePack | InSwitchUpdatePack;

type OutBaseUpdatePack = { relTargetVarbInfo: RelOutVarbInfo };
export type OutSwitchPack = OutBaseUpdatePack & SwitchUpdateInfo;
export type OutDefaultPack = OutBaseUpdatePack & {
  inverseSwitches: SwitchUpdateInfo[];
};
export function isDefaultOutPack(pack: OutUpdatePack): pack is OutDefaultPack {
  return "inverseSwitches" in pack;
}
export function isSwitchOutPack(pack: OutUpdatePack): pack is OutSwitchPack {
  return "switchInfo" in pack;
}
export type OutUpdatePack = OutSwitchPack | OutDefaultPack;

function fnPropsToInVarbInfos(updateFnProps: UpdateFnProps): RelInVarbInfo[] {
  const infos = Object.values(updateFnProps);
  let nextInfos: RelInVarbInfo[] = [];
  for (const info of infos) {
    if (Array.isArray(info)) nextInfos = nextInfos.concat(info);
    else nextInfos.push(info);
  }
  return nextInfos;
}
function inSwitchPropsToInfos(
  inSwitchProps: UpdateSwitchProp[]
): InSwitchUpdatePack[] {
  const inSwitchInfos: InSwitchUpdatePack[] = [];
  for (const prop of inSwitchProps) {
    inSwitchInfos.push({
      ...prop,
      inUpdateInfos: fnPropsToInVarbInfos(prop.updateFnProps),
    });
  }
  return inSwitchInfos;
}

interface VarbMetaProps<SN extends SectionName> {
  varbName: string;
  sectionName: SN;
  inDefaultInfos: RelInVarbInfo[];
  InSwitchUpdatePacks: InSwitchUpdatePack[];
  outUpdatePacks: OutUpdatePack[];
}

export type VarbMetaCore<SN extends SectionName> = RelVarb & VarbMetaProps<SN>;
export class VarbMeta<SN extends SectionName> {
  constructor(readonly core: VarbMetaCore<SN>) {}
  validateVarbValue(value: any): true {
    if (this.isVarbValueType(value)) return true;
    else
      throw new Error(
        `value of "${value}" does not match the varb value type.`
      );
  }
  isVarbValueType(value: any): boolean {
    return this.value.is(value);
  }
  get sectionMeta(): SectionMeta<any> {
    return sectionsMeta.section(this.sectionName);
  }
  get value() {
    return valueMeta[this.valueName];
  }
  get raw() {
    return { ...this.core };
  }
  get fullName(): string {
    const { sectionName, varbName } = this.core;
    return `${sectionName}.${varbName}`;
  }
  get updateFnProps() {
    return cloneDeep(this.core.updateFnProps);
  }
  get startAdornment() {
    return this.core.startAdornment ?? "";
  }
  get endAdornment() {
    return this.core.endAdornment ?? "";
  }
  get displayName(): DisplayName {
    return this.core.displayName;
  }
  get displayNameStart(): string {
    return this.core.displayNameStart;
  }
  get displayNameEnd(): string {
    return this.core.displayNameEnd;
  }
  get displayNameFull(): string {
    return this.displayNameStart + this.displayName + this.displayNameEnd;
  }
  get initValue() {
    return cloneDeep(this.core.initValue);
  }
  get varbName(): string {
    return this.core.varbName;
  }
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get varbNameInfo(): VarbNames<SN> {
    return {
      sectionName: this.sectionName,
      varbName: this.varbName,
    };
  }
  get valueName(): ValueName {
    return this.core.type;
  }
  get defaultUpdateFnProps() {
    return this.core.updateFnProps;
  }
  get defaultUpdateFnName() {
    return this.core.updateFnName;
  }
  get defaultInUpdateFnInfos() {
    return this.core.inDefaultInfos;
  }
  get inSwitchUpdatePacks(): InSwitchUpdatePack[] {
    return cloneDeep(this.core.InSwitchUpdatePacks);
  }
  get outUpdatePacks(): OutUpdatePack[] {
    return cloneDeep(this.core.outUpdatePacks);
  }
  get inUpdatePacks(): InUpdatePack[] {
    return [...this.inSwitchUpdatePacks, this.inDefaultUpdatePack];
  }
  get calcRound(): number {
    return numUnitParams[this.unit].calcRound;
  }
  get displayRound(): number {
    return numUnitParams[this.unit].displayRound;
  }
  get unit(): NumUnitName {
    if ("unit" in this.core) return this.core.unit;
    else throw new Error(`Varb with name ${this.core.varbName} has no numUnit`);
  }
  get inDefaultUpdatePack(): InDefaultUpdatePack {
    return {
      updateFnProps: this.core.updateFnProps,
      updateFnName: this.core.updateFnName,
      inUpdateInfos: this.core.inDefaultInfos,
      inverseSwitches: this.inSwitchUpdatePacks.map((pack) =>
        pick(pack, ["switchInfo", "switchValue"])
      ),
    };
  }
  static isSwitchOutPack(pack: OutUpdatePack): pack is OutSwitchPack {
    return "switchInfo" in pack;
  }
  static isDefaultOutPack(pack: OutUpdatePack): pack is OutDefaultPack {
    return "inverseSwitches" in pack;
  }
  static isDefaultInPack(pack: InUpdatePack): pack is InDefaultUpdatePack {
    return "inverseSwitches" in pack;
  }
  static init<SN extends SectionName>({
    sectionName,
    varbName,
  }: VarbNames<SN>): VarbMeta<SN> {
    const relVarbs = relSections[sectionName].relVarbs as GeneralRelVarbs;
    const relVarb = relVarbs[varbName];
    return new VarbMeta({
      ...relVarb,
      sectionName,
      varbName,
      inDefaultInfos: fnPropsToInVarbInfos(relVarb.updateFnProps),
      InSwitchUpdatePacks: inSwitchPropsToInfos(relVarb.inUpdateSwitchProps),
      outUpdatePacks: [], // static after initialization
    });
  }
}
