import { extend, omit } from "lodash";
import { Obj } from "../utils/Obj";
import { FeSelfOrDescendantParentStub } from "./FeSectionPacks/FeParentStub";
import {
  FeSelfOrDescendantNode,
  OneSectionNodeMaker,
  SectionNodeMaker,
} from "./FeSectionPacks/FeSectionNode";
import { Inf } from "./SectionMetas/Info";
import {
  NameToNameWithSameChildren,
  SelfOrDescendantIds,
} from "./SectionMetas/relNameArrs/ChildTypes";
import { FeParentInfo } from "./SectionMetas/relNameArrs/ParentTypes";
import { Id } from "./SectionMetas/relSections/baseSections/id";
import { SectionName } from "./SectionMetas/SectionName";
import { SectionPackRaw } from "./SectionPackRaw";
import {
  GeneralRawSection,
  RawSection,
  RawSections,
} from "./SectionPackRaw/RawSection";
import { RawSectionFinder } from "./SectionPackRaw/RawSectionFinder";
export type OrderedSectionNodeProps<SN extends SectionName> = {
  parentFinder: FeParentInfo<SN>;
  feId?: string;
  idx?: number;
};

type FeSectionPackCore<SN extends SectionName> = SectionPackRaw<"fe", SN>;
export class FeSectionPack<SN extends SectionName> {
  constructor(readonly core: FeSectionPackCore<SN>) {}
  get sectionName(): SN {
    return this.core.sectionName;
  }
  get dbId(): string {
    return this.core.dbId;
  }
  get rawSections(): RawSections<SN, "fe"> {
    return this.core.rawSections;
  }
  get headSectionFinder() {
    return {
      sectionName: this.sectionName,
      dbId: this.dbId,
    } as RawSectionFinder<SN, "fe">;
  }
  rawSection({
    sectionName,
    dbId,
  }: RawSectionFinder<SN, "fe">): RawSection<"fe", SN> {
    const rawSections = this.rawSections[
      sectionName
    ] as any as GeneralRawSection[];
    const rawSection = rawSections.find(
      (rawSection) => rawSection.dbId === dbId
    );
    if (rawSection) return rawSection as any;
    else throw new Error(`No rawSection found at ${sectionName}.${dbId}`);
  }
  get headSection(): RawSection<"fe", SN> {
    return this.rawSection(this.headSectionFinder);
  }
  changeType<NextSN extends NameToNameWithSameChildren<SN, "fe", "fe">>(
    nextSectionName: NextSN
  ): FeSectionPack<NextSN> {
    const { sectionName } = this;
    const nextCore = {
      ...this.core,
      sectionName: nextSectionName,
      rawSections: {
        ...omit(this.rawSections, [sectionName]),
        [nextSectionName]: this.rawSections[sectionName],
      },
    } as any as FeSectionPackCore<NextSN>;
    return new FeSectionPack(nextCore);
  }
  dbToFeIds(
    childDbIds: SelfOrDescendantIds<SN, "fe">
  ): SelfOrDescendantIds<SN, "fe"> {
    return Obj.entries(childDbIds as SelfOrDescendantIds).reduce(
      (childFeIds, [childName, dbIdArr]) => {
        (childFeIds[childName] as string[]) = dbIdArr.map(() => Id.make());
        return childFeIds;
      },
      {} as SelfOrDescendantIds
    ) as SelfOrDescendantIds<SN, "fe">;
  }
  makeFeNode(nodeMaker: SectionNodeMaker<SN>): FeSelfOrDescendantNode<SN> {
    const { dbVarbs, childDbIds } = this.rawSection(
      nodeMaker as RawSectionFinder<SN, "fe">
    );
    return extend(nodeMaker, {
      dbVarbs,
      childFeIds: this.dbToFeIds(childDbIds as SelfOrDescendantIds<SN, "fe">),
    }) as any;
  }
  makeParentStub(
    feNode: FeSelfOrDescendantNode<SN>
  ): FeSelfOrDescendantParentStub<SN> {
    const { childDbIds } = this.rawSection(
      feNode as any as RawSectionFinder<SN, "fe">
    );
    return {
      parentFinder: Inf.fe(feNode.sectionName, feNode.feId),
      childDbIds,
      childFeIds: feNode.childFeIds,
    } as FeSelfOrDescendantParentStub<SN>;
  }
  makeHeadNodeMaker({ feId, ...rest }: OrderedSectionNodeProps<SN>) {
    return {
      feId: feId ?? Id.make(),
      dbId: this.dbId,
      sectionName: this.sectionName,
      ...rest,
    } as SectionNodeMaker<SN>;
  }
  makeNodeMakers({
    parentFinder,
    childDbIds,
    childFeIds,
  }: FeSelfOrDescendantParentStub<SN>): SectionNodeMaker<SN>[] {
    const sectionNodeMakers: SectionNodeMaker<SN>[] = [];
    for (const [sectionName, dbIds] of Obj.entries(childDbIds)) {
      const feIds = childFeIds[sectionName];
      for (const [idx, dbId] of Obj.entries(dbIds)) {
        sectionNodeMakers.push({
          dbId,
          feId: feIds[idx],
          sectionName,
          parentFinder: parentFinder,
        } as OneSectionNodeMaker<SectionName> as SectionNodeMaker<SN>);
      }
    }
    return sectionNodeMakers;
  }
  makeOrderedSectionNodes(props: OrderedSectionNodeProps<SN>) {
    const orderedSectionNodes: FeSelfOrDescendantNode<SN>[] = [];
    const queue: SectionNodeMaker<SN>[] = [];
    queue.push(this.makeHeadNodeMaker(props));
    while (queue.length > 0) {
      const queueLength = queue.length;
      for (let i = 0; i < queueLength; i++) {
        const nodeMaker = queue.shift() as SectionNodeMaker<SN>;
        const feNode = this.makeFeNode(nodeMaker);
        orderedSectionNodes.push(feNode);
        const parentStub = this.makeParentStub(feNode);
        queue.push(...this.makeNodeMakers(parentStub));
      }
    }
    return orderedSectionNodes;
  }
}
