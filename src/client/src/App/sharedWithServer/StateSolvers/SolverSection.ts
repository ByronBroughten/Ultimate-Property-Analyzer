import { SectionPackRaw } from "../SectionPack/SectionPack";
import { Id } from "../SectionsMeta/baseSections/id";
import { VarbValues } from "../SectionsMeta/baseSectionTypes";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionProps } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { ChildSectionPackArrs } from "../StatePackers.ts/PackLoaderSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../StateUpdaters/UpdaterSection";
import { Obj } from "../utils/Obj";
import { AddSolverSection } from "./AddSolverSection";
import { ComboSolverSection } from "./ComboSolverSection";
import { RemoveSolverSection } from "./RemoveSolverSection";
import {
  SolverSectionBase,
  SolverSectionProps,
} from "./SolverBases/SolverSectionBase";
import { HasSolveShare } from "./SolverBases/SolverSectionsBase";
import { SolverSections } from "./SolverSections";

interface SolverSectionInitProps<SN extends SectionName>
  extends GetterSectionProps<SN>,
    Partial<HasSolveShare> {}

export class SolverSection<
  SN extends SectionName
> extends SolverSectionBase<SN> {
  static init<S extends SectionName>(
    props: SolverSectionInitProps<S>
  ): SolverSection<S> {
    if (!props.solveShare) {
      props.solveShare = {
        varbIdsToSolveFor: new Set(),
      };
    }
    return new SolverSection(props as SolverSectionProps<S>);
  }
  get = new GetterSection(this.getterSectionProps);
  private solverSections = new SolverSections(this.solverSectionsProps);
  private get updater() {
    return new UpdaterSection(this.getterSectionProps);
  }
  private get remover() {
    return RemoveSolverSection.init(this.solverSectionProps);
  }
  private get adder() {
    return AddSolverSection.init(this.solverSectionProps);
  }
  private get combo() {
    return new ComboSolverSection(this.solverSectionProps);
  }
  get varbIdsToSolveFor(): Set<string> {
    return this.solveShare.varbIdsToSolveFor;
  }
  solverSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SolverSection<S> {
    return new SolverSection({
      ...this.solverSectionsProps,
      ...feInfo,
    });
  }
  youngestChild<CN extends ChildName<SN>>(childName: CN): SolverSection<CN> {
    const { feInfo } = this.get.youngestChild(childName);
    return this.solverSection(feInfo);
  }
  private solve() {
    this.solverSections.solve();
  }
  updateValuesAndSolve(values: VarbValues): void {
    this.updater.updateValuesDirectly(values);
    const varbNames = Obj.keys(values) as string[];
    const varbInfos = varbNames.map((varbName) => this.get.varbInfo(varbName));
    this.addVarbInfosToSolveFor(...varbInfos);
    this.solve();
  }
  removeSelfAndSolve(): void {
    this.remover.removeSelfAndExtractVarbIds();
    this.solve();
  }
  removeChildrenAndSolve(childName: ChildName<SN>): void {
    this.remover.removeChildrenAndExtractVarbIds(childName);
    this.solve();
  }
  removeChildAndSolve<CN extends ChildName<SN>>(
    feInfo: FeSectionInfo<CN>
  ): void {
    if (this.get.hasChild(feInfo)) {
      const child = this.solverSection(feInfo);
      child.removeSelfAndSolve();
    } else {
      throw new Error(
        `Section ${this.get.sectionName}.${this.get.feId} does not have child ${feInfo.sectionName}.${feInfo.feId}.`
      );
    }
  }
  resetToDefaultAndSolve(): void {
    this.combo.resetToDefaultAndExtractIds();
    this.solve();
  }
  replaceWithDefaultAndSolve(): void {
    this.combo.resetToDefaultAndExtractIds();
    this.updater.updateProps({
      dbId: Id.make(),
    });
    this.solve();
  }
  loadSelfSectionPackAndSolve(sectionPack: SectionPackRaw<SN>): void {
    this.combo.loadSelfSectionPackAndExtractIds(sectionPack);
    this.solve();
  }
  addChildAndSolve<CN extends ChildName<SN>>(
    childName: ChildName<SN>,
    options?: AddChildOptions<CN>
  ): void {
    this.adder.addChildAndFinalize(childName, options);
    this.solve();
  }
  loadChildPackAndSolve<CN extends ChildName<SN>>(
    childPack: SectionPackRaw<CN>
  ) {
    const { sectionName } = childPack;
    this.updater.addChild(sectionName);
    const child = this.youngestChild(sectionName);
    child.loadSelfSectionPackAndSolve(childPack);

    // this.adder.loadChildAndCollectVarbIds(childPack);
    // this.adder.finalizeVarbsAndExtractIds();
    // this.solve();
  }
  loadChildPackArrsAndSolve(
    childPackArrs: Partial<ChildSectionPackArrs<SN>>
  ): void {
    this.combo.loadChildPackArrsAndExtractIds(childPackArrs);
    this.solve();
  }
}
