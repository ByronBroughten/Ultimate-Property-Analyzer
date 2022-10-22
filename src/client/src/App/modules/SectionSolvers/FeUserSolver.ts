import { AnalyzerPlanValues } from "../../sharedWithServer/apiQueriesShared/AnalyzerPlanValues";
import { defaultMaker } from "../../sharedWithServer/defaultMaker/defaultMaker";
import { ChildSectionName } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../sharedWithServer/SectionsMeta/childSectionsDerived/SectionPack";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { FeStoreNameByType } from "../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/FeStoreName";
import { AutoSyncStatus } from "../../sharedWithServer/SectionsMeta/relSectionVarbs/relVarbs";
import { SectionNameByType } from "../../sharedWithServer/SectionsMeta/SectionNameByType";
import { GetterSection } from "../../sharedWithServer/StateGetters/GetterSection";
import { PackBuilderSection } from "../../sharedWithServer/StatePackers.ts/PackBuilderSection";
import { SolverSectionBase } from "../../sharedWithServer/StateSolvers/SolverBases/SolverSectionBase";
import { SolverSection } from "../../sharedWithServer/StateSolvers/SolverSection";
import { DisplayIndexBuilder } from "./DisplayIndexBuilder";
import { FeIndexBuilder } from "./FeIndexBuilder";
import { MainSectionSolver } from "./MainSectionSolver";

export class FeUserSolver extends SolverSectionBase<"feUser"> {
  get get(): GetterSection<"feUser"> {
    return new GetterSection(this.getterSectionProps);
  }
  get packBuilder() {
    return new PackBuilderSection(this.getterSectionProps);
  }
  get solver(): SolverSection<"feUser"> {
    return new SolverSection(this.solverSectionProps);
  }
  static initDefault() {
    const feUser = PackBuilderSection.initAsOmniChild("feUser");
    feUser.loadSelf(defaultMaker.makeSectionPack("feUser"));
    return new FeUserSolver({
      ...FeUserSolver.initProps({
        sections: feUser.sectionsShare.sections,
      }),
      ...feUser.getterSectionProps,
    });
  }
  loadSubscriptionInfo({
    analyzerPlan,
    analyzerPlanExp,
  }: AnalyzerPlanValues): void {
    this.solver.updateValuesAndSolve({
      analyzerPlan,
      analyzerPlanExp,
    });
  }
  loadDisplayStoreList<
    SN extends FeStoreNameByType<"displayStoreName">,
    S extends ChildSectionName<SN, "activeAsSaved">
  >(sectionName: SN, sources: GetterSection<S>[]): void {
    const store = this.solver.onlyChild(
      sectionName as FeStoreNameByType<"displayStoreName">
    );
    const nameList = store.onlyChild("displayNameList");
    for (const source of sources) {
      nameList.addChildAndSolve("displayNameItem", {
        dbId: source.dbId,
        dbVarbs: { displayName: source.valueNext("displayName").mainText },
      });
    }
  }
  mainSolver<SN extends SectionNameByType<"hasIndexStore">>(
    feInfo: FeSectionInfo<SN>
  ): MainSectionSolver<SN> {
    return new MainSectionSolver({
      ...this.solverSectionProps,
      ...feInfo,
    });
  }
  indexSolver<SN extends SectionNameByType<"hasIndexStore">>(sectionName: SN) {
    return new FeIndexBuilder({
      ...this.solverSectionsProps,
      sectionName,
    });
  }
  displayIndexBuilder<SN extends SectionNameByType<"displayStoreName">>(
    sectionName: SN
  ): DisplayIndexBuilder<SN> {
    return new DisplayIndexBuilder({
      ...this.solverSectionsProps,
      ...this.get.onlyChild(sectionName).feInfo,
    }) as DisplayIndexBuilder<any>;
  }
  prepForCompare<SN extends ChildSectionName<"omniParent">>(
    sectionPack: SectionPack<SN>
  ): SectionPack<SN> {
    const headSection = PackBuilderSection.loadAsOmniChild(sectionPack);
    const { sections } = headSection;
    let sectionInfos: FeSectionInfo[] = [headSection.feInfo];
    while (sectionInfos.length > 0) {
      const nextInfos: FeSectionInfo[] = [];
      for (const info of sectionInfos) {
        const section = sections.section(info);
        section.updater.resetSolvableTexts();
        for (const childName of section.get.childNames) {
          for (const child of section.children(childName)) {
            const getterChild = child.get;
            if (getterChild.isSectionType("hasIndexStore")) {
              if (
                getterChild.valueNext("syncStatus") ===
                ("autoSyncOn" as AutoSyncStatus)
              ) {
                const indexSolver = this.indexSolver(getterChild.sectionName);
                if (indexSolver.isSaved(getterChild.dbId)) {
                  child.removeSelf();
                }
              }
            }
            nextInfos.push(child.feInfo);
          }
        }
      }
      sectionInfos = nextInfos;
    }
    return headSection.makeSectionPack();
  }
}
