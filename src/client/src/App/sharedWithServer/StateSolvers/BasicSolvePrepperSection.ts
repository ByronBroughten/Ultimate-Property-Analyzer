import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import {
  ChildName,
  DbChildInfo,
} from "../SectionsMeta/sectionChildrenDerived/ChildName";
import { ChildSectionName } from "../SectionsMeta/sectionChildrenDerived/ChildSectionName";
import { ChildArrPack } from "../SectionsMeta/sectionChildrenDerived/ChildSectionPack";
import { ParentNameSafe } from "../SectionsMeta/sectionChildrenDerived/ParentName";
import { SectionPack } from "../SectionsMeta/sectionChildrenDerived/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../SectionsMeta/SectionName";
import { SectionValues } from "../SectionsMeta/values/StateValue";
import { GetterSection } from "../StateGetters/GetterSection";
import { ChildSectionPackArrs } from "../StatePackers/ChildPackProps";
import { AddChildWithPackOptions } from "../StatePackers/PackBuilderSection";
import { DefaultFamilyAdder } from "../StateUpdaters/DefaultFamilyAdder";
import { UpdaterSection } from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { SolverAdderPrepSections } from "./SolverAdderPrepSections";
import { SolverSectionBase } from "./SolverBases/SolverSectionBase";
import { SolverRemoverPrepSection } from "./SolverRemoverPrepSection";

export class BasicSolvePrepperSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  get get() {
    return new GetterSection(this.getterSectionProps);
  }
  private get defaultAdder() {
    return new DefaultFamilyAdder(this.getterSectionProps);
  }
  private get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  get removePrepper(): SolverRemoverPrepSection<SN> {
    return new SolverRemoverPrepSection(this.solverSectionProps);
  }
  adderPrepSection<S extends SectionName>(
    info: FeSectionInfo<S>
  ): BasicSolvePrepperSection<S> {
    return new BasicSolvePrepperSection({
      ...this.solverSectionsProps,
      ...info,
    });
  }
  get prepperSections(): SolverAdderPrepSections {
    return new SolverAdderPrepSections(this.solverSectionsProps);
  }
  get parent(): BasicSolvePrepperSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return this.adderPrepSection(parentInfoSafe);
  }
  youngestChild<CN extends ChildName<SN>>(
    childName: CN
  ): BasicSolvePrepperSection<ChildSectionName<SN, CN>> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.adderPrepSection(feInfo);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ) {
    this.defaultAdder.addChild(childName, options);
    this.finalizeNewChild(childName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildWithPackOptions<SN, CN>
  ) {
    this.addChild(childName, options);
    return this.youngestChild(childName);
  }
  loadChildren<CN extends ChildName<SN>>({
    childName,
    sectionPacks,
  }: ChildArrPack<SN, CN>): void {
    for (const sectionPack of sectionPacks) {
      this.addChild(childName, { sectionPack });
    }
  }
  loadChildArrs<CN extends ChildName<SN>>(
    packArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    for (const childName of Obj.keys(packArrs)) {
      this.loadChildren({
        childName,
        sectionPacks: packArrs[childName],
      });
    }
  }
  private finalizeNewChild<CN extends ChildName<SN>>(childName: CN) {
    const child = this.youngestChild(childName);
    child.finalizeAddedThis();
  }
  private finalizeAddedThis() {
    const { selfAndDescendantVarbIds } = this.get;
    this.addVarbIdsToSolveFor(...selfAndDescendantVarbIds);
    this.updateVariablesIfNeeded();
  }
  private updateVariablesIfNeeded() {
    const { sectionName, feId } = this.get;
    if (sectionName === "dealSystem") {
      this.prepperSections.applyVariablesToDealSystem(feId);
    }
  }
  loadSelfSectionPack(sectionPack: SectionPack<SN>): void {
    this.removePrepper.prepForRemoveSelf();
    this.defaultAdder.loadSelfSectionPack(sectionPack);
    this.finalizeAddedThis();
  }
  removeSelf(): void {
    this.removePrepper.removeSelf();
  }
  removeChildByDbId<CN extends ChildName<SN>>(dbInfo: DbChildInfo<SN, CN>) {
    const child = this.get.childByDbId(dbInfo);
    this.removePrepper.removeChild({
      childName: dbInfo.childName,
      feId: child.feId,
    });
  }

  resetToDefault(): void {
    const { feInfo, feId, idx, dbId } = this.get;
    const { parent } = this;
    const childName = parent.get.sectionChildName(feInfo);
    this.removePrepper.removeSelf();
    parent.addChild(childName, { feId, idx, dbId });
  }
  replaceChildPackArrs<CN extends ChildName<SN>>(
    childPackArrs: ChildSectionPackArrs<SN, CN>
  ): void {
    const childNames = Obj.keys(childPackArrs);
    this.removePrepper.removeChildArrs(childNames);
    this.loadChildArrs(childPackArrs);
  }
  updateValues(values: Partial<SectionValues<SN>>): void {
    this.updater.updateValues(values);
    const varbNames = Obj.keys(values) as VarbName<SN>[];
    const varbIds = varbNames.map((varbName) => this.get.varb(varbName).varbId);
    this.addVarbIdsToSolveFor(...varbIds);
  }
}