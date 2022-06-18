import { makeReq, SectionPackArrReq } from "../apiQueriesShared/makeReqAndRes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { SectionPackMaker } from "../StatePackers.ts/SectionPackMaker";
import { SolverSections } from "../StateSolvers/SolverSections";

export class SectionArrReqMaker<
  SN extends SectionName<"arrStore">
> extends GetterSectionBase<SN> {
  static init<SN extends SectionName<"arrStore">>(sectionName: SN) {
    const sections = SolverSections.initSectionsFromDefaultMain();
    const section = sections.onlyOneRawSection(sectionName);
    return new SectionArrReqMaker({
      ...section,
      sectionsShare: { sections },
    });
  }
  get packMaker() {
    return new SectionPackMaker(this.getterSectionProps);
  }
  makeReq(): SectionPackArrReq<SN> {
    return makeReq({
      dbStoreName: this.sectionName,
      sectionPackArr: [this.packMaker.makeSectionPack()],
    });
  }
}

function test(props: SectionName<"arrStore">) {}

test({} as SectionName<"hasArrStore">);
