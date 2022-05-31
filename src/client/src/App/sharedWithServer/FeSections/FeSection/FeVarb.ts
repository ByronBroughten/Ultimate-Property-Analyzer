import { cloneDeep, isEqual } from "lodash";
import { sectionMetas } from "../../SectionsMeta";
import { valueMeta } from "../../SectionsMeta/baseSections/baseValues";
import {
  InEntities,
  InEntity,
} from "../../SectionsMeta/baseSections/baseValues/entities";
import { NumObj } from "../../SectionsMeta/baseSections/baseValues/NumObj";
import { FeSectionInfo, InfoS, VarbInfo } from "../../SectionsMeta/Info";
import {
  FeNameInfo,
  FeVarbInfo,
  RelVarbInfo,
} from "../../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { DisplayName } from "../../SectionsMeta/relSections/rel/relVarbTypes";
import {
  DbValue,
  UpdateFnName,
  ValueTypes,
} from "../../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { cloneValue } from "../../SectionsMeta/VarbMeta";
import { Arr } from "../../utils/Arr";
import { StrictOmit } from "../../utils/types";
import {
  addInEntity,
  addOutEntity,
  findInEntity,
  OutEntity,
  removeInEntity,
  removeOutEntity,
  setInEntities,
} from "./FeVarb/entities";
import { StateValue } from "./FeVarb/feValue";
import { FeVarbCore, initStateVarb } from "./FeVarb/init";

export type InVarbInfo = InEntity | FeVarbInfo;

export type VariableCore = StrictOmit<
  FeVarbCore<SectionName<"hasVarb">>,
  "varbName" | "sectionName" | "feId"
>;

export type Adornments = {
  startAdornment: string;
  endAdornment: string;
};

export type FeVarbOptions = Partial<VariableCore>;

export type ValueTypesPlusAny = ValueTypes & { any: StateValue };
export const valueSchemasPlusAny = {
  ...valueMeta,
  any: { is: () => true },
} as const;

export type StateValueAnyKey = keyof ValueTypesPlusAny;
export default class FeVarb<
  SN extends SectionName<"hasVarb"> = SectionName<"hasVarb">
