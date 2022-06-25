import { cloneDeep } from "lodash";
import {
  InEntity,
  InEntityVarbInfo,
  OutEntity,
} from "../SectionsMeta/baseSections/baseValues/entities";
import { NumberOrQ } from "../SectionsMeta/baseSections/baseValues/NumObj";
import {
  Adornments,
  StateValueAnyKey,
  valueSchemasPlusAny,
  ValueTypesPlusAny,
} from "../SectionsMeta/baseSections/StateVarbTypes";
import { InfoS, VarbInfo } from "../SectionsMeta/Info";
import {
  FeVarbInfo,
  LocalRelVarbInfo,
  MultiVarbInfo,
  VarbNames,
} from "../SectionsMeta/relSections/rel/relVarbInfoTypes";
import { UniqueIdMixedVarbInfo } from "../SectionsMeta/relSections/rel/uniqueIdInfo";
import { ValueTypeName } from "../SectionsMeta/relSections/rel/valueMetaTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { InUpdatePack, VarbMeta } from "../SectionsMeta/VarbMeta";
import { RawFeVarb } from "../StateSections/StateSectionsTypes";
import { mathS, NotANumberError } from "../utils/math";
import { GetterVarbBase } from "./Bases/GetterVarbBase";
import { GetterSection } from "./GetterSection";
import { GetterSections } from "./GetterSections";
import { GetterVarbNumObj } from "./GetterVarbNumObj";
import { GetterVarbs } from "./GetterVarbs";

class ValueTypeError extends Error {}

export class GetterVarb<
  SN extends SectionName<"hasVarb">
