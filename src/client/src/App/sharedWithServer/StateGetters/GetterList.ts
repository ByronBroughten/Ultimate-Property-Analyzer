import { VarbName } from "../SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { VarbValue } from "../SectionsMeta/baseSectionsDerived/valueMetaTypes";
import { IdInfoMultiMixed } from "../SectionsMeta/childSectionsDerived/MixedSectionInfo";
import { SectionNameByType } from "../SectionsMeta/SectionNameByType";
import {
  RawFeSection,
  SectionNotFoundError,
  TooManySectionsFoundError,
} from "../StateSections/StateSectionsTypes";
import { Arr } from "../utils/Arr";
import { GetterListBase } from "./Bases/GetterListBase";
import { GetterSection } from "./GetterSection";

export class GetterList<
  SN extends SectionNameByType
> extends GetterListBase<SN> {
  private get stateList(): RawFeSection<SN>[] {
    return this.sectionsShare.sections.rawSectionList(this.sectionName);
  }
  get oneAndOnly(): GetterSection<SN> {
    this.exactlyOneOrThrow(this.stateList, "all");
    return this.last;
  }
  private get getterSectionArr() {
    return this.stateList.map(({ feId }) => this.getterSection(feId));
  }
  get last(): GetterSection<SN> {
    const stateSection = Arr.lastOrThrow(this.stateList);
    return this.getterSection(stateSection.feId);
  }
  get arr(): GetterSection<SN>[] {
    return this.stateList.map(({ feId }) => this.getterSection(feId));
  }
  get length(): number {
    return this.stateList.length;
  }
  idx(feId: string): number {
    const idx = this.stateList.findIndex((section) => section.feId === feId);
    if (idx < 0) throw this.sectionNotFoundError("feId");
    return idx;
  }
  private getterSection(feId: string): GetterSection<SN> {
    return new GetterSection({
      sectionName: this.sectionName,
      feId,
      sectionsShare: this.sectionsShare,
    });
  }
  get allGetterSections(): GetterSection<SN>[] {
    return this.stateList.map(({ feId }) => this.getterSection(feId));
  }
  getByValue<VN extends VarbName<SN>>(
    varbName: VN,
    value: VarbValue<SN, VN>
  ): GetterSection<SN> {
    let sections = this.allGetterSections;
    sections = sections.filter(
      (section) => section.valueNext(varbName) === value
    );
    this.exactlyOneOrThrow(sections, `varbName ${varbName} and value ${value}`);
    return sections[0];
  }
  getByFeId(feId: string): GetterSection<SN> {
    const section = this.stateList.find((section) => section.feId === feId);
    if (!section) {
      throw this.sectionNotFoundError("feId");
    }
    return this.getterSection(feId);
  }
  hasByFeId(feId: string): boolean {
    try {
      this.getByFeId(feId);
      return true;
    } catch (error) {
      if (error instanceof SectionNotFoundError) return false;
      else throw error;
    }
  }
  filterByFeIds(feIds: string[]): GetterSection<SN>[] {
    const rawSections = this.stateList.filter(({ feId }) =>
      feIds.includes(feId)
    );
    return rawSections.map(({ feId }) => this.getterSection(feId));
  }
  getByDbId(dbId: string): GetterSection<SN> {
    const sections = this.sectionsByDbId(dbId);
    this.exactlyOneOrThrow(sections, "dbId");
    return sections[0];
  }
  hasByDbId(dbId: string): boolean {
    return this.sectionsByDbId(dbId).length > 0;
  }
  sectionsByDbId(dbId: string): GetterSection<SN>[] {
    return this.getterSectionArr.filter((section) => section.dbId === dbId);
  }
  getOneByMixed(info: IdInfoMultiMixed): GetterSection<SN> {
    const sections = this.getMultiByMixed(info);
    this.exactlyOneOrThrow(sections, info.infoType);
    return sections[0];
  }
  getMultiByMixed(info: IdInfoMultiMixed) {
    const sections = this.allSectionsByMixed(info);
    if (info.expectedCount === "onlyOne") {
      this.exactlyOneOrThrow(sections, info.infoType);
    }
    return sections;
  }
  hasByMixed(idInfo: IdInfoMultiMixed): boolean {
    return this.allSectionsByMixed(idInfo).length > 0;
  }
  private allSectionsByMixed(info: IdInfoMultiMixed): GetterSection<SN>[] {
    switch (info.infoType) {
      case "globalSection":
        return this.allGetterSections;
      case "feId":
        return [this.getByFeId(info.id)];
      case "dbId":
        return this.sectionsByDbId(info.id);
    }
  }
  exactlyOneOrThrow(arr: any[], infoType: string) {
    if (arr.length > 1) throw this.tooManySectionsFound(infoType);
    else if (arr.length < 1) throw this.sectionNotFoundError(infoType);
  }
  tooManySectionsFound(infoType: string): TooManySectionsFoundError {
    return new TooManySectionsFoundError(
      `Too many sections found using infoType ${infoType}`
    );
  }
  sectionNotFoundError(infoType: string): SectionNotFoundError {
    return new SectionNotFoundError(
      `No section found of sectionName ${this.sectionName} using infoType ${infoType}`
    );
  }
}
