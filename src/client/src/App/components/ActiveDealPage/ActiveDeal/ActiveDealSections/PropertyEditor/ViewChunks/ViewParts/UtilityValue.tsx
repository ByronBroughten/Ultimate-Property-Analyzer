import { DealMode } from "../../../../../../../sharedWithServer/SectionsMeta/values/StateValue/dealMode";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { SelectAndItemizeEditor } from "../../../../../../appWide/SelectAndItemizeEditor";
import { ListEditorOngoing } from "../../ValueShared/ListEditorOngoing";

type Props = { feId: string; propertyMode: DealMode };
export function UtilityValue({ feId, propertyMode }: Props) {
  const feInfo = { sectionName: "utilityValue", feId } as const;
  const utilityValue = useGetterSection(feInfo);
  const valueSourceName = utilityValue.valueNext("valueSourceName");
  const valueVarb = utilityValue.switchVarb("valueDollars", "periodic");
  const equalsValue = valueSourceName === "zero" ? "$0" : undefined;

  const twentyPercentLabel =
    propertyMode === "buyAndHold" ? "Twenty percent rent" : "Choose method";

  return (
    <SelectAndItemizeEditor
      inputMargins
      {...{
        selectProps: { sx: { minWidth: 170 } },
        unionValueName: "utilityValueSource",
        label: "Utilities",
        feVarbInfo: {
          ...feInfo,
          varbName: "valueSourceName",
        },
        items: [
          ["zero", "Tenant pays all utilities"],
          ["listTotal", "Itemize"],
        ],
        equalsValue,
        itemizedModalTitle: "Utilities",
        itemizeValue: "listTotal",
        total: valueVarb.displayVarb(),
        itemsComponent: (
          <ListEditorOngoing
            {...{
              feId: utilityValue.oneChildFeId("ongoingList"),
              menuType: "value",
              routeBtnProps: {
                title: "Utility Lists",
                routeName: "utilitiesListMain",
              },
              menuDisplayNames: [
                "Water/sewer",
                "Garbage",
                "Heat",
                "Misc energy",
              ],
            }}
          />
        ),
      }}
    />
  );
}