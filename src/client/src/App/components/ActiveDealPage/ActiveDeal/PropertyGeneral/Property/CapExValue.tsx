import styled from "styled-components";
import { CapExValueMode } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { SelectAndItemizeEditorSection } from "../../../../appWide/SelectAndItemizeEditorSection";
import { VarbListCapEx } from "../../../../appWide/VarbLists/VarbListCapEx";

export function CapExValue({ feId }: { feId: string }) {
  const capExValue = useSetterSection({
    sectionName: "capExValue",
    feId,
  });
  const valueMode = capExValue.value("valueMode") as CapExValueMode;
  const valueVarb = capExValue.get.switchVarb("value", "ongoing");
  const showEquals: CapExValueMode[] = ["fivePercentRent"];
  const equalsValue = showEquals.includes(valueMode)
    ? valueVarb.displayVarb()
    : undefined;

  return (
    <Styled
      {...{
        label: (
          <LabelWithInfo
            {...{
              label: "Capital Expense Budget",
              infoTitle: "Capital Expense Budget - What's That?",
              infoText: `Every property has expensive things that will eventually need to be replaced—things like the roof, furnace, water heater, etc. No long-term analysis of a property is complete without accounting for these inevitable costs.\n\nA common (and easy) method to account for these is to assume that all of capital expense costs together will on average amount to about 5% of the property's rental income.\n\nA more precise method is to go through each major capital expense and estimate both how much it would cost to replace it and how many years those replacements will likely last. From there, the app will calculate how much you should budget per month for each capital expense as well as their total.`,
            }}
          />
        ),
        selectValue: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          capExValue.varb("valueMode").updateValue(value);
        },
        menuItems: [
          [
            "fivePercentRent",
            `5% of rent${valueMode === "fivePercentRent" ? "" : " (simplest)"}`,
          ],
          [
            "itemize",
            `Itemize lifespan over cost${
              valueMode === "itemize" ? "" : " (more accurate)"
            }`,
          ],
          ["lumpSum", "Custom amount"],
        ],
        equalsValue,
        itemizedModalTitle: "CapEx Budget Itemizer",
        itemizeValue: "itemize",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <VarbListCapEx
            {...{
              feId: capExValue.oneChildFeId("capExList"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}

const Styled = styled(SelectAndItemizeEditorSection)``;
