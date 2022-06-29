import { sectionsMeta } from "../SectionsMeta";
import { switchVarbNames } from "../SectionsMeta/baseSectionsUtils/baseSwitchNames";
import { InEntityVarbInfo } from "../SectionsMeta/baseSectionsUtils/baseValues/entities";
import { SectionName, sectionNameS } from "../SectionsMeta/SectionName";
import { GetterSectionsBase } from "../StateGetters/Bases/GetterSectionsBase";
import { GetterSections } from "../StateGetters/GetterSections";
import { Obj } from "../utils/Obj";

export type SectionOption = {
  dbId: string;
  displayName: string;
};
export type VariableOption = {
  varbInfo: InEntityVarbInfo;
  collectionName: string;
  displayName: string;
};

export class VariableGetterSections extends GetterSectionsBase {
  getterSections = new GetterSections(this.getterSectionsProps);
  variableOptions(): VariableOption[] {
    return [
      ...this.initStaticVarbOptions(),
      ...this.userVarbOptions(),
      ...this.userListTotalOptions(),
    ];
  }
  private userVarbOptions(): VariableOption[] {
    const { main } = this.getterSections;
    const childName = "userVarbList";
    const varbListFeIds = main.childFeIds("userVarbList");
    return varbListFeIds.reduce((options, feId) => {
      const listSection = main.child({ childName, feId });
      const userVarbItems = listSection.children("userVarbItem");
      const collectionName = listSection.value("title", "string");
      return options.concat(
        userVarbItems.map((item) => {
          return {
            displayName: item.varb("name").value("string"),
            collectionName,
            varbInfo: {
              ...item.uniqueIdInfoMixed("dbId"),
              varbName: "value",
            },
          };
        })
      );
    }, [] as VariableOption[]);
  }

  private userListTotalOptions(): VariableOption[] {
    const sectionToCollectionName: Record<
      SectionName<"additiveList">,
      string
    > = {
      ongoingList: "Ongoing cost totals",
      singleTimeList: "One time cost totals",
    };
    const options: VariableOption[] = [];
    for (const sectionName of sectionNameS.arrs.additiveList) {
      const collectionName = sectionToCollectionName[sectionName];
      const { main } = this.getterSections;
      const lists = main.children(sectionName);
      for (const list of lists) {
        const displayName = list.value("title", "string");
        if (sectionName === "ongoingList") {
          const ongoingNames = switchVarbNames("total", "ongoing");
          for (const key of Obj.keys(ongoingNames)) {
            if (key === "switch") continue;
            const varbName = ongoingNames[key];
            const varb = list.varb(varbName);
            options.push({
              varbInfo: varb.uniqueIdVarbInfoMixed("dbId"),
              displayName,
              collectionName,
            });
          }
        } else {
          const varb = list.varb("total");
          options.push({
            varbInfo: varb.uniqueIdVarbInfoMixed("dbId"),
            displayName,
            collectionName,
          });
        }
      }
    }
    return options;
  }
  private initStaticVarbOptions(): VariableOption[] {
    const sectionNames = sectionNameS.arrs.all;
    return sectionNames.reduce((options, sectionName) => {
      const sectionMeta = sectionsMeta.section(sectionName);
      const { varbNames } = sectionMeta;
      if (sectionNameS.is(sectionName, "hasGlobalVarbs"))
        options = options.concat(
          varbNames
            .map((varbName) => this.initStaticVarbOption(sectionName, varbName))
            .filter((val) => val.displayName !== "")
        );
      return options;
    }, [] as VariableOption[]);
  }
  private initStaticVarbOption(
    sectionName: SectionName<"hasGlobalVarbs">,
    varbName: string
  ): VariableOption {
    const varbMeta = sectionsMeta.varb({
      sectionName,
      varbName,
    });
    const sectionMeta = sectionsMeta.section(sectionName);

    return {
      varbInfo: {
        sectionName,
        varbName,
        id: "static",
        idType: "relative",
      },
      collectionName: sectionMeta.displayName,
      displayName: varbMeta.displayName as string,
    };
  }
}