> extends GetterVarbBase<SN> {
  private getterVarbs = new GetterVarbs(this.getterSectionProps);
  get numObj() {
    return new GetterVarbNumObj(this.getterVarbProps);
  }
  get getterSection() {
    return new GetterSection(this.getterSectionProps);
  }
  get section() {
    return this.getterSection;
  }
  get sections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get meta(): VarbMeta {
    return this.sectionMeta.varbMetas.get(this.varbName);
  }
  get feVarbInfo(): VarbInfo<SN> {
    return {
      ...this.feSectionInfo,
      varbName: this.varbName,
    };
  }
  get outEntities(): OutEntity[] {
    return this.raw.outEntities;
  }
  get inEntities(): InEntity[] {
    const val = this.value("any");
    if (typeof val === "object" && "entities" in val) {
      return cloneDeep(val.entities);
    } else return [];
  }
  get numberValue(): number {
    const val = this.value("any");
    if (typeof val === "object" && "solvableText" in val) {
      const numString = this.numObj.solveTextToNumStringNext();
      return mathS.parseFloatStrict(numString);
    } else {
      return mathS.parseFloatStrict(`${this.value("any")}`);
    }
  }
  get numberOrZero(): number {
    try {
      return this.numberValue;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return 0;
      } else {
        throw ex;
      }
    }
  }
  get numberOrQuestionMark(): NumberOrQ {
    try {
      return this.numberValue;
    } catch (ex) {
      if (ex instanceof NotANumberError) {
        return "?";
      } else {
        throw ex;
      }
    }
  }

  get feVarbInfoMixed(): FeVarbInfo<SN> {
    return InfoS.feToMixedVarb(this.feVarbInfo);
  }
  get raw(): RawFeVarb<SN> {
    return this.sectionsShare.sections.rawVarb({
      ...this.feVarbInfo,
    });
  }
  uniqueIdVarbInfoMixed<T extends "feId" | "dbId">(
    idType: T
  ): UniqueIdMixedVarbInfo<T, SN> {
    return {
      ...this.getterSection.uniqueIdInfoMixed(idType),
      varbName: this.varbName,
    };
  }
  get dbId() {
    return this.getterSection.dbId;
  }
  get varbId() {
    return GetterVarb.feVarbInfoToVarbId(this.feVarbInfo);
  }
  hasValueType<VT extends ValueTypeName>(valueType: VT): boolean {
    try {
      this.value(valueType);
      return true;
    } catch (ex) {
      if (ex instanceof ValueTypeError) return false;
      else throw ex;
    }
  }
  value<VT extends ValueTypeName | "any" = "any">(
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    const { value } = this.raw;
    if (valueSchemasPlusAny[valueType ?? "any"].is(value))
      return cloneDeep(value) as ValueTypesPlusAny[VT];
    throw new ValueTypeError(`Value not of type ${valueType}`);
  }

  get displayName(): string {
    const { displayName } = this.meta;
    if (typeof displayName === "string") return displayName;
    const displayNameVarb = this.getterVarbs.varbByFocalMixed(displayName);
    return displayNameVarb.value("string");
  }
  get displayValue(): string {
    if (this.hasValueType("numObj")) {
      return `${this.numberOrQuestionMark}`;
    } else return `${this.value()}`;
  }
  displayVarb({ startAdornment, endAdornment }: Partial<Adornments> = {}) {
    return `${startAdornment ?? this.meta.startAdornment}${this.displayValue}${
      endAdornment ?? this.meta.endAdornment
    }`;
  }
  localVarb(varbName: string) {
    return this.getterVarbs.one(varbName);
  }
  localValue<VT extends ValueTypeName>(
    varbName: string,
    valueType?: VT
  ): ValueTypesPlusAny[VT] {
    return this.localVarb(varbName).value(valueType);
  }
  get updateFnName() {
    return this.inUpdatePack.updateFnName;
  }
  get updateFnProps() {
    return this.inUpdatePack.updateFnProps;
  }
  entityText(entityId: string) {
    const inEntity = this.inEntities.find(
      (entity) => entity.entityId === entityId
    );
    if (!inEntity)
      throw new Error(
        `inEntity with entityId ${entityId} not found at ${this.sectionName}.${this.varbName}`
      );

    const { editorText } = this.value("numObj");
    const { length, offset } = inEntity;
    return editorText.substring(offset, offset + length);
  }
  get inUpdatePack(): InUpdatePack {
    const {
      inSwitchUpdatePacks,
      defaultUpdateFnName,
      defaultInUpdateFnInfos,
      defaultUpdateFnProps,
    } = this.meta;
    for (const pack of inSwitchUpdatePacks) {
      const {
        switchInfo,
        switchValue,
        updateFnName,
        inUpdateInfos,
        updateFnProps,
      } = pack;
      if (this.switchIsActive(switchInfo, switchValue))
        return { updateFnName, updateFnProps, inUpdateInfos: inUpdateInfos };
    }
    return {
      updateFnName: defaultUpdateFnName,
      updateFnProps: defaultUpdateFnProps,
      inUpdateInfos: defaultInUpdateFnInfos,
    };
  }
  switchIsActive(
    relSwitchInfo: LocalRelVarbInfo,
    switchValue: string
  ): boolean {
    const actualSwitchValue = this.getterVarbs
      .varbByFocalMixed(relSwitchInfo)
      .value("string");
    return switchValue === actualSwitchValue;
  }
  getterVarb<S extends SectionName>(varbInfo: VarbInfo<S>): GetterVarb<S> {
    return new GetterVarb({
      ...varbInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  varbsByFocalMixed<S extends SectionName>(
    multiVarbInfo: MultiVarbInfo<S>
  ): GetterVarb<S>[] {
    return this.getterVarbs.varbsByFocalMixed(multiVarbInfo);
  }
  inputProps(valueType?: StateValueAnyKey) {
    return {
      id: this.varbName,
      name: this.varbName,
      value: this.value(valueType),
      label: this.displayName,
    };
  }
  nearestAnscestor<S extends SectionName>({
    sectionName,
    varbName,
  }: VarbNames<S>): GetterVarb<S> {
    const anscestor = this.getterSection.nearestAnscestor(sectionName);
    return anscestor.varb(varbName);
  }

  static mixedVarbInfoToMixedVarbId(info: InEntityVarbInfo): string {
    const { sectionName, idType, id, varbName } = info;
    return [sectionName, idType, id, varbName].join(".");
  }
  static feVarbInfoToVarbId(info: VarbInfo): string {
    const { sectionName, varbName, feId } = info;
    return [sectionName, varbName, feId].join(".");
  }
  static varbInfosToVarbIds(varbInfos: VarbInfo[]): string[] {
    return varbInfos.map((varbInfo) => {
      return GetterVarb.feVarbInfoToVarbId(varbInfo);
    });
  }
  static varbIdToVarbInfo(varbId: string): VarbInfo {
    const [sectionName, varbName, feId] = varbId.split(".") as [
      SectionName,
      string,
      string
    ];
    const info = { sectionName, varbName, feId };
    if (InfoS.isFeVarbInfo(info)) return info;
    else throw new Error(`Was passed an invalid varbId: ${varbId}`);
  }
}
