import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { FormSectionNext } from "../../../../../appWide/FormSectionNext";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { MiscIncomeValue } from "./ViewParts/MiscIncomeValue";
import { UnitsNext } from "./ViewParts/UnitsNext";

type Props = { feId: string };
export function BasicBuyAndHoldInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  return (
    <FormSectionNext>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("purchasePrice")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("yearBuilt")}
        />
      </MuiRow>
      <UnitsNext feId={feId} />
      <MiscIncomeValue feId={property.onlyChildFeId("miscOngoingRevenue")} />
    </FormSectionNext>
  );
}
