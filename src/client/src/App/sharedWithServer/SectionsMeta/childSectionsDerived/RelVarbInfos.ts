import { Obj } from "../../utils/Obj";
import { SimpleSectionName } from "../baseSections";
import { FeVarbInfoMixed } from "../baseSectionsDerived/baseVarbInfo";
import { ChildName } from "./ChildName";
import {
  RelChildrenVarbInfo,
  RelLocalVarbInfo,
  relVarbInfoS,
} from "./RelVarbInfo";

type RelLocalVarbInfos<SN extends SimpleSectionName, VN extends string> = {
  [V in VN]: RelLocalVarbInfo;
};

export const relVarbInfosS = {
  localByVarbName<SN extends SimpleSectionName, VN extends string>(
    varbNames: readonly VN[]
  ): RelLocalVarbInfos<SN, VN> {
    return varbNames.reduce((localInfos, varbName) => {
      localInfos[varbName] = relVarbInfoS.local(varbName);
      return localInfos;
    }, {} as RelLocalVarbInfos<SN, VN>);
  },
  local(varbNames: string[]): RelLocalVarbInfo[] {
    return varbNames.map((varbName) => {
      return relVarbInfoS.local(varbName);
    });
  },
  children<
    SN extends SimpleSectionName = SimpleSectionName,
    CN extends ChildName<SN> = ChildName<SN>
  >(childName: CN, varbNames: string[]): RelChildrenVarbInfo<SN, CN>[] {
    return varbNames.map((varbName) =>
      relVarbInfoS.children(childName, varbName)
    );
  },
  namedChildren<SN extends SimpleSectionName, CN extends ChildName<SN>>(
    childName: CN,
    kwargsToVarbNames: Record<string, string>
  ): Record<string, RelChildrenVarbInfo<SN, CN>> {
    return Obj.keys(kwargsToVarbNames).reduce((namedChildren, kwarg) => {
      const varbName = kwargsToVarbNames[kwarg];
      namedChildren[kwarg] = relVarbInfoS.children(childName, varbName);
      return namedChildren;
    }, {} as Record<string, RelChildrenVarbInfo<SN, CN>>);
  },
  localVarbInfoMixed<SN extends SimpleSectionName>(): RelLocalVarbInfos<
    SN,
    keyof FeVarbInfoMixed<SN>
  > {
    return this.localByVarbName([
      "sectionName",
      "varbName",
      "infoType",
      "id",
      "expectedCount",
    ]);
  },
};
