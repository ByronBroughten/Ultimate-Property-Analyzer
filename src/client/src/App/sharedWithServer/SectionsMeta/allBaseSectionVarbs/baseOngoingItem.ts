import { baseSectionVarbs } from "./baseSectionVarbs";
import { baseOptions } from "./baseUnits";
import { baseVarb, baseVarbsS } from "./baseVarbs";

const ongoingItemBase = {
  ...baseVarbsS.ongoingDollars("value"),
  valueEditor: baseVarb("numObj"),
  valueSourceSwitch: baseVarb("string"),
  ...baseVarbsS.displayNameAndEditor,
} as const;

export const baseOngoingItem = baseSectionVarbs(ongoingItemBase);
export const baseOngoingCheckmarkItem = baseSectionVarbs({
  ...ongoingItemBase,
  isActive: baseVarb("boolean"),
});

const capExItemBase = {
  ...baseVarbsS.displayNameAndEditor,
  ...baseVarbsS.ongoingDollars("value"),
  ...baseVarbsS.monthsYearsInput("lifespan"),
  costToReplace: baseVarb("numObj", baseOptions.dollars),
};

export const baseCapExItem = baseSectionVarbs(capExItemBase);
