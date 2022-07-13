import { numObj } from "../../baseSectionsUtils/baseValues/NumObj";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { relVarb } from "../rel/relVarb";

export const userVarbItemRelVarbs = {
  name: relVarb("string"),
  startAdornment: relVarb("string"),
  endAdornment: relVarb("string"),
  valueSwitch: relVarb("string", {
    initValue: "labeledEquation",
  }),
  editorValue: relVarb("numObj"),
  value: relVarb("numObj", {
    displayName: relVarbInfoS.local("name"),
    updateFnName: "userVarb",
    initValue: numObj(0),
    updateFnProps: {
      ...relVarbInfosS.localByVarbName(["valueSwitch", "editorValue"]),
      ...relVarbInfosS.namedChildren("conditionalRow", {
        rowLevel: "level",
        rowType: "type",
        rowLeft: "left",
        rowOperator: "operator",
        rowRightValue: "rightValue",
        rowRightList: "rightList",
        rowThen: "then",
      }),
    },
  }),
} as const;