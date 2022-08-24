import React from "react";
import styled from "styled-components";
import { useGetterSection } from "../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../theme/Theme";
import DealStats from "./ActiveDeal/DealStats";
import Financing from "./ActiveDeal/Financing";
import { MgmtGeneral } from "./ActiveDeal/MgmtGeneral";
import { PropertyGeneral } from "./ActiveDeal/PropertyGeneral";

type Props = {
  feId: string;
  loginSuccess?: boolean;
  className?: string;
};
export function ActiveDeal({ className, feId }: Props) {
  const deal = useGetterSection({
    sectionName: "deal",
    feId,
  });
  return (
    <Styled {...{ className: `MainSections-root ${className ?? ""}` }}>
      <PropertyGeneral feId={deal.onlyChildFeId("propertyGeneral")} />
      <Financing feId={deal.onlyChildFeId("financing")} />
      <MgmtGeneral feId={deal.onlyChildFeId("mgmtGeneral")} />
      <DealStats className="Footer-root" feId={feId} />
    </Styled>
  );
}

const Styled = styled.div`
  background: ${theme.mgmt.light};
  display: flex;
  flex-direction: column;
  flex: 1;
`;
