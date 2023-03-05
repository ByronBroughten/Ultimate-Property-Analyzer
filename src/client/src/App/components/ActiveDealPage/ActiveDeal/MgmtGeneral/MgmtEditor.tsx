import styled from "styled-components";
import { DealMode } from "../../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import theme from "../../../../theme/Theme";
import MainSectionBody from "../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../appWide/MainSectionTopRows";
import { BackToSectionBtn } from "../BackToSectionBtn";
import { CustomExpenses } from "../PropertyGeneral/Property/CustomExpenses";
import { BasicMgmtInfo } from "./Mgmt/BasicMgmtInfo";

type Props = {
  feId: string;
  dealMode: DealMode;
  backBtnProps: {
    backToWhat: string;
    onClick: () => void;
  };
};

export function MgmtEditor({ feId, backBtnProps }: Props) {
  const feInfo = { sectionName: "mgmt", feId } as const;
  return (
    <Styled>
      <MainSectionTopRows
        {...{
          ...feInfo,
          sectionTitle: "Management",
          loadWhat: "Management",
          topRight: <BackToSectionBtn {...backBtnProps} />,
        }}
      />
      <MainSectionBody themeName="mgmt">
        <BasicMgmtInfo feId={feId} className="Mgmt-basicInfo" />
        <CustomExpenses {...feInfo} />
      </MainSectionBody>
    </Styled>
  );
}

const Styled = styled.div`
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
