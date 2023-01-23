import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { ValueSectionZone } from "../../../appWide/ValueSectionZone";
import {
  CompletionStatus,
  MainDealSection,
  MainDealSectionProps,
} from "../MainDealSection";
import { BackToDealBtn } from "./../BackToDealBtn";
import { BasicMgmtInfo } from "./Mgmt/BasicMgmtInfo";

export function Mgmt({
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
  const feInfo = { sectionName: "mgmt", feId } as const;
  const mgmt = useGetterSection(feInfo);
  return (
    <Styled
      {...{
        ...feInfo,
        hide,
        showInputs,
        openInputs,
        closeInputs,
        className: "Mgmt-root",
        sectionTitle: "Management",
        completionStatus,
        displayName: mgmt.valueNext("displayName").mainText,
        detailVarbPropArr: mgmt.varbInfoArr(["expensesYearly"] as const),
      }}
    >
      <MainSectionTopRows
        {...{
          ...feInfo,

          sectionTitle: "Management",
          loadWhat: "Management",
          rightTop: <BackToDealBtn onClick={closeInputs} />,
        }}
      />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="Mgmt-basicInfo" />
        <div className="Mgmt-valueSectionZones">
          <ValueSectionZone
            {...{
              className: "Mgmt-ongoingExpenseValue",
              ...feInfo,
              childName: "ongoingExpenseValue",
              displayName: "Other Ongoing Expenses",
              plusBtnText: "+ Other Ongoing Expenses",
            }}
          />
          <ValueSectionZone
            {...{
              ...feInfo,
              className: "Mgmt-oneTimeExpenseValue",
              childName: "upfrontExpenseValue",
              displayName: "One-Time Expenses",
              plusBtnText: "+ One-Time Expenses",
            }}
          />
        </div>
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled(MainDealSection)`
  .Mgmt-basicInfo,
  .Mgmt-ongoingExpenseValue,
  .Mgmt-oneTimeExpenseValue {
    margin: ${theme.flexElementSpacing};
  }
  :hover {
    .MainSectionTitleRow-xBtn {
      visibility: visible;
    }
  }
  .Mgmt-valueSectionZones {
    display: flex;
    margin-top: ${theme.s35};
  }

  .ValueSectionBtn-root {
    width: 150px;
  }
`;
