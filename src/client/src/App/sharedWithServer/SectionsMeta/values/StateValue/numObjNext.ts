import { ValueFixedVarbPathName } from "../../../StateEntityGetters/pathNameOptions";
import { fullDisplayNameString } from "../../allDisplaySectionVarbs";
import { Id } from "../../id";
import {
  getVarbPathParams,
  varbPathInfo,
} from "../../SectionInfo/VarbPathNameInfo";
import { pathSectionName } from "../../sectionPathContexts/sectionPathNames";
import { NumObj } from "./NumObj";
import { ValueInEntity } from "./valuesShared/entities";

export function numObjNext(...propArr: EntityNumObjPropArr): NumObj {
  let mainText: string = "";
  let solvableText: string = "";
  const entities: ValueInEntity[] = [];
  for (const prop of propArr) {
    if (typeof prop === "string") {
      mainText += prop;
      solvableText += prop;
    } else if (typeof prop === "number") {
      mainText += `${prop}`;
      solvableText += `${prop}`;
    } else {
      const varbPathName = prop[0];
      const entityInfo = varbPathInfo(varbPathName);
      const { pathName, varbName } = getVarbPathParams(varbPathName);
      const sectionName = pathSectionName(pathName);

      const fullDisplayName = fullDisplayNameString(
        sectionName,
        varbName as any
      );

      const text = fullDisplayName;
      entities.push({
        ...entityInfo,
        entityId: Id.make(),
        length: text.length,
        offset: mainText.length,
        entitySource: "editor",
      });
      mainText += text;
      solvableText += "?";
    }
  }
  entities.sort((a, b) => b.offset - a.offset);
  return {
    mainText,
    entities,
    solvableText,
  };
}

type EntityNumObjPropArr = (number | string | [ValueFixedVarbPathName])[];
