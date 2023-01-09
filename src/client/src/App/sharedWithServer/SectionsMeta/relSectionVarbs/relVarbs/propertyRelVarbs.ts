import { relVarbS } from "../rel/relVarb";
import { updateFnPropS, updateFnPropsS } from "../rel/relVarb/UpdateFnProps";
import { RelVarbs, relVarbsS } from "../relVarbs";

export function propertyRelVarbs(): RelVarbs<"property"> {
  return {
    ...relVarbsS._typeUniformity,
    ...relVarbsS.savableSection,

    price: relVarbS.moneyObj("Purchase price"),
    sqft: relVarbS.calcVarb("Square feet"),
    ...relVarbsS.timeMoneyInput("taxes", "Taxes", {
      switchInit: "yearly",
    }),

    arv: relVarbS.moneyObj("ARV"),
    sellingCosts: relVarbS.moneyObj("Selling costs"),

    numUnits: relVarbS.sumChildVarb("Unit count", "unit", "one"),
    numBedrooms: relVarbS.sumChildVarb("Bedroom count", "unit", "numBedrooms"),
    upfrontExpenses: relVarbS.sumMoney("Upfront expenses", [
      updateFnPropS.local("price"),
      updateFnPropS.children("repairCostValue", "value"),
      updateFnPropS.children("upfrontExpenseGroup", "total"),
    ]),
    upfrontRevenue: relVarbS.sumMoney("Upfront revenues", [
      updateFnPropS.children("upfrontRevenueGroup", "total"),
    ]),

    ...relVarbsS.ongoingSumNums(
      "expenses",
      "Ongoing expenses",
      [
        updateFnPropS.local("taxes"),
        updateFnPropS.local("homeIns"),
        updateFnPropS.onlyChild("capExCostValue", "value"),
        updateFnPropS.onlyChild("maintenanceCostValue", "value"),
        updateFnPropS.children("utilityCostValue", "value"),
        updateFnPropS.children("ongoingExpenseGroup", "total"),
      ],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    // ongoing revenue
    ...relVarbsS.timeMoneyInput("homeIns", "Home insurance", {
      switchInit: "yearly",
    }),
    ...relVarbsS.monthsYearsInput("holdingPeriod", "Holding period", {
      switchInit: "months",
    }),
    ...relVarbsS.ongoingSumNums(
      "miscRevenue",
      "Revenue besides rent",
      [updateFnPropS.children("ongoingRevenueGroup", "total")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "targetRent",
      "Rent",
      [updateFnPropS.children("unit", "targetRent")],
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
    ...relVarbsS.ongoingSumNums(
      "revenue",
      "Property revenue",
      updateFnPropsS.localArr(["targetRent", "miscRevenue"]),
      { switchInit: "monthly", shared: { startAdornment: "$" } }
    ),
  };
}
