import { pick } from "lodash";
import {
  ChildName,
  DbChildInfo,
} from "../../SectionsMeta/childSectionsDerived/ChildName";
import { ChildSectionName } from "../../SectionsMeta/childSectionsDerived/ChildSectionName";
import { SectionPack } from "../../SectionsMeta/childSectionsDerived/SectionPack";
import { OneRawSection } from "../../SectionsMeta/childSectionsDerived/SectionPack/RawSection";
import { SectionNameByType } from "../../SectionsMeta/SectionNameByType";
import {
  GetterSectionBase,
  GetterSectionProps,
} from "../../StateGetters/Bases/GetterSectionBase";
import { GetterSection } from "../../StateGetters/GetterSection";
import {
  AddChildOptions,
  UpdaterSection,
} from "../../StateUpdaters/UpdaterSection";
import { Obj } from "../../utils/Obj";

interface ChildPackLoaderProps<
  SN extends SectionNameByType,
  CN extends ChildName<SN>
> extends GetterSectionProps<SN> {
  sectionPack: SectionPack;
  childDbInfo: DbChildInfo<SN, CN>;
}

export class ChildPackLoader<
  SN extends SectionNameByType,
  CN extends ChildName<SN>,
  CT extends ChildSectionName<SN, CN> = ChildSectionName<SN, CN>
> extends GetterSectionBase<SN> {
  sectionPack: SectionPack;
  childDbInfo: DbChildInfo<SN, CN> & { idx?: number };
  updaterSection: UpdaterSection<SN>;
  get: GetterSection<SN>;
  constructor({
    sectionPack,
    childDbInfo,
    ...props
  }: ChildPackLoaderProps<SN, CN>) {
    super(props);
    this.sectionPack = sectionPack;
    this.childDbInfo = childDbInfo;
    this.updaterSection = new UpdaterSection(props);
    this.get = new GetterSection(props);
  }
  get childName(): CN {
    return this.childDbInfo.childName;
  }
  get childType(): CT {
    return this.get.meta.childType(this.childName) as CT;
  }
  get childRawSectionList(): OneRawSection<CT>[] {
    return this.sectionPack.rawSections[this.childType] as OneRawSection<CT>[];
  }
  get childRawSection(): OneRawSection<CT> {
    const rawSection = this.childRawSectionList.find(
      ({ dbId }) => dbId === this.childDbInfo.dbId
    );
    if (rawSection) return rawSection;
    else
      throw new Error(
        `No rawSection found with childType ${this.childType} and dbId ${this.childDbInfo.dbId}`
      );
  }
  loadChild() {
    this.updaterSection.addChild(this.childName, {
      ...pick(this.childRawSection, ["dbId", "dbVarbs"]),
      idx: this.childDbInfo.idx,
    } as AddChildOptions<any>);
    const { feId } = this.get.youngestChild(this.childName);
    this.loadChildChildren(feId);
  }
  private loadChildChildren(childFeId: string) {
    const child = this.getterChild(childFeId);
    const { childNames } = child;
    for (const childName of childNames) {
      const dbIds = this.childChildrenDbIds(childName);
      if (!Array.isArray(dbIds)) {
        throw new Error(`dbIds should be an array but is this: ${dbIds}`);
      }
      for (const dbId of dbIds) {
        const childPackLoader = this.childPackLoader({
          childFeId,
          childDbInfo: {
            dbId,
            childName,
          },
        });
        childPackLoader.loadChild();
      }
    }
  }
  private getterChild(
    childFeId: string
  ): GetterSection<ChildSectionName<SN, CN>> {
    return this.get.child({
      childName: this.childName,
      feId: childFeId,
    });
  }
  private childChildrenDbIds(
    childName: ChildName<ChildSectionName<SN, CN>>
  ): string[] {
    const { childDbIds } = this.childRawSection;
    const savedDbIdKeys = Obj.keys(childDbIds);
    if (savedDbIdKeys.includes(childName as any)) {
      return childDbIds[childName as keyof typeof childDbIds];
    } else {
      return [];
    }
  }
  childPackLoader({
    childFeId,
    childDbInfo,
  }: {
    childFeId: string;
    childDbInfo: {
      dbId: string;
      childName: string;
    };
  }) {
    return new ChildPackLoader({
      sectionName: this.childType,
      feId: childFeId,
      sectionsShare: this.sectionsShare,
      sectionPack: this.sectionPack,
      childDbInfo: childDbInfo as any,
    });
  }
}
