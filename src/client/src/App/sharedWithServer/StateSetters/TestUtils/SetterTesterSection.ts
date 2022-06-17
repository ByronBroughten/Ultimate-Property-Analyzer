import { VarbInfo } from "../../SectionsMeta/Info";
import { ChildName } from "../../SectionsMeta/relSectionTypes/ChildTypes";
import { ParentNameSafe } from "../../SectionsMeta/relSectionTypes/ParentTypes";
import { SectionName } from "../../SectionsMeta/SectionName";
import { SectionsShare } from "../../StateGetters/Bases/GetterSectionsBase";
import { GetterList } from "../../StateGetters/GetterList";
import { GetterSection } from "../../StateGetters/GetterSection";
import { GetterVarb } from "../../StateGetters/GetterVarb";
import { SolverSection } from "../../StateSolvers/SolverSection";
import { SetterSection } from "../SetterSection";
import {
  SectionTesterBase,
  SectionTesterProps,
} from "./Bases/SectionTesterBase";

export class SetterTesterSection<
  SN extends SectionName
> extends SectionTesterBase<SN> {
  static initProps<S extends SectionName>(
    sectionName: S
  ): SectionTesterProps<S> {
    const sections = SolverSection.initSectionsFromDefaultMain();
    const list = new GetterList({
      sectionName,
      sectionsShare: { sections },
    });
    return {
      ...list.last.feInfo,
      state: { sections },
    };
  }
  static init<S extends SectionName>(sectionName: S): SetterTesterSection<S> {
    return new SetterTesterSection(this.initProps(sectionName));
  }
  get setter(): SetterSection<SN> {
    return new SetterSection(this.setterSectionTestProps);
  }
  get getter(): GetterSection<SN> {
    return new GetterSection(this.setterSectionTestProps);
  }
  get get(): GetterSection<SN> {
    return this.getter;
  }
  getterList<S extends SectionName>(sectionName: S): GetterList<S> {
    return new GetterList({
      ...this.setterSectionTestProps,
      sectionName,
    });
  }
  get parent(): SetterTesterSection<ParentNameSafe<SN>> {
    const { parentInfoSafe } = this.get;
    return new SetterTesterSection({
      ...this.sectionTesterProps,
      ...parentInfoSafe,
    });
  }
  childCounts(childName: ChildName<SN>) {
    return {
      childIds: this.get.childFeIds(childName).length,
      childSections: this.get.childList(childName).length,
    };
  }
  counts() {
    const counts = this.parent.childCounts(this.sectionName as any);
    return {
      siblings: counts.childIds,
      sectionsWithName: counts.childSections,
    };
  }

  // on the way out
  get sectionsSharePropFromState(): { sectionsShare: SectionsShare } {
    return { sectionsShare: { sections: this.state.sections } };
  }
  getterVarbFromState<SN extends SectionName>(
    feInfo: VarbInfo<SN>
  ): GetterVarb<SN> {
    return new GetterVarb({
      ...feInfo,
      ...this.sectionsSharePropFromState,
    });
  }
}