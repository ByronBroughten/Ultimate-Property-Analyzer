import { Merge } from "../../utils/Obj/merge";
import { ChildName } from "../childSectionsDerived/ChildName";
import { ChildSectionNameName } from "../childSectionsDerived/ChildSectionName";
import { SectionName } from "../SectionName";

export function sectionTraits<
  SN extends SectionName,
  O extends Options<SN> = {}
>(options?: O): SectionTraits<SN, O> {
  return {
    ...defaultProps,
    ...options,
  } as any;
}
export type SectionTraits<
  SN extends SectionName,
  O extends Options<SN> = {}
> = Merge<DefaultProps, O>;

type Options<SN extends SectionName> = Partial<GenericSectionTraits<SN>>;

export interface GenericSectionTraits<SN extends SectionName>
  extends GeneralSectionTraits {
  varbListItem: ChildName<SN> | null;
}

export interface GeneralSectionTraits {
  displayName: string;
  hasGlobalVarbs: boolean;
  varbListItem: string | null;
  displayIndexName: ChildName<"feUser"> | null;
  compareTableName: ChildSectionNameName<"feUser", "compareTable"> | null;
  feFullIndexStoreName: ChildName<"feUser"> | null;
  dbIndexStoreName: ChildName<"dbStore"> | null;
}

export type SectionTraitName = keyof GeneralSectionTraits;

function makeDefault<G extends GeneralSectionTraits>(options: G): G {
  return options;
}

type DefaultProps = typeof defaultProps;
const defaultProps = makeDefault({
  displayName: "Unnamed Section",
  hasGlobalVarbs: false,
  varbListItem: null,
  displayIndexName: null,
  compareTableName: null,
  feFullIndexStoreName: null,
  dbIndexStoreName: null,
});