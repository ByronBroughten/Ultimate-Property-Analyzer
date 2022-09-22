import { VarbValues } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { SectionValues } from "../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { Id } from "../SectionsMeta/baseSectionsVarbs/id";
import {
  ChildArrInfo,
  ChildIdArrsNarrow,
  ChildName,
  CreateChildInfo,
  FeChildInfo,
} from "../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/childSectionsDerived/ChildSectionName";
import { DescendantSectionName } from "../SectionsMeta/childSectionsDerived/DescendantSectionName";
import { ParentNameSafe } from "../SectionsMeta/childSectionsDerived/ParentName";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { InitRawFeSectionProps } from "../StateSections/initRawSection";
import { StateSections } from "../StateSections/StateSections";
import { RawFeSection } from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { Obj } from "../utils/Obj";
import { StrictOmit } from "../utils/types";
import { GetterSections } from "./../StateGetters/GetterSections";
import { UpdaterSectionBase } from "./bases/updaterSectionBase";
import { UpdaterList } from "./UpdaterList";
import { UpdaterVarb } from "./UpdaterVarb";

type UpdateableRawFeSection<SN extends SectionNameByType> = StrictOmit<
  RawFeSection<SN>,
  "sectionName"
>;

export class UpdaterSection<
  SN extends SectionNameByType
> extends UpdaterSectionBase<SN> {
  private get parent(): UpdaterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.updaterSection(parentInfoSafe);
  }
  get updaterList(): UpdaterList<SN> {
    return new UpdaterList(this.getterSectionProps);
  }
  get getterSections(): GetterSections {
    return new GetterSections(this.getterSectionsProps);
  }
  varb(varbName: string): UpdaterVarb<SN> {
    return new UpdaterVarb({
      ...this.getterSectionProps,
      varbName,
    });
  }
  removeSelf(): void {
    this.removeAllChildren();
    const { parent } = this;
    const childName = parent.get.sectionChildName(this.feInfo);
    parent.removeChildFeId({
      childName,
      feId: this.feId,
    });
    this.updaterList.removeByFeId(this.feId);
  }
  removeAllChildren() {
    for (const childName of this.get.childNames) {
      this.removeChildren(childName);
    }
  }
  removeChildren(childName: ChildName<SN>): void {
    const childIds = this.get.childFeIds(childName);
    for (const feId of childIds) {
      this.removeChild({ childName, feId });
    }
  }
  removeChild(childInfo: FeChildInfo<SN>): void {
    this.child(childInfo).removeSelf();
  }
  child<CN extends ChildName<SN>>(
    childInfo: FeChildInfo<SN, CN>
  ): UpdaterSection<ChildSectionName<SN, CN>> {
    const feInfo = this.get.childInfoToFe(childInfo);
    return this.updaterSection(feInfo);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    { idx, ...rest }: AddChildOptions<SN, CN> = {}
  ): void {
    const sectionName = this.get.meta.childType(childName);
    const section = StateSections.initRawSection({
      sectionName,
      ...rest,
    } as InitRawFeSectionProps<any>);
    const childList = this.updaterList.updaterList(sectionName);
    if (idx === undefined) {
      childList.push(section);
    } else {
      childList.insert({ section, idx });
    }

    const { feId } = childList.get.last;
    this.addChildFeId({ childName, feId });
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): UpdaterSection<ChildSectionName<SN, CN>> {
    this.addChild(childName, options);
    const { feInfo } = this.get.youngestChild(childName);
    return this.updaterSection(feInfo);
  }
  updateValuesDirectly(values: VarbValues): void {
    for (const varbName of Obj.keys(values)) {
      const varb = this.varb(varbName as string);
      varb.updateValue(values[varbName]);
    }
  }
  resetVarbs(dbVarbs: Partial<SectionValues<SN>>): void {
    this.updateProps({
      varbs: StateSections.initRawVarbs({
        dbVarbs,
        ...this.feSectionInfo,
      }),
    });
  }
  private addChildFeId(childInfo: CreateChildInfo<SN>): void {
    const { childName, feId, idx } = childInfo;
    const feIds = this.get.childFeIds(childName);
    let nextIds: string[];
    if (typeof idx === "undefined") nextIds = [...feIds, feId];
    else nextIds = Arr.insert(feIds, feId, idx);
    this.updateChildFeIds({ childName, feIds: nextIds });
  }
  private removeChildFeId(childInfo: FeChildInfo<SN>): void {
    const { childName, feId } = childInfo;
    const feIds = this.get.childFeIds(childName);
    const nextIds = Arr.rmFirstMatchCloneOrThrow(feIds, feId);
    this.updateChildFeIds({ childName, feIds: nextIds });
  }
  newDbId(): void {
    this.updateDbId(Id.make());
  }
  updateDbId(dbId: string): void {
    this.updateProps({ dbId });
  }
  private updateProps(
    nextBaseProps: Partial<UpdateableRawFeSection<SN>>
  ): void {
    this.updaterList.replace({
      ...this.get.raw,
      ...nextBaseProps,
    });
  }
  updateChildFeIds({ childName, feIds }: ChildArrInfo<SN>): void {
    this.updateProps({
      childFeIds: {
        ...(this.get.allChildFeIds as any),
        [childName]: feIds,
      },
    });
  }
  static initMainProps(): GetterSectionProps<"main"> {
    const root = this.initRootUpdater();
    root.addChild("main");
    const main = root.get.youngestChild("main");
    return main.getterSectionProps;
  }
  static initRootProps(): GetterSectionProps<"root"> {
    const sections = StateSections.initWithRoot();
    const rootRaw = sections.onlyOneRawSection("root");
    return {
      ...rootRaw,
      sectionsShare: { sections },
    };
  }
  updaterSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): UpdaterSection<S> {
    return new UpdaterSection({
      ...feInfo,
      ...this.getterSectionsProps,
    });
  }
  static initOmniParentProps(): GetterSectionProps<"omniParent"> {
    const root = this.initRootUpdater();
    root.addChild("omniParent");
    const omniParent = root.get.youngestChild("omniParent");
    return omniParent.getterSectionProps;
  }
  static initRootUpdater(): UpdaterSection<"root"> {
    return new UpdaterSection(this.initRootProps());
  }
}

interface AddSectionProps<SN extends SectionName = SectionName>
  extends InitRawFeSectionProps<SN> {
  sectionName: SN;
  childFeIds?: ChildIdArrsNarrow<SN>;
  idx?: number;
}

export type DescendantList<
  SN extends SectionNameByType,
  DN extends DescendantSectionName<SN> = DescendantSectionName<SN>
> = readonly [...DescendantSectionName<SN>[], DN];

export interface AddChildOptions<
  SN extends SectionNameByType,
  CN extends ChildName<SN> = ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> extends StrictOmit<AddSectionProps<CT>, OmitProps> {}

export type AddDescendantOptions<
  SN extends SectionNameByType,
  DN extends DescendantSectionName<SN> = DescendantSectionName<SN>
> = StrictOmit<AddSectionProps<DN>, OmitProps>;

type OmitProps = "sectionName" | "childFeIds";
