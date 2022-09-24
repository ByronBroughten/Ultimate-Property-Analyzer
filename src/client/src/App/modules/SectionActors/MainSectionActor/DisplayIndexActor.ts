import { ChildSectionPack } from "../../../sharedWithServer/SectionsMeta/childSectionsDerived/ChildSectionPack";
import { FeStoreNameByType } from "../../../sharedWithServer/SectionsMeta/relSectionsDerived/relNameArrs/feStoreNameArrs";
import { SetterSection } from "../../../sharedWithServer/StateSetters/SetterSection";
import { SolverSection } from "../../../sharedWithServer/StateSolvers/SolverSection";
import { SectionActorBase } from "../SectionActorBase";
import { DisplayListActor } from "./DisplayListActor";

export class DisplayIndexActor<
  SN extends FeStoreNameByType<"displayStoreName">
> extends SectionActorBase<SN> {
  get list() {
    const list = this.get.onlyChild("displayNameList");
    return new DisplayListActor({
      ...this.sectionActorBaseProps,
      ...list.feInfo,
    });
  }
  get displayItems() {
    return this.list.displayItems;
  }
  hasByDbId(dbId: string) {
    return this.list.hasByDbId(dbId);
  }
  get setter() {
    return new SetterSection(this.setterSectionBase.setterSectionProps);
  }
  get solver() {
    return SolverSection.init(this.setterSectionBase.setterSectionProps);
  }
  private displayNameString(dbId: string): string {
    return this.getAsSaved(dbId).get.valueNext("displayName").mainText;
  }
  getAsSaved(dbId: string) {
    return this.setter.childByDbId({
      childName: "activeAsSaved",
      dbId,
    });
  }
  removeAsSavedIfNeeded(loadedDbIds: string[]) {
    const { itemDbIds } = this.list;
    const asSavedList = this.get.children("activeAsSaved");
    for (const { dbId } of asSavedList) {
      if (loadedDbIds.includes(dbId) && itemDbIds.includes(dbId)) {
        continue;
      } else {
        this.removeAsSaved(dbId);
      }
    }
  }
  addItem(sectionPack: ChildSectionPack<SN, "activeAsSaved">) {
    this.addAsSavedIfNot(sectionPack);
    const { dbId } = sectionPack;
    const child = this.getAsSaved(dbId).get;
    this.list.addItem({
      displayName: child.valueNext("displayName").mainText,
      dbId,
    });
    this.setter.setSections();
  }
  updateItem(sectionPack: ChildSectionPack<SN, "activeAsSaved">) {
    const { dbId } = sectionPack;
    const child = this.setter.childByDbId({
      childName: "activeAsSaved",
      dbId,
    });
    child.loadSelfSectionPack(sectionPack);
    this.list.updateItem({
      displayName: this.displayNameString(dbId),
      dbId,
    });
  }
  removeItem(dbId: string) {
    this.list.removeItem(dbId);
    this.removeAsSavedlIfNot(dbId);
  }
  private addAsSavedIfNot(sectionPack: ChildSectionPack<SN, "activeAsSaved">) {
    const { dbId } = sectionPack;
    if (!this.hasAsSaved(dbId)) {
      this.setter.loadChild({
        childName: "activeAsSaved",
        sectionPack: sectionPack as any,
      });
    }
  }
  private removeAsSavedlIfNot(dbId: string) {
    if (!this.list.hasByDbId(dbId)) {
      if (this.hasAsSaved(dbId)) {
        this.removeAsSaved(dbId);
      }
    }
  }
  private hasAsSaved(dbId: string): boolean {
    return this.get.hasChildByDbInfo({
      childName: "activeAsSaved",
      dbId,
    });
  }
  private removeAsSaved(dbId: string): void {
    this.setter.removeChildByDbId({
      childName: "activeAsSaved",
      dbId,
    });
  }
}
