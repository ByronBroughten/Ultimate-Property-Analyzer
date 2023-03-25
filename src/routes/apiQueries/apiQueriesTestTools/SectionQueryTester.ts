import { IndexSectionQuerierBase } from "../../../client/src/App/modules/QueriersBasic/Bases/IndexSectionQuerierBase";
import { ApiQueries } from "../../../client/src/App/sharedWithServer/apiQueriesShared";
import {
  DbPackInfoSectionReq,
  makeReq,
  SectionPackReq,
} from "../../../client/src/App/sharedWithServer/apiQueriesShared/makeReqAndRes";
import { SectionNameByType } from "../../../client/src/App/sharedWithServer/SectionsMeta/SectionNameByType";
import { StoreName } from "../../../client/src/App/sharedWithServer/SectionsMeta/sectionStores";
import { GetterListProps } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterListBase";
import { GetterSectionProps } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionBase";
import { GetterSectionsBase } from "../../../client/src/App/sharedWithServer/StateGetters/Bases/GetterSectionsBase";
import { GetterList } from "../../../client/src/App/sharedWithServer/StateGetters/GetterList";
import { GetterSection } from "../../../client/src/App/sharedWithServer/StateGetters/GetterSection";
import { PackMakerSection } from "../../../client/src/App/sharedWithServer/StatePackers.ts/PackMakerSection";
import { SolverSection } from "../../../client/src/App/sharedWithServer/StateSolvers/SolverSection";
import { SolverSections } from "../../../client/src/App/sharedWithServer/StateSolvers/SolverSections";
import { UpdaterSection } from "../../../client/src/App/sharedWithServer/StateUpdaters/UpdaterSection";

export function makeLastSectionProps<SN extends SectionNameByType>(
  props: GetterListProps<SN>
): GetterSectionProps<SN> {
  const list = new GetterList(props);
  const { feInfo } = list.last;
  return {
    ...props,
    ...feInfo,
  };
}

interface InitProps<SN extends SectionNameByType<"hasIndexStore">> {
  sectionName: SN;
}

export class SectionQueryTester<
  SN extends SectionNameByType<"hasIndexStore">
> extends IndexSectionQuerierBase<SN> {
  get packMaker() {
    return new PackMakerSection(this.getterSectionBase.getterSectionProps);
  }
  get get() {
    return new GetterSection(this.indexSectionQuerierProps);
  }
  get updater() {
    return new UpdaterSection(this.indexSectionQuerierProps);
  }
  get solver() {
    return SolverSection.init(this.indexSectionQuerierProps);
  }
  get mainStoreName(): StoreName<SN> {
    return this.get.mainStoreName as StoreName<SN>;
  }
  static init<S extends SectionNameByType<"hasIndexStore">>({
    sectionName,
  }: InitProps<S>): SectionQueryTester<S> {
    return new SectionQueryTester({
      apiQueries: {} as ApiQueries,
      ...makeLastSectionProps({
        sectionName,
        ...GetterSectionsBase.initProps({
          sections: SolverSections.initSectionsFromDefaultMain(),
        }),
      }),
    });
  }
  makeSectionPackReq(): SectionPackReq<any> {
    return makeReq({
      dbStoreName: this.mainStoreName,
      sectionPack: this.packMaker.makeSectionPack(),
    }) as SectionPackReq<any>;
  }
  makeDbInfoReq(): DbPackInfoSectionReq<any> {
    return makeReq({
      dbStoreName: this.mainStoreName,
      dbId: this.get.dbId,
    });
  }
}
