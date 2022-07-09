import { switchNames } from "../../baseSectionsUtils/switchNames";
import { relVarbInfoS } from "../../childSectionsDerived/RelVarbInfo";
import { relVarbInfosS } from "../../childSectionsDerived/RelVarbInfos";
import { rel } from "../rel";
import { RelVarbs, relVarbsS } from "../relVarbs";

const rentCut = switchNames("rentCut", "dollarsPercent");
const rentCutDollars = switchNames(rentCut.dollars, "ongoing");

export function mgmtRelVarbs<R extends RelVarbs<"mgmt">>(): R {
  return {
    ...relVarbsS.savableSection,
    [rentCut.switch]: rel.varb.string({
      initValue: "percent",
    }),
    [rentCut.percent]: rel.varb.percentObj("Rent cut", {
      initNumber: 5,
      inUpdateSwitchProps: [
        rel.updateSwitch.divideToPercent(
          rentCut.switch,
          "dollars",
          relVarbInfoS.local(rentCutDollars.monthly),
          relVarbInfoS.pibling(
            "propertyGeneral",
            "propertyGeneral",
            "targetRentMonthly",
            { expectedCount: "onlyOne" }
          )
        ),
      ],
    }),
    // SectionsMeta is the highest level.
    [rentCutDollars.switch]: rel.varb.string({
      initValue: "monthly",
    }),
    [rentCutDollars.monthly]: rel.varb.moneyMonth("Rent cut", {
      initNumber: 0,
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          "rentCut",
          relVarbInfoS.pibling(
            "propertyGeneral",
            "propertyGeneral",
            "targetRentMonthly",
            { expectedCount: "onlyOne" }
          )
        ),
        rel.updateSwitch.yearlyToMonthly("rentCutDollars"),
      ],
    }),
    [rentCutDollars.yearly]: rel.varb.moneyYear("Rent cut", {
      inUpdateSwitchProps: [
        rel.updateSwitch.percentToDecimalTimesBase(
          "rentCut",
          relVarbInfoS.pibling(
            "propertyGeneral",
            "propertyGeneral",
            "targetRentYearly",
            { expectedCount: "onlyOne" }
          )
        ),
        rel.updateSwitch.monthlyToYearly("rentCutDollars"),
      ],
    }),
    vacancyRatePercent: rel.varb.percentObj("Vacancy Rate", {
      initNumber: 5,
      endAdornment: "%",
    }),
    ...relVarbsS.ongoingPercentToPortion(
      "vacancyLossDollars",
      "Vacancy rent lost",
      (baseVarbName) => {
        return relVarbInfoS.stepSibling(
          "propertyGeneral",
          "propertyGeneral",
          baseVarbName
        );
      },
      "targetRent",
      "vacancyRatePercent"
    ),
    upfrontExpenses: rel.varb.sumNums(
      "Upfront expenses",
      [relVarbInfoS.children("upfrontCostList", "total")],
      { startAdornment: "$" }
    ),
    ...relVarbsS.ongoingSumNums(
      "ongoingExpenses",
      "Ongoing mangement expenses",
      [
        relVarbInfoS.children("ongoingCostList", "total"),
        ...relVarbInfosS.local(["vacancyLossDollars", "rentCutDollars"]),
      ],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  } as R;
}
