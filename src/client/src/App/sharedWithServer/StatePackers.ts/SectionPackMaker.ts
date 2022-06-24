import { OneRawSection, RawSections } from "../SectionPack/RawSection";
import { SectionPackRaw } from "../SectionPack/SectionPack";
import { FeSectionInfo } from "../SectionsMeta/Info";
import { ChildName } from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSectionBase } from "../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../StateGetters/GetterSection";
import { Obj } from "../utils/Obj";

type FeSectionPackArrs<SN extends SectionName> = {
  [S in SN]: SectionPackRaw<S>[];
};

export class SectionPackMaker<
  SN extends SectionName
> extends GetterSectionBase<SN> {
  get = new GetterSection(this.getterSectionProps);
  makeSectionPack(): SectionPackRaw<SN> {
    return {
      sectionName: this.sectionName,
      dbId: this.get.dbId,
      rawSections: this.rawDescendantSections(),
    };
  }
  makeChildSectionPackArrs<CN extends ChildName<SN>>(
    childNames: CN[]
  ): FeSectionPackArrs<CN> {
    return childNames.reduce((spArrs, sectionName) => {
      spArrs[sectionName] = this.makeChildSectionPackArr(sectionName);
      return spArrs;
    }, {} as FeSectionPackArrs<CN>);
  }
  makeChildSectionPackArr<CN extends ChildName<SN>>(
    childName: CN
  ): SectionPackRaw<CN>[] {
    const childInfos = this.get.childInfos(childName);
    return childInfos.map((feInfo) => this.makeChildSectionPack(feInfo));
  }
  makeSiblingSectionPackArr(): SectionPackRaw<SN>[] {
    const { siblingFeInfos } = this.get;
    return siblingFeInfos.map((feInfo) => {
      const siblingMaker = this.sectionPackMaker(feInfo);
      return siblingMaker.makeSectionPack();
    });
  }
  sectionPackMaker<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): SectionPackMaker<S> {
    return new SectionPackMaker({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    });
  }
  makeChildSectionPack<CN extends ChildName<SN>>(
    feInfo: FeSectionInfo<CN>
  ): SectionPackRaw<CN> {
    const childPackMaker = this.sectionPackMaker(feInfo);
    return childPackMaker.makeSectionPack();
  }
  private rawDescendantSections(): RawSections<SN> {
    const { selfAndDescendantFeIds } = this.get;
    return Obj.entries(
      selfAndDescendantFeIds as { [key: string]: string[] }
    ).reduce((rawSections, [name, feIdArr]) => {
      rawSections[name] = this.feIdsToRawSections(name as SN, feIdArr);
      return rawSections;
    }, {} as { [key: string]: any }) as RawSections<SN>;
  }
  private feIdsToRawSections<S extends SectionName>(
    sectionName: S,
    feIdArr: string[]
  ): OneRawSection<S>[] {
    return feIdArr.map((feId) => {
      return this.makeRawSection({ sectionName, feId });
    });
  }
  private makeRawSection<S extends SectionName>(
    feInfo: FeSectionInfo<S>
  ): OneRawSection<S> {
    const { dbId, varbs, allChildDbIds } = this.get.getterSection(feInfo);
    return {
      dbId,
      dbVarbs: varbs.dbVarbs,
      childDbIds: allChildDbIds,
    };
  }
}
