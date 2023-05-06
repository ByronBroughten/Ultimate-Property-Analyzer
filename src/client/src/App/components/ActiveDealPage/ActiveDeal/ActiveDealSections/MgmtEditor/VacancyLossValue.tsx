import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { ValueFixedVarbPathName } from "../../../../../sharedWithServer/StateEntityGetters/ValueInEntityInfo";
import { GetterSection } from "../../../../../sharedWithServer/StateGetters/GetterSection";
import { LabelWithInfo } from "../../../../appWide/LabelWithInfo";
import { SelectEditorNext } from "../../../../appWide/SelectEditorNext";
import { NumObjEntityEditor } from "../../../../inputs/NumObjEntityEditor";

function getProps(getter: GetterSection<"vacancyLossValue">): {
  equalsValue?: string;
  editorProps?: {
    quickViewVarbNames: ValueFixedVarbPathName[];
    feVarbInfo: FeVarbInfo;
  };
} {
  const valueSourceName = getter.valueNext("valueSourceName");
  const dollarsVarb = getter.activeSwitchTarget("valueDollars", "ongoing");
  const dollarsSwitch = getter.switchValue("valueDollars", "ongoing");

  const commonQuickAccess = ["sqft", "numUnits"] as const;
  const dollarsQuickAccess = {
    monthly: "targetRentMonthly",
    yearly: "targetRentYearly",
  } as const;

  switch (valueSourceName) {
    case "none":
      return {};
    case "fivePercentRent":
    case "tenPercentRent":
      return { equalsValue: dollarsVarb.displayVarb() };
    case "percentOfRentEditor":
      return {
        equalsValue: dollarsVarb.displayVarb(),
        editorProps: {
          feVarbInfo: getter.varbNext("valuePercentEditor").feVarbInfo,
          quickViewVarbNames: [...commonQuickAccess],
        },
      };
    case "dollarsEditor": {
      return {
        equalsValue: `${getter.displayVarb("valuePercent")} of rent`,
        editorProps: {
          feVarbInfo: getter.varbNext("valueDollarsOngoingEditor").feVarbInfo,
          quickViewVarbNames: [
            dollarsQuickAccess[dollarsSwitch],
            ...commonQuickAccess,
          ],
        },
      };
    }
  }
}

export function VacancyLossValue({ feId }: { feId: string }) {
  const feInfo = { sectionName: "vacancyLossValue", feId } as const;
  const vacancyLoss = useGetterSection(feInfo);
  const { editorProps, equalsValue } = getProps(vacancyLoss);
  const valueSourceName = vacancyLoss.valueNext("valueSourceName");
  return (
    <SelectEditorNext
      {...{
        selectProps: { sx: { minWidth: 140 } },
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        unionValueName: "vacancyLossValueSource",
        items: [
          [
            "fivePercentRent",
            `5% rent${
              valueSourceName === "fivePercentRent"
                ? ""
                : " (common low estimate)"
            }`,
          ],
          [
            "tenPercentRent",
            `10% rent${
              valueSourceName === "tenPercentRent"
                ? ""
                : " (common high estimate)"
            }`,
          ],
          ["percentOfRentEditor", "Custom percent of rent"],
          ["dollarsEditor", "Custom dollar amount"],
        ],
        label: (
          <LabelWithInfo
            {...{
              label: "Vacancy Loss",
              infoTitle: "Vacancy Loss",
              infoText: `No property will be fully occupied 100% of the time. When tenants move out, it can sometimes take days or weeks to prepare their unit for another renter. To account for this, assume you will miss out on a certain portion of the property's rent.\n\nIf you're owner-managing the property and you're determined to keep vacancy low, a common method is to asume you will miss out on 5% of the rent; and if you're using a property manager or management company (who probably won't be quite as motivated as you), something like 10% is common to assume.`,
            }}
          />
        ),
        equalsValue,
        makeEditor: editorProps
          ? (props) => (
              <NumObjEntityEditor
                {...{
                  ...props,
                  ...editorProps,
                }}
              />
            )
          : undefined,
      }}
    />
  );
}