import { useToggleView } from "../../../../../../../modules/customHooks/useToggleView";
import { FeIdProp } from "../../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SubSectionBtn } from "../../../../../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { StyledActionBtn } from "../../../../../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { LabeledVarbRow } from "../../../../../../appWide/LabeledVarbRow";
import { ModalSection } from "../../../../../../appWide/ModalSection";
import { MuiRow } from "../../../../../../general/MuiRow";
import { icons } from "../../../../../../Icons";
import { UnitList } from "../Units/UnitList";

export function UnitsNext({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });
  const hasUnits = property.childFeIds("unit").length > 0;
  const { unitsIsOpen, openUnits, closeUnits } = useToggleView("units", false);
  return (
    <>
      <MuiRow>
        {hasUnits && (
          <>
            <StyledActionBtn
              {...{
                onClick: openUnits,
                middle: "Edit Units",
                left: icons.edit(),
                sx: {
                  fontSize: nativeTheme.inputLabel.fontSize,
                  marginRight: nativeTheme.s35,
                  border: `solid 1px ${nativeTheme["gray-300"]}`,
                  height: "60px",
                  borderRadius: nativeTheme.muiBr0,
                },
              }}
            />
            <LabeledVarbRow
              {...{
                varbPropArr: property.varbInfoArr([
                  "numUnits",
                  "numBedrooms",
                  "targetRentYearly",
                ] as const),
              }}
            />
          </>
        )}
        {!hasUnits && (
          <SubSectionBtn
            {...{
              onClick: openUnits,
              left: icons.addUnit({ size: 22 }),
              middle: "Add Units",
              sx: {
                fontSize: nativeTheme.inputLabel.fontSize,
                borderRadius: nativeTheme.muiBr0,
                lineHeight: "1.2rem",
                height: 60,
                width: 140,
                ...nativeTheme.editorMargins,
              },
            }}
          />
        )}
      </MuiRow>
      <ModalSection
        {...{
          title: "Units",
          show: unitsIsOpen,
          closeModal: closeUnits,
        }}
      >
        <UnitList
          {...{
            feId,
            className: "Units-unitList",
          }}
        />
      </ModalSection>
    </>
  );
}
