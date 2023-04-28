import { StateValue } from "../../../../../sharedWithServer/SectionsMeta/values/StateValue";
import { validateStateValue } from "../../../../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useAction } from "../../../../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { SelectEditorSection } from "../../../../appWide/SelectEditorSection";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

export function MaintenanceValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "maintenanceValue", feId } as const;
  const updateValue = useAction("updateValue");
  const maintenanceValue = useGetterSection(feInfo);
  const valueSourceName = maintenanceValue.valueNext("valueSourceName");
  const valueVarb = maintenanceValue.switchVarb("value", "ongoing");
  const showEquals: StateValue<"maintainanceValueSource">[] = [
    "onePercentAndSqft",
    "onePercentPrice",
    "sqft",
  ];

  const equalsValue = showEquals.includes(valueSourceName)
    ? valueVarb.displayVarb()
    : undefined;

  const menuItems: [StateValue<"maintainanceValueSource">, string][] = [
    ["onePercentPrice", "1% purchase price"],
    ["sqft", "$1 per sqft"],
    ["onePercentAndSqft", "1% purchase price and $1 sqft, average"],
    ["valueEditor", "Custom amount"],
  ];

  if (valueSourceName === "none") {
    menuItems.push(["none", "Choose method"]);
  }

  return (
    <SelectEditorSection
      {...{
        label: (
          <LabelWithInfo
            {...{
              label: "Ongoing Maintenance Budget",
              infoTitle: "Ongoing Maintenance Budget",
              infoText: `Every property needs minor repairs from time to time. Doorknobs break. Oven igniters die. Pipes burst. To account for these and other miscellaneous happenings, there are a few common methods.\n\nThe first is to assume you will spend $1 per property square foot per year. The idea is that the more square feet there is, the more opportunity there is for something to go wrong.\n\nAnother common method is to assume that miscellanious repairs will cost 1% of the property's purchase price (or after repair value) per year. The reasoning here is that more expensive properties may generally have more expensive components that require more expensive repairs.\n\nAnd then there's a third method which is just to use the average between the other two.\n\nThere are probably other, more creative methods out there that work just as well, if not better. By selecting the "custom amount" method, you are free to enter or concoct any equation that suits you.`,
            }}
          />
        ),
        selectValue: valueSourceName,
        onChange: (e) => {
          updateValue({
            ...feInfo,
            varbName: "valueSourceName",
            value: validateStateValue(
              e.target.value,
              "maintainanceValueSource"
            ),
          });
        },
        menuItems,
        equalsValue,
        makeEditor:
          valueSourceName === "valueEditor"
            ? (props) => (
                <NumObjEntityEditor
                  {...{
                    ...props,
                    feVarbInfo: maintenanceValue.varbInfo("valueDollarsEditor"),
                    quickViewVarbNames: ["sqft", "numUnits", "numBedrooms"],
                  }}
                />
              )
            : undefined,
      }}
    />
  );
}
