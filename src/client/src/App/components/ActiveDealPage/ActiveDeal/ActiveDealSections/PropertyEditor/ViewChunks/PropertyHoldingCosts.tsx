import { FeIdProp } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { MuiRow } from "../../../../../general/MuiRow";
import { PeriodicEditor } from "../../../../../inputs/PeriodicEditor";
import { TimespanEditor } from "../../../../../inputs/TimespanEditor";
import { MiscHoldingCost } from "./ViewParts/MiscHoldingCost";
import { UtilityValue } from "./ViewParts/UtilityValue";

export function PropertyHoldingCosts({ feId }: FeIdProp) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  const taxes = property.onlyChild("taxesHolding");
  const homeIns = property.onlyChild("homeInsHolding");
  return (
    <FormSectionLabeled label="Holding Costs">
      <MuiRow>
        <TimespanEditor
          inputMargins
          {...{
            feId: property.onlyChildFeId("holdingPeriod"),
            labelNames: property.varbInfo2("holdingPeriodMonths"),
          }}
        />
        <PeriodicEditor
          inputMargins
          feId={taxes.onlyChildFeId("valueDollarsEditor")}
          labelNames={{
            sectionName: "taxesValue",
            varbBaseName: "valueDollars",
          }}
        />
        <PeriodicEditor
          inputMargins
          editorType="equation"
          feId={homeIns.onlyChildFeId("valueDollarsEditor")}
          labelNames={{
            sectionName: "homeInsValue",
            varbBaseName: "valueDollars",
          }}
          quickViewVarbNames={["purchasePrice", "sqft", "numUnits"]}
        />
        <UtilityValue
          propertyMode={property.valueNext("propertyMode")}
          periodicMode={"holding"}
          feId={property.onlyChildFeId("utilityHolding")}
        />
        <MiscHoldingCost feId={property.onlyChildFeId("miscHoldingCost")} />
      </MuiRow>
    </FormSectionLabeled>
  );
}
