import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { ValueGroupOngoing } from "../../../appWide/ListGroup/ValueGroupOngoing";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionOngoing } from "../../../appWide/ValueSectionOngoing";
import { BackToDealBtn } from "../BackToDealBtn";
import {
  CompletionStatus,
  MainDealSection,
  MainDealSectionProps,
} from "../MainDealSection";
import BasicPropertyInfo from "./Property/BasicPropertyInfo";
import { RepairValue } from "./Property/RepairValue";
import { Units } from "./Property/Units";
import { UtilityValue } from "./Property/UtilityValue";

export function Property({
  feId,
  showInputs,
  openInputs,
  closeInputs,
  hide,
  completionStatus,
}: MainDealSectionProps & {
  closeInputs: () => void;
  completionStatus: CompletionStatus;
}) {
  const feInfo = { sectionName: "property", feId } as const;
  const property = useGetterSection(feInfo);
  const completionStatusProps = {
    allEmpty: { title: "Start Property" },
    someInvalid: { title: "Continue Property" },
    allValid: { title: "Edit Property" },
  };

  const props = completionStatusProps[completionStatus];
  return (
    <Styled
      {...{
        ...feInfo,
        showInputs,
        openInputs,
        closeInputs,
        btnTitle: props.title,
        sectionTitle: "Property",
        hide,
        className: "Property-root",
        displayName: property.valueNext("displayName").mainText,
        completionStatus,
        detailVarbPropArr: property.varbInfoArr([
          "targetRentYearly",
          "expensesYearly",
          "upfrontExpenses",
        ] as const),
      }}
    >
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Property",
          loadWhat: "Property",
          showControls: showInputs ? true : false,
          rightTop: <BackToDealBtn onClick={closeInputs} />,
        }}
      />
      <MainSectionBody themeName="property">
        <BasicPropertyInfo feId={feId} className="Property-basicInfo" />
        <Units {...{ feId }} />
        <RepairValue feId={property.onlyChildFeId("repairValue")} />
        <UtilityValue feId={property.onlyChildFeId("utilityValue")} />
        <ValueGroupOngoing
          {...{
            className: "Property-ongoingCostGroup",
            feId: property.onlyChild("ongoingExpenseGroup").feId,
            titleText: "Ongoing Costs",
            extraValueChildren: (
              <>
                <ValueSectionOngoing
                  {...{
                    displayName: "CapEx",
                    feId: property.onlyChild("capExCostValue").feId,
                    className: "ValueGroup-value",
                    showXBtn: false,
                  }}
                />
                <ValueSectionOngoing
                  {...{
                    displayName: "Maintenance",
                    feId: property.onlyChild("maintenanceCostValue").feId,
                    className: "ValueGroup-value",
                    showXBtn: false,
                  }}
                />
              </>
            ),
          }}
        />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainDealSection)<{
  $showInputs?: boolean;
  $hide?: boolean;
}>`
  .Property-unitList {
  }

  .Property-basicInfo {
  }
  .Property-upfrontCostsGroup,
  .Property-ongoingCostGroup {
    padding-top: ${theme.s3};
  }
`;
