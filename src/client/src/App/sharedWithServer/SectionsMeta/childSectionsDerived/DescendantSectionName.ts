import { SimpleSectionName } from "../baseSectionsVarbs";
import { getChildNames } from "./ChildName";
import { ChildSectionNameNarrow, childToSectionName } from "./ChildSectionName";

export type DescendantSectionName<SN extends SimpleSectionName> =
  ChildSectionNameNarrow<SN> extends never
    ? never
    :
        | ChildSectionNameNarrow<SN>
        | DescendantSectionName<ChildSectionNameNarrow<SN>>;

export function getDescendantNames<SN extends SimpleSectionName>(
  headName: SN
): DescendantSectionName<SN>[] {
  const descendantNames: any[] = [];
  let headNames: SimpleSectionName[] = [headName];

  let reps = 0;
  while (headNames.length > 0) {
    const nextHeadNames: SimpleSectionName[] = [];
    for (const headName of headNames) {
      const childNames = getChildNames(headName);
      for (const childName of childNames) {
        const sectionName = childToSectionName(headName, childName);
        nextHeadNames.push(sectionName);
        if (!descendantNames.includes(sectionName)) {
          descendantNames.push(sectionName);
        }
      }
    }
    headNames = nextHeadNames;
    reps++;
    if (reps > 100) {
      throw new Error(`While loop exceeded repetition limit.`);
    }
  }
  return descendantNames;
}
export function getSelfAndDescendantNames<SN extends SimpleSectionName>(
  sectionName: SN
): SelfOrDescendantSectionName<SN>[] {
  const names = getDescendantNames(sectionName);
  const selfAndNames = new Set([...names, sectionName]);
  return [...selfAndNames];
}

export type SelfOrDescendantSectionName<SN extends SimpleSectionName> =
  | SN
  | DescendantSectionName<SN>;

export type DescendantIds<SN extends SimpleSectionName> = {
  [S in DescendantSectionName<SN>]: string[];
};
export type SelfAndDescendantIds<SN extends SimpleSectionName> = {
  [S in SelfOrDescendantSectionName<SN>]: string[];
};

function _testDescendantType<
  SN extends SelfOrDescendantSectionName<"propertyGeneral">
>(sn: SN) {
  type FeTest = DescendantSectionName<"propertyGeneral">;
  const _test1: FeTest = "unit";
  // @ts-expect-error
  const _test3: FeTest = "loan";
}