> {
  constructor(readonly core: FeVarbCore<SN>) {}
  get meta() {
    return sectionMetas.varb({ ...this.info }, "fe");
  }
  update(props: Partial<VariableCore>): FeVarb<SN> {
    return new FeVarb({
      ...this.core,
      ...props,
    });
  }
  updateValue(newValue: StateValue): FeVarb<SN> {
    return this.update({ value: newValue });
  }
  triggerEditorUpdate(): FeVarb<SN> {
    return this.update({
      manualUpdateEditorToggle: !this.manualUpdateEditorToggle,
    });
  }

  get fullName(): string {
    return FeVarb.feVarbInfoToVarbId(this.info);
  }
  get varbName(): string {
    return this.core.varbName;
  }
  get feId(): string {
    return this.core.feId;
  }
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get sectionInfo(): FeSectionInfo<SN> {
    return {
      feId: this.feId,
      sectionName: this.sectionName,
    };
  }
  get info(): VarbInfo<SN> {
    return {
      ...this.sectionInfo,
      varbName: this.varbName,
    };
  }
  get feMixedInfo(): FeVarbInfo<SN> {
    return {
      ...this.feInfo,
      varbName: this.varbName,
    };
  }
  get manualUpdateEditorToggle() {
    return this.core.manualUpdateEditorToggle;
  }
  is(valueType: StateValueAnyKey) {
    return valueSchemasPlusAny[valueType].is(this.core.value);
  }
  value<T extends StateValueAnyKey>(valueType?: T): ValueTypesPlusAny[T];
  value(valueType: StateValueAnyKey = "any") {
    // why do I return the numObj?

    if (
      valueType === "any" ||
      valueSchemasPlusAny[valueType].is(this.core.value)
    ) {
      return cloneValue(this.core.value);
    } else {
      throw new Error(`Value not of type ${valueType}`);
    }
  }
  get inEntities(): InEntities {
    const val = this.core.value;
    if (val instanceof NumObj) return cloneDeep(val.entities);
    else return [];
  }
  get outEntities(): OutEntity[] {
    return cloneDeep(this.core.outEntities);
  }

  get displayName(): DisplayName {
    return this.meta.displayName;
  }
  get displayValue(): string {
    const value = this.value();
    if (value instanceof NumObj) return `${value.number}`;
    else return `${value}`;
  }
  get feInfo(): FeNameInfo<SN> {
    return {
      sectionName: this.sectionName,
      id: this.feId,
      idType: "feId",
    };
  }
  get stringFeVarbInfo(): string {
    return FeVarb.feVarbInfoToVarbId(this.info);
  }
  get name(): string {
    return this.stringFeVarbInfo;
  }
  inputProps(valueType?: StateValueAnyKey) {
    return {
      id: this.name,
      name: this.name,
      value: this.value(valueType),
      label: this.displayName,
    };
  }
  get feVarbInfo(): FeVarbInfo {
    return {
      ...this.feInfo,
      varbName: this.varbName,
    } as FeVarbInfo;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<Adornments> = {}) {
    return `${startAdornment ?? this.meta.startAdornment}${this.displayValue}${
      endAdornment ?? this.meta.endAdornment
    }`;
  }
  get solvableText() {
    return this.value("numObj").solvableText;
  }
  updateInfos(switchInfo: FeVarbInfo | null) {
    return {
      updateFnName: this.updateFnName(switchInfo),
      inVarbInfos: this.updateFnName(switchInfo),
    };
  }
  updateFnName(switchInfo: null | FeVarbInfo): UpdateFnName {
    if (switchInfo === null) return this.meta.defaultUpdateFnName;
    const pack = Arr.findIn(this.meta.inSwitchUpdatePacks, (pack) => {
      return isEqual(pack.switchInfo, switchInfo);
    });
    if (pack) return pack.updateFnName;
    else
      throw new Error(
        `inSwitchUpdatePacks doesn't have a switchInfo like this: ${switchInfo}`
      );
  }
  inVarbInfos(switchInfo: FeVarbInfo | null): RelVarbInfo[] {
    if (switchInfo === null) return this.meta.defaultInUpdateFnInfos;
    const pack = Arr.findIn(this.meta.inSwitchUpdatePacks, (pack) => {
      return isEqual(pack.switchInfo, switchInfo);
    });
    if (pack) return pack.inUpdateInfos;
    else
      throw new Error(
        `inSwitchUpdatePacks doesn't have a switchInfo like this: ${switchInfo}`
      );
  }
  get outUpdatePacks() {
    return this.meta.outUpdatePacks;
  }
  getErrorMessage() {
    const { displayName } = this;
    const value = this.value();
    if (value instanceof NumObj && value.editorTextStatus === "empty") {
      return `The ${displayName} field is empty.`;
    } else {
      return `The ${displayName} field entry is invalid.`;
    }
  }
  getFailedInfo() {
    return { errorMessage: this.getErrorMessage() };
  }

  toDbValue(): DbValue {
    const value = this.value("any");
    if (value instanceof NumObj) {
      const dbValue = value.dbNumObj;
      return dbValue;
    } else return value;
  }

  static init = initStateVarb;
  static feVarbInfoToVarbId(info: VarbInfo): string {
    const { sectionName, varbName, feId } = info;
    return [sectionName, varbName, feId].join(".");
  }
  static varbIdToFeVarbInfo(fullName: string): VarbInfo {
    const [sectionName, varbName, feId] = fullName.split(".") as [
      SectionName,
      string,
      string
    ];
    const info = { sectionName, varbName, feId };
    if (InfoS.isFeVarbInfo(info)) return info;
    else throw new Error(`Was passed an invalid fullName: ${fullName}`);
  }

  // entities
  findInEntity = findInEntity;
  addInEntity = addInEntity;
  removeInEntity = removeInEntity;
  removeOutEntity = removeOutEntity;
  addOutEntity = addOutEntity;
  setInEntities = setInEntities;
}
