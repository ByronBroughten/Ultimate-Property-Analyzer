import { SectionPackRaw } from "../SectionPack/SectionPackRaw";
import { FeSectionInfo } from "../SectionsMeta/Info";
import {
  ChildName,
  DescendantName
} from "../SectionsMeta/relSectionTypes/ChildTypes";
import { SectionName } from "../SectionsMeta/SectionName";
import { GetterSections } from "../StateGetters/GetterSections";
import { UpdaterSectionBase } from "../StateUpdaters/bases/updaterSectionBase";
import {
  AddChildOptions,
  AddDescendantOptions,
  DescendantList,
  UpdaterSection
} from "../StateUpdaters/UpdaterSection";
import { Arr } from "../utils/Arr";
import { PackLoaderSection } from "./PackLoaderSection";
import { SectionPackMaker } from "./SectionPackMaker";

export class PackBuilderSection<
  SN extends SectionName
> extends UpdaterSectionBase<SN> {
  static initAsMain() {
    return new PackBuilderSection(UpdaterSection.initMainProps());
  }
  static initAsRoot() {
    return new PackBuilderSection(UpdaterSection.initRootProps());
  }
  private get getterSections() {
    return new GetterSections(this.getterSectionsProps);
  }
  get updater(): UpdaterSection<SN> {
    return new UpdaterSection(this.getterSectionProps);
  }
  get loader(): PackLoaderSection<SN> {
    return new PackLoaderSection(this.getterSectionProps);
  }
  get maker(): SectionPackMaker<SN> {
    return new SectionPackMaker(this.getterSectionProps);
  }
  children<CN extends ChildName<SN>>(sectionName: CN): PackBuilderSection<CN>[] {
    return this.get.childFeIds(sectionName).map((feId) => this.packBuilderSection({
      sectionName,
      feId
    }));
  }
  makeSectionPack(): SectionPackRaw<SN> {
    // it should probably start with root
    return this.maker.makeSectionPack();
  }
  addAndGetDescendant<DN extends DescendantName<SN>>(
    descendantList: DescendantList<SN, DN>,
    options?: AddDescendantOptions<SN, DN>
  ): PackBuilderSection<DN> {
    this.updater.addDescendant(descendantList, options);
    const descendantName = Arr.lastOrThrow(descendantList) as DN;
    return this.youngestPackBuilder(descendantName);
  }
  addAndGetChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ): PackBuilderSection<CN> {
    this.addChild(childName, options);
    return this.youngestPackBuilder(childName);
  }
  addChild<CN extends ChildName<SN>>(
    childName: CN,
    options?: AddChildOptions<SN, CN>
  ) {
    this.updater.addChild(childName, options);
  }
  loadChild<CN extends ChildName<SN>>(childPack: SectionPackRaw<CN>) {
    this.loader.loadChildSectionPack(childPack);
  }
  loadSelf(sectionPack: SectionPackRaw<SN>) {
    this.loader.updateSelfWithSectionPack(sectionPack);
  }
  packBuilderSection<S extends SectionName>(feInfo: FeSectionInfo<S>): PackBuilderSection<S> {
    return new PackBuilderSection({
      ...feInfo,
      sectionsShare: this.sectionsShare,
    })
  }
  private youngestPackBuilder<S extends SectionName>(
    sectionName: S
  ): PackBuilderSection<S> {
    const { feInfo } = this.getterSections.newestEntry(sectionName);
    return this.packBuilderSection(feInfo);
  }
}
