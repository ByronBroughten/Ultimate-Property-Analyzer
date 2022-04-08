import { GeneralRawSections, RawSections } from "./RawSectionPack/RawSection";
import { ContextName } from "./SectionMetas/relSections/baseSections";
import { SectionContextProps, SectionName } from "./SectionMetas/SectionName";

export type GeneralSectionPack = {
  sectionName: SectionName;
  contextName: ContextName;
  dbId: string;
  rawSections: GeneralRawSections;
};

export type RawSectionPack<
  CN extends ContextName,
  SN extends SectionName = SectionName
> = {
  sectionName: SN;
  dbId: string;
  contextName: CN;
  rawSections: RawSections<SN, CN>;
};

export type SectionPackDb<SN extends SectionName> = Omit<
  RawSectionPack<"db", SN>,
  keyof SectionContextProps<SN, "db">
>;

function _testRawSectionPack(
  feRaw: RawSectionPack<"fe", "propertyIndex">,
  dbRaw: RawSectionPack<"db", "propertyIndex">
) {
  const _test1 = feRaw.rawSections.cell;
  // @ts-expect-error
  const _test2 = feRaw.rawSections.unit;
  const _test3 = dbRaw.rawSections.unit;
}
