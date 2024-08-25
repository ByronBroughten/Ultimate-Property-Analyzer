import { VarbNames } from "../StateGetters/Identifiers/VarbInfoBase";
import { SectionName, sectionNames } from "../stateSchemas/SectionName";
import { valueMetas } from "../stateSchemas/valueMetas";
import { ValueMeta } from "../stateSchemas/valueMetas/valueMetaGeneric";
import { ValueName } from "../stateSchemas/ValueName";
import { Obj } from "../utils/Obj";
import { SectionMeta, VarbMetas } from "./SectionMeta";
import { VarbMeta } from "./VarbMeta";

type SectionMetasCore = {
  [SN in SectionName]: SectionMeta<SN>;
};

export class SectionsMeta {
  private core: SectionMetasCore;
  constructor() {
    this.core = SectionsMeta.initCore();
  }
  get sectionNames(): SectionName[] {
    return Obj.keys(this.core);
  }
  get<SN extends SectionName>(sectionName: SN): SectionMeta<SN> {
    const sectionCore = this.core[sectionName];
    return sectionCore as any;
  }
  section<SN extends SectionName>(sectionName: SN): SectionMeta<SN> {
    const sectionMeta = this.core[sectionName];
    if (sectionMeta === undefined) {
      throw new Error(`No section with sectionName "${sectionName}"`);
    }
    return sectionMeta as SectionMeta<any> as any;
  }
  varbs<SN extends SectionName>(sectionName: SN): VarbMetas<SN> {
    return this.get(sectionName).varbMetas;
  }
  varb<VNS extends VarbNames>(varbNames: VNS): VarbMeta<VNS["sectionName"]> {
    const { sectionName, varbName } = varbNames;
    return this.section(sectionName).varb(varbName);
  }
  value<VNS extends VarbNames>(varbNames: VNS) {
    return this.varb(varbNames).value;
  }
  valueByName<VN extends ValueName>(valueName: VN): ValueMeta<VN> {
    return valueMetas[valueName] as ValueMeta<VN>;
  }
  private static initCore(): SectionMetasCore {
    return sectionNames.reduce((core, sectionName) => {
      (core[sectionName] as SectionMeta<typeof sectionName>) =
        SectionMeta.init(sectionName);
      return core;
    }, {} as SectionMetasCore);
  }
}

export const sectionsMeta = new SectionsMeta();
