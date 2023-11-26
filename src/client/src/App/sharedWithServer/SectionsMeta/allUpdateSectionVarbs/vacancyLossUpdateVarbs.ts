import { GroupKey, groupNameEnding } from "../GroupName";
import { UpdateSectionVarbs } from "../updateSectionVarbs/updateSectionVarbs";
import { uvS } from "../updateSectionVarbs/updateVarb";
import {
  OverrideBasics,
  uosbS,
} from "../updateSectionVarbs/updateVarb/OverrideBasics";
import { ubS } from "../updateSectionVarbs/updateVarb/UpdateBasics";
import { upS } from "../updateSectionVarbs/updateVarb/UpdateFnProps";
import { uvsS } from "../updateSectionVarbs/updateVarbs";
import { usvs } from "./../updateSectionVarbs/updateSectionVarbs";

export function vacancyLossUpdateVarbs(): UpdateSectionVarbs<"vacancyLossValue"> {
  return usvs("vacancyLossValue", {
    valueSourceName: uvS.input("vacancyLossValueSource", {
      initValue: "none",
    }),
    valuePercentEditor: uvS.input("numObj"),
    valuePercent: uvS.vsNumObj("vacancyLossValueSource", {
      none: ubS.emptyNumObj,
      fivePercentRent: ubS.decimalToPercent("valueDecimal"),
      tenPercentRent: ubS.decimalToPercent("valueDecimal"),
      valuePercentEditor: ubS.loadLocal("valuePercentEditor"),
      valueDollarsEditor: ubS.decimalToPercent("valueDecimal"),
    }),
    valueDecimal: uvS.vsNumObj("vacancyLossValueSource", {
      none: ubS.emptyNumObj,
      fivePercentRent: ubS.pointZeroFive,
      tenPercentRent: ubS.pointOne,
      valuePercentEditor: ubS.percentToDecimal("valuePercentEditor"),
      valueDollarsEditor: ubS.divide(
        "valueDollarsMonthly",
        upS.varbPathName("targetRentMonthly")
      ),
    }),
    ...uvsS.periodic2("valueDollars", {
      monthly: valueDollars("monthly"),
      yearly: valueDollars("yearly"),
    }),
  });
}

function valueDollars(groupKey: GroupKey<"periodic">): OverrideBasics {
  const ending = groupNameEnding("periodic", groupKey);
  return uosbS.valueSource("vacancyLossValueSource", {
    none: ubS.emptyNumObj,
    fivePercentRent: ubS.varbPathName(`fivePercentRent${ending}`),
    tenPercentRent: ubS.varbPathName(`tenPercentRent${ending}`),
    valuePercentEditor: ubS.multiply(
      "valueDecimal",
      upS.varbPathName(`targetRent${ending}`)
    ),
    valueDollarsEditor: ubS.loadChild("periodicEditor", `value${ending}`),
  });
}
