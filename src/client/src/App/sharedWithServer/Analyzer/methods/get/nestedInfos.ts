import Analyzer from "../../../Analyzer";
import { SectionFinder } from "../../../SectionMetas/baseSectionTypes";
import {
  FeNameInfo,
  FeVarbInfo,
  RelVarbInfo,
} from "../../../SectionMetas/relSections/rel/relVarbInfoTypes";
import { SectionName } from "../../../SectionMetas/SectionName";
import array from "../../../utils/Arr";
import { Obj } from "../../../utils/Obj";

export function nestedFeInfos<S extends SectionName>(
  this: Analyzer,
  info: SectionFinder<S>,
  {
    feInfos = [],
    includeInEntitySections = false,
    skipSectionNames = [],
  }: {
    feInfos?: FeNameInfo[];
    includeInEntitySections?: boolean;
    skipSectionNames?: string[];
  } = {}
): FeNameInfo[] {
  const options = { feInfos, includeInEntitySections };
  const section = this.section(info);
  const { feInfo } = section;
  feInfos.push(feInfo);

  const childEntries = Obj.entriesFull(section.allChildFeIds());
  for (const [sectionName, feIdArr] of childEntries) {
    if (skipSectionNames.includes(sectionName)) continue;
    for (const id of feIdArr) {
      this.nestedFeInfos({ sectionName, id, idType: "feId" }, options);
    }
  }

  if (includeInEntitySections) {
    for (const entity of section.entities) {
      const { feInfo: entityInfo } = this.section(entity);
      if (!array.objIsIn(entityInfo, feInfos))
        this.nestedFeInfos(entityInfo, options);

      const { feInfo: parentInfo } = this.parent(entity);
      if (!array.objIsIn(parentInfo, feInfos)) feInfos.push(parentInfo);
    }
  }
  return feInfos;
}
export function nestedFeVarbInfos(
  this: Analyzer,
  feInfo: FeNameInfo | FeNameInfo[]
): FeVarbInfo[] {
  const feInfos = Array.isArray(feInfo) ? feInfo : this.nestedFeInfos(feInfo);
  return feInfos.reduce((nestedInfos, info) => {
    const { feVarbInfos } = this.section(info);
    nestedInfos = nestedInfos.concat(feVarbInfos);
    return nestedInfos;
  }, [] as FeVarbInfo[]);
}

export function nestedFeOutVarbInfos(
  this: Analyzer,
  feInfo: FeNameInfo | FeNameInfo[]
): FeVarbInfo[] {
  const nestedFeInfos = Array.isArray(feInfo)
    ? feInfo
    : this.nestedFeInfos(feInfo);
  const nestedOutVarbInfos = nestedFeInfos.reduce(
    (nestedVarbInfos, nestedInf) => {
      const outVarbInfos = this.sectionOutFeVarbInfos(nestedInf);
      nestedVarbInfos = nestedVarbInfos.concat(outVarbInfos);
      return nestedVarbInfos;
    },
    [] as FeVarbInfo[]
  );
  return array.rmDuplicateObjsClone(nestedOutVarbInfos);
}
export function nestedNumObjInfos(
  this: Analyzer,
  feInfo: FeNameInfo
): FeVarbInfo[] {
  const nestedFeVarbInfos = this.nestedFeVarbInfos(feInfo);
  return nestedFeVarbInfos.filter(({ sectionName, varbName }) => {
    return this.meta.varb({ sectionName, varbName }).type === "numObj";
  });
}

export function relativeToFeVarbInfo(
  this: Analyzer,
  focalInfo: FeVarbInfo,
  relInfo: RelVarbInfo
): FeVarbInfo {
  const varb = this.varbsByFocal(focalInfo, relInfo)[0];
  return varb.feVarbInfo;
}
export function relativesToFeVarbInfos(
  this: Analyzer,
  feInfo: FeNameInfo,
  relatives: RelVarbInfo | RelVarbInfo[]
): FeVarbInfo[] {
  if (!Array.isArray(relatives)) relatives = [relatives];
  let feVarbInfos: FeVarbInfo[] = [];
  for (const relVarbInfo of relatives) {
    const varbs = this.varbsByFocal(feInfo, relVarbInfo);
    const varbInfos = varbs.map((varb) => varb.feVarbInfo);
    feVarbInfos = feVarbInfos.concat(varbInfos);
  }
  return feVarbInfos;
}
